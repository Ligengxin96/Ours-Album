const compressionStr = (str, length) => {
  if (typeof str !== 'string') {
    throw new Error('str is not a String');
  }

  if (typeof length !== 'number') {
    throw new Error('length is not a Number');
  }

  // space in regex is necessary because title is a string with spaces
  length = /^[a-zA-Z ]+$/.test(str) ? length : length / 2;

  if (str.length > length) {
    str = str.substring(0, length) + '...';
  }

  return str;
}

export default compressionStr;
