import PostMessage from "../models/postMessage.js";
import { processResponseData } from "../utils/processResponseData.js";

export const getPosts = async (_, res) => { 
    try {
        console.log(new Date(), 'Finding posts...');
        const post = await PostMessage.find();
        const resData = processResponseData(200, post);
        console.log(new Date(), 'Get posts successful. Find posts count:', post.length);
        res.status(200).json(resData);
    } catch (error) {
        const resData = processResponseData(404, [], error.message);
        res.status(404).json(resData);
    }
}

export const createPost = async (req, res) => {
    const { creator, title, message, tags, selectedFile } = req.body;
    const newPostMessage = new PostMessage({ creator, title, message, tags, selectedFile })
    try {
        console.log(new Date(), 'Creating post...');
        const savedPostMessage = await newPostMessage.save();
        const resData = processResponseData(201, savedPostMessage);
        console.log(new Date(), 'Create post successful. new post id:', JSON.stringify(savedPostMessage._id));
        res.status(201).json(resData);
    } catch (error) {
        const resData = processResponseData(409, [], error.message);
        res.status(409).json(resData);
    }
}
