FROM node:14
LABEL Maintainer="Maïssa Garrab"
USER root
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["node", "server.js"]
