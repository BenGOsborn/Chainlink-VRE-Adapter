# Get install command
FROM node:16-alpine3.13 as build
WORKDIR /app
COPY install.js pyVersions.json ./

# **** I SHOULD ALSO MOUNT THIS DIRECTORY TO SOME SORT OF TEMP FILE WHICH START CAN READ FROM INSTEAD OF ECHOING OUT

# Run the command
CMD ["node", "install.js"]