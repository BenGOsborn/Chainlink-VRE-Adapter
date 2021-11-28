# Get install command
FROM node:16-alpine3.13 as build
WORKDIR /app
COPY install.js pyVersions.json ./

# Run the command
CMD ["node", "install.js"]