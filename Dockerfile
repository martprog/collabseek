# Use Node.js as the base image
FROM node:14-alpine3.13

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN apk add --update --no-cache bash postgresql-client && \
     npm install

# Copy the entire application to the working directory
COPY . .

# Expose the port on which the server will run (adjust as needed)
EXPOSE 3001

# Set the environment variable for Node.js to use development mode -> this shouldnt make sense since we are declaring it in docker.compose
ENV NODE_ENV=development

COPY wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x ./wait-for-it.sh
#&& \
    #apk add --update --no-cache postgresql-client

#CMD ["npm", "run", "dev"]

