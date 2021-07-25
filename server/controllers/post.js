import mongoose from 'mongoose';
import { NONE, POST_NOT_EXIST, SERVER_UNKNOWN_ERROR, UNAUTH } from '../config/errorCode.js';
import PostModel from "../models/post.js";
import { processResponseData } from "../utils/processResponseData.js";


export const getPosts = async (req, res) => { 
    try {
        const { title = '', message = '', tags = [], currentPage = 1, limit = 8 } = req.query;
        
        console.log(new Date(), `Finding posts, title is '${title}', message is '${message}', tags is '${tags}', currentPage is ${currentPage}`);
        
        const titleRegex = new RegExp(title.replace('(', '\\(').replace(')', '\\)'), 'i');
        const messageRegex = new RegExp(message.replace('(', '\\(').replace(')', '\\)'), 'i');
        const startIndex = (currentPage - 1) * limit; 

        const queryCondition = {};
        if (title) {
            queryCondition['$and'] = [{ title: titleRegex }];
        }
        if (message) {
            queryCondition['$and'] = queryCondition['$and'] ? [...queryCondition['$and'], { message: messageRegex }] : [{ message: messageRegex }];
        }
        if (tags?.length > 0) {
            queryCondition['$and'] = queryCondition['$and'] ? queryCondition['$and'].concat([{ tags: { $in: tags.split(',') } }]) : [{ tags: { $in: tags.split(',') } }];
        }

        console.log(new Date(), `queryCondition: ${JSON.stringify(queryCondition)}`);
        
        const total = await PostModel.countDocuments(queryCondition);
        const post = await PostModel.find(queryCondition).sort({ createdTime: 1 }).skip(startIndex).limit(limit);
        const resData = processResponseData(200, post, NONE, null, { currentPage, maxPage: Math.ceil(total / limit) });
        console.log(new Date(), 'Get posts successful. Find posts count:', post.length, 'totalCount: ', total);

        res.status(200).json(resData);
    } catch (error) {
        const resData = processResponseData(500, [], SERVER_UNKNOWN_ERROR, error.message);
        console.error(new Date(), 'Error occrence when get posts with error: ', error.message);
        res.status(500).json(resData);
    }
}

export const getPostById = async (req, res) => { 
    try {
        const { id } = req.params;
        
        console.log(new Date(), `Finding post by id, id is ${id}`);
        
        const post = await PostModel.find({ _id: id });
        const resData = processResponseData(200, post);
        console.log(new Date(), 'Get post successful. Find post count:', post.length);

        res.status(200).json(resData);
    } catch (error) {
        const resData = processResponseData(500, [], SERVER_UNKNOWN_ERROR, error.message);
        console.error(new Date(), 'Error occrence when get post by id with error: ', error.message);
        res.status(500).json(resData);
    }
}

export const createPost = async (req, res) => {
    const post = req.body;
    const newPostMessage = new PostModel({ ...post, creatorId: req.userId, creator: req.username })
    try {
        console.log(new Date(), 'Creating post...');

        if (!req.userId) {
            const resData = processResponseData(403, [], UNAUTH);
            console.log(new Date(), 'Creating post faild, access denied.');
            return res.status(403).json(resData);
        }

        const savedPostMessage = await newPostMessage.save();
        const resData = processResponseData(201, savedPostMessage);
        console.log(new Date(), 'Create post successful. New post id:', savedPostMessage._id);
        res.status(201).json(resData);
    } catch (error) {
        const resData = processResponseData(500, [], SERVER_UNKNOWN_ERROR, error.message);
        console.error(new Date(), 'Error occrence when create posts with error: ', error.message);
        res.status(500).json(resData);
    }
}

export const updatePost = async (req, res) => {
    try {
        console.log(new Date(), 'Updating post...');

        if (!req.userId) {
            const resData = processResponseData(403, [], UNAUTH);
            console.log(new Date(), 'Updating post faild, access denied.');
            return res.status(403).json(resData);
        }

        const { id } = req.params;
        console.log(new Date(), 'Get exist post selected file');

        const existPost = await PostModel.findById(id);
        const { creator, creatorId, title, message, tags, selectedFile = existPost.selectedFile } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const resData = processResponseData(404, [], POST_NOT_EXIST, `Can't find the post with id: ${id}, please refresh the page.`);
            console.log(`${new Date()}, Update post failed. Can't find the post with id: ${id}`);
            return res.status(404).send(resData);
        }

        const newPost = { creator, creatorId, title, message, tags, selectedFile, _id: id, lastestUpdateTime: new Date() };
        const updatedPost = await PostModel.findByIdAndUpdate(id, newPost, { new: true });
        const resData = processResponseData(200, updatedPost);
        console.log(new Date(), 'Update post successful. Updated post id:', updatedPost._id);
        res.status(200).json(resData);
    } catch (error) {
        const resData = processResponseData(500, [], error.message, SERVER_UNKNOWN_ERROR);
        console.error(new Date(), 'Error occrence when update posts with error: ', error.message);
        res.status(500).json(resData);
    }
}

export const likePost = async (req, res) => {
    try {
        console.log(new Date(), 'Likeing post...');
        
        const { userId } = req;
        
        if (!userId) {
            const resData = processResponseData(403, [], UNAUTH);
            console.log(new Date(), 'Likeing post faild, access denied.');
            return res.status(403).json(resData);
        }

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const resData = processResponseData(404, [], POST_NOT_EXIST, `Can't find the post with id: ${id}, please refresh the page.`);
            console.log(`${new Date()}, Like post failed. Can't find the post with id: ${id}`);
            return res.status(404).send(resData);
        }

        console.log(new Date(), 'Finding post...');

        const post = await PostModel.findById(id);
        console.log(new Date(), 'Get post successful. Finded post id:', post._id);

        if (post.likes.includes(userId)) {
            post.likes = post.likes.filter((id) => id !== userId);
        } else {
            post.likes.push(userId);
        }

        const updatedPost = await PostModel.findByIdAndUpdate(id, post, { new: true });
        const resData = processResponseData(200, updatedPost);
        console.error(new Date(), 'Update post successful. Updated post id:', updatedPost._id);
        res.status(200).json(resData);
    } catch (error) {
        const resData = processResponseData(500, [], SERVER_UNKNOWN_ERROR, error.message);
        console.error(new Date(), 'Error occrence when like posts with error: ', error.message);
        res.status(500).json(resData);
    }
}

export const deletePost = async (req, res) => {
    try {
        console.log(new Date(), 'Deleting post...');

        if (!req.userId) {
            const resData = processResponseData(403, [], UNAUTH);
            console.log(new Date(), 'Deleting post faild, access denied.');
            return res.status(403).json(resData);
        }

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const resData = processResponseData(404, [], POST_NOT_EXIST, `Can't find the post with id: ${id}, please refresh the page.`);
            console.log(`${new Date()}, Delete post failed. Can't find the post with id: ${id}`);
            return res.status(404).send(resData)
        }

        const deletedPost = await PostModel.findByIdAndRemove(id);
        const resData = processResponseData(200, deletedPost);
        console.log(new Date(), 'Delete post successful. Delete post id:', deletedPost._id);
        res.status(200).json(resData);
    } catch (error) {
        const resData = processResponseData(500, [], SERVER_UNKNOWN_ERROR, error.message);
        console.error(new Date(), 'Error occrence when update posts with error: ', error.message);
        res.status(500).json(resData);
    }
}

export const commentPost = async (req, res) => {
    try {
        console.log(new Date(), 'Commenting post...');

        if (!req.userId) {
            const resData = processResponseData(403, [], UNAUTH);
            console.log(new Date(), 'Commenting post faild, access denied.');
            return res.status(403).json(resData);
        }

        const { id, comment } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const resData = processResponseData(404, [], POST_NOT_EXIST, `Can't find the post with id: ${id}, please refresh the page.`);
            console.log(`${new Date()}, Comment post failed. Can't find the post with id: ${id}`);
            return res.status(404).send(resData)
        }

        const commentedPost = await PostModel.findByIdAndUpdate(id, { $push: { comments: [comment] } }, { new: true });
        const resData = processResponseData(200, commentedPost);
        console.log(new Date(), 'Comment post successful. Delete post id:', commentedPost._id);
        res.status(200).json(resData);
    } catch (error) {
        const resData = processResponseData(500, [], SERVER_UNKNOWN_ERROR, error.message);
        console.error(new Date(), 'Error occrence when Comment posts with error: ', error.message);
        res.status(500).json(resData);
    }
}
