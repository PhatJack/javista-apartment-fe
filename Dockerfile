
# Use an official Node.js runtime as the base image
FROM node:22-alpine3.19 as DEVELOPMENT_IMAGE

# Create app directory
WORKDIR /app


# copy package.json and package-lock.json
COPY package*.json .

# install all packages
RUN npm install

# Bundle app source
COPY . .

# Make port 5173 available to the world outside this container
EXPOSE 5173

# # Run the app when the container launches
# RUN npm run build

CMD ["npm", "run", "dev"]