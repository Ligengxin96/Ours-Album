import mongoose from 'mongoose';
import PostModel from "../models/post.js";
import { processResponseData } from "../utils/processResponseData.js";


export const getPosts = async (_, res) => { 
    try {
        console.log(new Date(), 'Finding posts...');

        const post = await PostModel.find();
        const resData = processResponseData(200, post);
        console.log(new Date(), 'Get posts successful. Find posts count:', post.length);

        res.status(200).json(resData);
    } catch (error) {
        const resData = processResponseData(404, [], error.message);
        console.error(new Date(), 'Error occrence when get posts with error: ', error.message);

        res.status(404).json(resData);
    }
}

export const createPost = async (req, res) => {
    const post = req.body;
    const newPostMessage = new PostModel({ ...post, creatorId: req.userId, creator: req.username })
    try {
        console.log(new Date(), 'Creating post...');

        if (!req.userId) {
            const resData = processResponseData(403, []);
            console.log(new Date(), 'Creating post faild, access denied.');
            return res.status(403).json(resData);
        }

        const savedPostMessage = await newPostMessage.save();
        const resData = processResponseData(201, savedPostMessage);
        console.log(new Date(), 'Create post successful. New post id:', savedPostMessage._id);
        res.status(201).json(resData);
    } catch (error) {
        const resData = processResponseData(409, [], error.message);
        console.error(new Date(), 'Error occrence when create posts with error: ', error.message);
        res.status(409).json(resData);
    }
}

export const updatePost = async (req, res) => {
    try {
        console.log(new Date(), 'Updating post...');

        if (!req.userId) {
            const resData = processResponseData(403, []);
            console.log(new Date(), 'Updating post faild, access denied.');
            return res.status(403).json(resData);
        }

        const { id } = req.params;
        console.log(new Date(), 'Get exist post selected file');

        const existPost = await PostModel.findById(id);
        const { creator, creatorId, title, message, tags, selectedFile = existPost.selectedFile } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const resData = processResponseData(404, [], `Can't find the post with id: ${id}, please refresh the page.`);
            console.log(`${new Date()}, Update post failed. Can't find the post with id: ${id}`);
            return res.status(404).send(resData);
        }

        const newPost = { creator, creatorId, title, message, tags, selectedFile, _id: id, lastestUpdateTime: new Date() };
        const updatedPost = await PostModel.findByIdAndUpdate(id, newPost, { new: true });
        const resData = processResponseData(200, updatedPost);
        console.log(new Date(), 'Update post successful. Updated post id:', updatedPost._id);
        res.status(200).json(resData);
    } catch (error) {
        const resData = processResponseData(409, [], error.message);
        console.error(new Date(), 'Error occrence when update posts with error: ', error.message);
        res.status(404).json(resData);
    }
}

export const likePost = async (req, res) => {
    try {
        console.log(new Date(), 'Likeing post...');
        
        const { userId } = req;
        
        if (!userId) {
            const resData = processResponseData(403, []);
            console.log(new Date(), 'Likeing post faild, access denied.');
            return res.status(403).json(resData);
        }

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const resData = processResponseData(404, [], `Can't find the post with id: ${id}, please refresh the page.`);
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
        const resData = processResponseData(409, [], error.message);
        console.error(new Date(), 'Error occrence when like posts with error: ', error.message);
        res.status(404).json(resData);
    }
}

export const deletePost = async (req, res) => {
    try {
        console.log(new Date(), 'Deleting post...');

        if (!req.userId) {
            const resData = processResponseData(403, []);
            console.log(new Date(), 'Deleting post faild, access denied.');
            return res.status(403).json(resData);
        }

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            const resData = processResponseData(404, [], `Can't find the post with id: ${id}, please refresh the page.`);
            console.log(`${new Date()}, Delete post failed. Can't find the post with id: ${id}`);
            return res.status(404).send(resData)
        }

        const deletedPost = await PostModel.findByIdAndRemove(id);
        const resData = processResponseData(200, deletedPost);
        console.log(new Date(), 'Delete post successful. Delete post id:', deletedPost._id);
        res.status(200).json(resData);
    } catch (error) {
        const resData = processResponseData(409, [], error.message);
        console.error(new Date(), 'Error occrence when update posts with error: ', error.message);
        res.status(404).json(resData);
    }
}
