const deleteCache = async (redisClient, pattern) => {
  try {
    console.log(new Date(), `Delete keys pattern ${JSON.stringify(pattern)}`);
    let keys = [];
    if (Array.isArray(pattern)) {
      keys = (await Promise.all(pattern.map(async (p) => redisClient.keys(p)))).reduce((a, b) => a.concat(b), []);
    } else {
      keys = await redisClient.keys(pattern);
    }
    console.log(new Date(), `Finded keys ${JSON.stringify(keys)}`);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(new Date(), `Delete keys ${JSON.stringify(keys)}`);
    } else {
      console.log(new Date(), `No keys found`);
    }
    return keys;
  } catch (error) {
    console.error(new Date(), `Error occrence when delete keys from redis with error: ${error.message}`);
    return error;
  }
}

export default deleteCache;