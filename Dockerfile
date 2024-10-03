FROM node:21.6
RUN mkdir -p /var/app
WORKDIR /var/app
COPY . .
ENV NODE_OPTIONS=--max_old_space_size=2048
RUN npm isntall
RUN npm run build
CMD [ "node", "dist/main.js" ]