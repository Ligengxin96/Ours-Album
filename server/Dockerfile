FROM node:14-alpine

ADD ./server ./

RUN yarn 

EXPOSE 5000

CMD [ "node", "index.js" ]