# Use the official Node.js image
FROM node:20.17.0

# Set the working directory
WORKDIR /var/lib/wormhole_checker

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]
