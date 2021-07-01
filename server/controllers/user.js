import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import UserModal from "../models/user.js";
import { hash } from '../utils/crypto.js';
import { processResponseData } from "../utils/processResponseData.js";

dotenv.config();

const secret = process.env.JWT_SECRET;

const deletePassword = (userInfo) => {
    return { firstName: userInfo.firstName, lastName: userInfo.lastName, name: userInfo.name, email: userInfo.email };
}

export const login = async (req, res) => { 
    try {
        const { email, password } = req.body;

        console.log(new Date(), `${email} login.`);

        const existUser = await UserModal.findOne({ email });
        if (!existUser) {
            console.log(new Date(), `${email} user dones't exist.`);
            return res.status(404).json(processResponseData(404, [], `User dones't exist.`));
        }

        console.log(new Date(), `${existUser.email} is exist`);
        
        const isPasswordMatched = hash(password) === existUser.password;
        if (!isPasswordMatched) {
            console.log(new Date(), `${existUser.email} passwrod check failed.`);
            return res.status(400).json(processResponseData(400, [], `Username or password incorrect.`));
        }

        const token = jwt.sign({ email: existUser.email, id: existUser._id }, secret, { expiresIn: "2h" });

        console.log(new Date(), `${existUser.email} login success`);

        res.status(200).json({ userInfo: deletePassword(existUser), token, isSuccess: true, message: 'Login success.' });
    } catch (error) {
        const resData = processResponseData(500, [], `Login failed, server error.`);
        console.error(new Date(), 'Login failed with error: ', error.message);
        res.status(500).json(resData);
    }
}

export const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        console.log(new Date(), `${email} register.`);

        const existUser = await UserModal.findOne({ email });
        if (existUser) {
            console.log(new Date(), `${email} user already exist.`);
            return res.status(400).json(processResponseData(400, [], `User already exist.`));
        }

        const encodePassword = hash(password);
        const name = /^[a-zA-Z]+$/.test(firstName) && /^[a-zA-Z]+$/.test(lastName) ? `${firstName} ${lastName}` : `${firstName}${lastName}`;

        console.log(new Date(), `Creating ${email} user.`);

        const createdUser = await UserModal.create({ firstName, lastName, email, name, password: encodePassword });
        const token = jwt.sign( { email: createdUser.email, id: createdUser._id }, secret, { expiresIn: "2h" } );

        console.log(new Date(), `Create ${email} user success.`);

        res.status(201).json({ userInfo: deletePassword(createdUser), token, isSuccess: true, message: 'Login success.' });
    } catch (error) {
        const resData = processResponseData(500, [], `Register failed, server error.`);
        console.error(new Date(), 'Register failed with error: ', error.message);
        res.status(500).json(resData);
    }
}
