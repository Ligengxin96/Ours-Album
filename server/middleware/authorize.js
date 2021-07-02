import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { processResponseData } from "../utils/processResponseData.js";

dotenv.config();

const secret = process.env.JWT_SECRET;

const authorize = async (req, res, next) => {
  try {
    const headerAuthorization = req.headers.authorization;
    const [_, token] = headerAuthorization?.split(' ') ?? [];

    // if this token is form our server
    const isOursThoken = token?.length < 500;
    
    if (token && isOursThoken) {
      console.log(`${new Date()}: token (${token}) is ours token`);

      const decodeToken = jwt.verify(token, secret);
      console.log(`${new Date()}: resolve ours server token success, user id: ${decodeToken.id}`);

      req.userId = decodeToken.id;
      req.username = decodeToken.username;
    } else {
      // is google login token
      console.log(`${new Date()}: token (${token}) is google login token`);

      const decodeToken = jwt.decode(token);
      console.log(`${new Date()}: resolve google login token success, user id: ${decodeToken.sub}`);

      req.userId = decodeToken.sub;
      req.username = decodeToken.name;
    }
    
    next();
  } catch (error) {
    console.error(`Resolve token failed with error: ${error.message}`);
    const resData = processResponseData(403, [], 'jwt expired');
    res.status(403).json(resData);
  }
}


export default authorize;