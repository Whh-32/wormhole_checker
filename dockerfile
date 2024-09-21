# Use the official Node.js image
FROM node:20.17.0

# Create and change to the app directory
WORKDIR /var/lib/wormhole_checker

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run your bot
CMD ["npm", "start"]
