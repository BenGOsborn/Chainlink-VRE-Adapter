# Setup the environment
FROM node:16-alpine3.13 as build
WORKDIR /app
COPY package* ./
RUN npm install
COPY tsconfig.json *.ts ./
RUN npm run build

# Build the files
FROM node:16-alpine3.13
WORKDIR /app
COPY package* ./
RUN npm install --production
COPY --from=build /app/dist ./dist

# Start the server
CMD ["npm", "run", "start"]