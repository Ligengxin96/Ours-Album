import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import UserModal from "../models/user.js";
import { hash } from '../utils/crypto.js';
import { processResponseData } from "../utils/processResponseData.js";
import { INCORRECT_USERNAME_OR_PASSWORD, NONE, SERVER_UNKNOWN_ERROR, USER_EXIST, USER_NOT_EXIST } from '../config/errorCode.js';

dotenv.config();

const secret = process.env.JWT_SECRET;

const processUserInfo = (userInfo, token) => {
    return { id: userInfo._id, firstName: userInfo.firstName, lastName: userInfo.lastName, name: userInfo.name, email: userInfo.email, token };
}

export const login = async (req, res) => { 
    try {
        const { email, password } = req.body;
        console.log(new Date(), `${email} login.`);

        const existUser = await UserModal.findOne({ email });

        if (!existUser) {
            console.log(new Date(), `${email} user dones't exist.`);
            return res.status(404).json(processResponseData(404, [], USER_NOT_EXIST, `User dones't exist.`));
        }

        console.log(new Date(), `${existUser.email} is exist, check password.`);

        const isPasswordMatched = hash(password) === existUser.password;

        if (!isPasswordMatched) {
            console.log(new Date(), `${existUser.email} passwrod check failed.`);
            return res.status(400).json(processResponseData(400, [], INCORRECT_USERNAME_OR_PASSWORD,`Username or password incorrect.`));
        }

        const token = jwt.sign({ email: existUser.email, username: existUser.name, id: existUser._id }, secret, { expiresIn: '2h' });
        console.log(new Date(), `${existUser.email} login success`);
        res.status(200).json({ userInfo: processUserInfo(existUser, token), errorCode: NONE, isSuccess: true, message: 'Login success.' });
    } catch (error) {
        const resData = processResponseData(500, [], SERVER_UNKNOWN_ERROR, `Login failed, server error.`);
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
            return res.status(400).json(processResponseData(400, [], USER_EXIST, `User already exist.`));
        }

        const encodePassword = hash(password);
        const name = escape(firstName).indexOf('%u') < 0 && escape(lastName).indexOf('%u') < 0 ? `${firstName} ${lastName}` : `${firstName}${lastName}`;
        console.log(new Date(), `Creating ${email} user.`);

        const createdUser = await UserModal.create({ firstName, lastName, email, name, password: encodePassword });
        const token = jwt.sign( { email: createdUser.email, username: createdUser.name, id: createdUser._id }, secret, { expiresIn: '2h' } );
        console.log(new Date(), `Create ${email} user success.`);
        res.status(201).json({ userInfo: processUserInfo(createdUser, token), errorCode: NONE, isSuccess: true, message: 'Login success.' });
    } catch (error) {
        const resData = processResponseData(500, [], SERVER_UNKNOWN_ERROR, `Register failed, server error.`);
        console.error(new Date(), 'Register failed with error: ', error.message);
        res.status(500).json(resData);
    }
}
