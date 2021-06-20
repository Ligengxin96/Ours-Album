const SUCCESS_HTTP_CODE = [ 200, 201 ];

export const processResponseData = (httpCode, data = [], additionalMessage = '') => {
  let message = '';
  if (SUCCESS_HTTP_CODE.includes(httpCode)) {
      message = additionalMessage ? `Successful. ${additionalMessage}` : 'Successful'
  } else {
      message = additionalMessage ? `faild. ${additionalMessage}` : 'faild'
  }

  if (Array.isArray(data)) {
    return {
      isSuccess: SUCCESS_HTTP_CODE.includes(httpCode),
      data,
      message,
    };
  }

  return {
    isSuccess: SUCCESS_HTTP_CODE.includes(httpCode),
    data: [data],
    message,
  };
}