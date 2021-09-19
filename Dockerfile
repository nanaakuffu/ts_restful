#LATEST NODE Version -which node version u will use.
FROM node:14.17.3
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
#install dependencies
COPY package.json /usr/src/app
RUN npm install
#bundle app src
COPY . /usr/src/app
#3000 is the port which we want to expose for outside container world.
EXPOSE 3000
CMD [ "npm" , "start" ]