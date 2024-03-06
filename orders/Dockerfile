# Use an official Node.js runtime as a parent image
FROM node:alpine

# Set the working directory in the container
WORKDIR /app

# Copy only package.json and package-lock.json to leverage Docker layer caching
COPY package*.json ./ 
RUN npm install --omit=dev

# Remove existing node_modules and perform a fresh npm install
# RUN rm -rf node_modules && npm install

# Copy the rest of the application code to the container
COPY . .

# Define the command to run your app
CMD ["npm", "start"] 