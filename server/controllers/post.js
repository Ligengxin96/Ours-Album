import mongoose from 'mongoose';
import { SQLParser } from 'sql-in-mongodb';
import { NONE, POST_NOT_EXIST, SERVER_UNKNOWN_ERROR, UNAUTH } from '../config/errorCode.js';
import PostModel from "../models/post.js";
import util from "util";
import redis from 'redis';
import dotenv from 'dotenv';

import deleteCache from '../utils/deleteCache.js';
import { processResponseData } from "../utils/processResponseData.js";

dotenv.config();

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: process.env.REDIS_PORT || 6379,
    retry_strategy: () => 1000,
    connect_timeout: 10000
});

redisClient.on('connect', () => {
    console.log(new Date(), process.pid, 'Redis connected');
});

redisClient.on('error', (error) => {
    console.log(new Date(), process.pid, `Redis error: ${error.message}`);
});


redisClient.get = util.promisify(redisClient.get);
redisClient.set = util.promisify(redisClient.set);
redisClient.expire = util.promisify(redisClient.expire);
redisClient.keys = util.promisify(redisClient.keys);
redisClient.del = util.promisify(redisClient.del);

const processStrInSql = (str) => {
    return str.replace(/['"]/g, '\\$&')
}

export const getPosts = async (req, res) => {
    try {
        const { title = '', message = '', tags = [], currentPage = 1, limit = 8 } = req.query;

        console.log(new Date(), process.pid, `Finding posts, title is '${title}', message is '${message}', tags is '${tags}', currentPage is ${currentPage}`);

        const key = `-${title}-${message}-${tags}-${currentPage}`;
        const cacheValue = await redisClient.get(key);
        if (cacheValue) {
            console.log(new Date(), process.pid, `Get Response from Redis, key: ${key}`);
            await redisClient.expire(key, 1800);
            return res.status(200).json(JSON.parse(cacheValue));
        }

        const startIndex = (currentPage - 1) * limit;
        const parser = new SQLParser();
        let sqlQuery = ''

        if (title) {
            sqlQuery = `where title like '%${processStrInSql(title)}%'`;
        }
        if (message) {
            sqlQuery = sqlQuery ? `${sqlQuery} and message like '%${processStrInSql(message)}%'` : `where message like '%${processStrInSql(message)}%'`;
        }
        if (tags?.length > 0) {
            const tag = tags.split(',').map(tag => `'${tag}'`).join(',');
            sqlQuery = sqlQuery ? `${sqlQuery} and tags in (${tag})` : `where tags in (${tag})`;
        }

        console.log(new Date(), process.pid, `sql query: ${sqlQuery}`);

        const queryCondition = parser.parseSql(sqlQuery);

        console.log(new Date(), process.pid, `queryCondition: ${JSON.stringify(queryCondition)}`);

        const total = await PostModel.countDocuments(queryCondition);
        const post = await PostModel.find(queryCondition).sort({ createdTime: 1 }).skip(startIndex % total).limit(limit);
        const resData = processResponseData(200, post, NONE, null, { currentPage, maxPage: Math.ceil(total / limit) });

        console.log(new Date(), process.pid, `Set cache to redis, key: ${key}`);
        await redisClient.set(key, JSON.stringify(resData));
        await redisClient.expire(key, 1800);

        console.log(new Date(), process.pid, `Get posts successful. Find posts count: ${post.length}, totalCount: ${total}, currentPage: ${currentPage}, maxPage: ${Math.ceil(total / limit)}`);

        res.status(200).json(resData);
    } catch (error) {
        const resData = processResponseData(500, [], SERVER_UNKNOWN_ERROR, error.message);
        console.error(new Date(), process.pid, 'Error occrence when get posts with error: ', error.message);
        res.status(500).json(resData);
    }
}

export const getPostById = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(new Date(), process.pid, `Finding post by id, id is ${id}`);

        const cacheValue = await redisClient.get(id);
        if (cacheValue) {
            console.log(new Date(), process.pid, `Get Response from Redis, key: ${id}`);
            await redisClient.expire(id, 1800);
            return res.status(200).json(JSON.parse(cacheValue));
        }

        const post = await PostModel.findById(id);
        const total = await PostModel.countDocuments();
        const resData = processResponseData(200, post, NONE, null, { currentPage: 1, maxPage: Math.ceil(total / 8) });

        console.log(new Date(), process.pid, `Set cache to redis, key: ${id}`);
        await redisClient.set(id, JSON.stringify(resData));
        await redisClient.expire(id, 1800);

        console.log(new Date(), process.pid, 'Get post successful. Find post count:', post.length);

        res.status(200).json(resData);
    } catch (error) {
        const resData = processResponseData(500, [], SERVER_UNKNOWN_ERROR, error.message);
        console.error(new Date(), process.pid, 'Error occrence when get post by id with error: ', error.message);
        res.status(500).json(resData);
    }
}

export const createPost = async (req, res) => {
    const post = req.body;
    const newPostMessage = new PostModel({ ...post, creatorId: req.userId, creator: req.username })
    try {
        console.log(new Date(), process.pid, 'Creating post...');

        if (!req.userId) {
            const resData = processResponseData(403, [], UNAUTH);
            console.log(new Date(), process.pid, 'Creating post faild, access denied.');
            return res.status(403).json(resData);
        }

        const savedPostMessage = await newPostMessage.save();
        const resData = processResponseData(201, savedPostMessage);
        console.log(new Date(), process.pid, 'Create post successful. New post id:', savedPostMessage._id);

        const total = await PostModel.countDocuments({});
        console.log(total, Math.ceil(total / 8), `*-${Math.ceil(total / 8)}`);
        await deleteCache(redisClient, '-*');

        res.status(201).json(resData);
    } catch (error) {
        const resData = processResponseData(500, [], SERVER_UNKNOWN_ERROR, error.message);
        console.error(new Date(), process.pid, 'Error occrence when create posts with error: ', error.message);
        res.status(500).json(resData);
    }
}

export const updatePost = async (req, res) => {
    try {
        const { userId } = req;
        const { id } = req.params;
        const { currentPage } = req.body
        console.log(new Date(), process.pid, `Updating post, userId: ${userId}, postId: ${id}, currentPage: ${currentPage}`);

        if (!userId) {
            const resData = processResponseData(403, [], UNAUTH);
            console.log(new Date(), process.pid, 'Updating post faild, access denied.');
            return res.status(403).json(resData);
        }

        const existPost = await PostModel.findById(id);
        const { creator, creatorId, title, message, tags, selectedFile = existPost.selectedFile } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const resData = processResponseData(404, [], POST_NOT_EXIST, `Can't find the post with id: ${id}, please refresh the page.`);
            console.log(new Date(), process.pid, `Update post failed. Can't find the post with id: ${id}`);
            return res.status(404).send(resData);
        }

        const newPost = { creator, creatorId, title, message, tags, selectedFile, _id: id, lastestUpdateTime: new Date() };
        const updatedPost = await PostModel.findByIdAndUpdate(id, newPost, { new: true });
        const resData = processResponseData(200, updatedPost);
        console.log(new Date(), process.pid, 'Update post successful. Updated post id:', updatedPost._id);

        await deleteCache(redisClient, `*-${currentPage}`);
        res.status(200).json(resData);
    } catch (error) {
        const resData = processResponseData(500, [], error.message, SERVER_UNKNOWN_ERROR);
        console.error(new Date(), process.pid, 'Error occrence when update posts with error: ', error.message);
        res.status(500).json(resData);
    }
}

export const likePost = async (req, res) => {
    try {
        const { userId } = req;
        const { id } = req.params;
        const { currentPage } = req.body
        console.log(new Date(), process.pid, `Likeing post, userId: ${userId}, postId: ${id}, currentPage: ${currentPage}`);

        if (!userId) {
            const resData = processResponseData(403, [], UNAUTH);
            console.log(new Date(), process.pid, 'Likeing post faild, access denied.');
            return res.status(403).json(resData);
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const resData = processResponseData(404, [], POST_NOT_EXIST, `Can't find the post with id: ${id}, please refresh the page.`);
            console.log(new Date(), process.pid, `Like post failed. Can't find the post with id: ${id}`);
            return res.status(404).send(resData);
        }

        console.log(new Date(), process.pid, 'Finding post...');

        const post = await PostModel.findById(id);
        console.log(new Date(), process.pid, 'Get post successful. Finded post id:', post._id);

        if (post.likes.includes(userId)) {
            post.likes = post.likes.filter((id) => id !== userId);
        } else {
            post.likes.push(userId);
        }

        const updatedPost = await PostModel.findByIdAndUpdate(id, post, { new: true });
        const resData = processResponseData(200, updatedPost);
        console.log(new Date(), process.pid, 'Update post successful. Updated post id:', updatedPost._id);

        await deleteCache(redisClient, `*-${currentPage}`);
        res.status(200).json(resData);
    } catch (error) {
        const resData = processResponseData(500, [], SERVER_UNKNOWN_ERROR, error.message);
        console.error(new Date(), process.pid, 'Error occrence when like posts with error: ', error.message);
        res.status(500).json(resData);
    }
}

export const deletePost = async (req, res) => {
    try {
        const { userId } = req;
        const { id, currentPage } = req.params;
        console.log(new Date(), process.pid, `Deleting post, userId: ${userId}, postId: ${id}, currentPage: ${currentPage}`);

        if (!userId) {
            const resData = processResponseData(403, [], UNAUTH);
            console.log(new Date(), process.pid, 'Deleting post faild, access denied.');
            return res.status(403).json(resData);
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const resData = processResponseData(404, [], POST_NOT_EXIST, `Can't find the post with id: ${id}, please refresh the page.`);
            console.log(new Date(), process.pid, `Delete post failed. Can't find the post with id: ${id}`);
            return res.status(404).send(resData)
        }

        const deletedPost = await PostModel.findByIdAndRemove(id);

        const resData = processResponseData(200, deletedPost);
        console.log(new Date(), process.pid, 'Delete post successful. Delete post id:', deletedPost._id);

        await deleteCache(redisClient, [`-*`, id]);
        res.status(200).json(resData);
    } catch (error) {
        const resData = processResponseData(500, [], SERVER_UNKNOWN_ERROR, error.message);
        console.error(new Date(), process.pid, 'Error occrence when update posts with error: ', error.message);
        res.status(500).json(resData);
    }
}

export const commentPost = async (req, res) => {
    try {
        const { userId } = req;
        const { id, comment } = req.body;
        console.log(new Date(), process.pid, `Commenting post, userId: ${userId}, postId: ${id}, comment: ${comment}`);

        if (!userId) {
            const resData = processResponseData(403, [], UNAUTH);
            console.log(new Date(), process.pid, 'Commenting post faild, access denied.');
            return res.status(403).json(resData);
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const resData = processResponseData(404, [], POST_NOT_EXIST, `Can't find the post with id: ${id}, please refresh the page.`);
            console.log(new Date(), process.pid, `Comment post failed. Can't find the post with id: ${id}`);
            return res.status(404).send(resData)
        }

        const commentedPost = await PostModel.findByIdAndUpdate(id, { $push: { comments: [comment] } }, { new: true });
        const resData = processResponseData(200, commentedPost);
        console.log(new Date(), process.pid, 'Comment post successful. Delete post id:', commentedPost._id);

        await deleteCache(redisClient, id);

        res.status(200).json(resData);
    } catch (error) {
        const resData = processResponseData(500, [], SERVER_UNKNOWN_ERROR, error.message);
        console.error(new Date(), process.pid, 'Error occrence when Comment posts with error: ', error.message);
        res.status(500).json(resData);
    }
}
