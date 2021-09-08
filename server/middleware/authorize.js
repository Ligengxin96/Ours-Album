import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import util from "util";
import redis from 'redis';

import { UNAUTH } from '../config/errorCode.js';
import { processResponseData } from "../utils/processResponseData.js";

dotenv.config();

const secret = process.env.JWT_SECRET;

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: 6379,
    retry_strategy: () => 1000,
    connect_timeout: 10000
});

redisClient.on('error', (error) => {
  console.log(new Date(), process.pid, `Redis error: ${error.message}`);
})

redisClient.get = util.promisify(redisClient.get);
redisClient.expire = util.promisify(redisClient.expire);

const authorize = async (req, res, next) => {
  try {
    const headerAuthorization = req.headers.authorization;
    const [_, token] = headerAuthorization?.split(' ') ?? [];

    // if this token is form our server
    const isOursThoken = token?.length < 500;
    
    if (token && isOursThoken) {
      console.log(new Date(), process.pid, `Token (${token}) is ours token`);

      const decodeToken = jwt.verify(token, secret);
      console.log(new Date(), process.pid, `Resolve ours server token success, user id: ${decodeToken.id}`);

      req.userId = decodeToken.id;
      req.username = decodeToken.username;

      console.log(new Date(), process.pid, `Check token uid-${decodeToken.id} whether expired.`)

      const cacheValue = await redisClient.get(`uid-${decodeToken.id}`);
      if (cacheValue) {
        console.log(new Date(), process.pid, `Get Response from Redis, key: uid-${decodeToken.id}`);
        await redisClient.expire(`uid-${decodeToken.id}`, 3600);
      } else {
        throw new Error(`Can't get token from redis jwt expired.`);
      }
    } else {
      // is google login token
      console.log(new Date(), process.pid, `token (${token}) is google login token`);

      const decodeToken = jwt.decode(token);
      console.log(new Date(), process.pid, `resolve google login token success, user id: ${decodeToken.sub}`);

      req.userId = decodeToken.sub;
      req.username = decodeToken.name;
    }
    
    next();
  } catch (error) {
    console.error(new Date(), process.pid, `Resolve token failed with error: ${error.message}`);
    const resData = processResponseData(403, [], UNAUTH);
    res.status(403).json(resData);
  }
}


export default authorize;