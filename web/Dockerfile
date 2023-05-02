# Pull from latest version of Node
FROM node:latest

# Set the working directory to this directory (common place to
# store application in the Linux file structure)
WORKDIR /app

# Copy over package.json and package-lock.json (these files
# contain the necessary dependencies for our project)
COPY package*.json ./
COPY dist ./app/dist

# Install dependencies for our project
RUN npm install

# Copy over all of the app source code
COPY . .

ENV HOST=0.0.0.0

# Configure the start command
CMD ["npm", "run", "dev"]
