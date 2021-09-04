const deleteCache = async (redisClient, pattern) => {
  try {
    console.log(new Date(), process.pid, `Delete keys pattern ${JSON.stringify(pattern)}`);
    let keys = [];
    if (Array.isArray(pattern)) {
      keys = (await Promise.all(pattern.map(async (p) => redisClient.keys(p)))).reduce((a, b) => a.concat(b), []);
    } else {
      keys = await redisClient.keys(pattern);
    }
    console.log(new Date(), process.pid, `Finded keys ${JSON.stringify(keys)}`);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(new Date(), process.pid, `Delete keys ${JSON.stringify(keys)}`);
    } else {
      console.log(new Date(), process.pid, `No keys found`);
    }
    return keys;
  } catch (error) {
    console.error(new Date(), process.pid, `Error occrence when delete keys from redis with error: ${error.message}`);
    return error;
  }
}

export default deleteCache;