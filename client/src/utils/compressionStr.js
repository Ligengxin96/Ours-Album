const compressionStr = (str, length) => {
  if (typeof str !== 'string') {
    throw new Error('str is not a String');
  }

  if (typeof length !== 'number') {
    throw new Error('length is not a Number');
  }

  length = escape(str).indexOf('%u') < 0 ? length : length / 2;

  if (str.length > length) {
    str = str.substring(0, length) + '...';
  }

  return str;
}

export default compressionStr;
