const SUCCESS_HTTP_CODE = [ 200, 201 ];

const errorMessages = {
  200: 'Successful',
  201: 'Successful',
  400: 'Failed',
  403: 'Access denied, please login',
  404: 'Failed',
  409: 'Failed',
  500: 'Failed',
}

export const processResponseData = (httpCode, data = [], additionalMessage = '', pagination) => {
  let message = errorMessages[httpCode] || '';
  if (SUCCESS_HTTP_CODE.includes(httpCode)) {
      message = additionalMessage ? `${message}. ${additionalMessage}` : message
  } else {
      message = additionalMessage ? `${message}. ${additionalMessage}` : message
  }

  if (Array.isArray(data)) {
    return {
      isSuccess: SUCCESS_HTTP_CODE.includes(httpCode),
      data,
      message,
      pagination
    };
  }

  return {
    isSuccess: SUCCESS_HTTP_CODE.includes(httpCode),
    data: [data],
    message,
    pagination
  };
}