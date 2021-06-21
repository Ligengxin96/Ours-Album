import PostMessage from "../models/postMessage.js";
import { processResponseData } from "../utils/processResponseData.js";

export const getPosts = async (_, res) => { 
    try {
        const post = await PostMessage.find();
        const resData = processResponseData(200, post);
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
        const savedPostMessage = await newPostMessage.save();
        const resData = processResponseData(201, savedPostMessage);
        res.status(201).json(resData);
    } catch (error) {
        const resData = processResponseData(409, [], error.message);
        res.status(409).json(resData);
    }
}
