import CryptoJS from 'crypto-js';

export const encodeBase64 = (str) => {
  let encryptStr = '';
  if (!str) {
    return encryptStr;
  }
  try {
    const words = CryptoJS.enc.Utf8.parse(str);
    encryptStr = CryptoJS.enc.Base64.stringify(words);
    // use ascii replace '/' after encrypt
    if (encryptStr.indexOf('/')) {
      encryptStr = encryptStr.replace(/\/+/g, '%2F');
    }
  } catch (error) {
    console.error(`Base65 encode string failed with error: ${error.message}`);
  }
  return encryptStr;
}

export const decodeBase64 = (str) => {
  let decryptStr = '';
  if (!str) {
    return decryptStr;
  }
  try {
    let tempStr = str;
    if (tempStr.indexOf('%2F')) {
      tempStr = tempStr.replace(/(%2F)+/g, '/');
    }
    const words = CryptoJS.enc.Base64.parse(tempStr);
    decryptStr = words.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error(`Decode string failed with error: ${error.message}`);
  }
  return decryptStr;
}

export const hash = (str) => {
  let encryptStr = '';
  if (!str) {
    return encryptStr;
  }
  try {
    const words = CryptoJS.enc.Utf8.parse(str);
    encryptStr = CryptoJS.SHA256(words).toString(CryptoJS.enc.Hex);
  } catch (error) {
    console.error(`Hash encode string failed with error: ${error.message}`);
  }
  return encryptStr;
}