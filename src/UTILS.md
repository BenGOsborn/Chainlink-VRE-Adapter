## Resources

-   [Manipulate Docker containers](https://www.npmjs.com/package/dockerode)
-   [Make an adapter](https://youtu.be/65NhO5xxSZc)
-   [Template](https://github.com/thodges-gh/CL-EA-NodeJS-Template/blob/master/app.js)
-   [Could be of assistance ?](https://github.com/smartcontractkit/external-adapters-js)
-   [Execute Python code](https://www.digitalocean.com/community/tutorials/how-to-use-subprocess-to-run-external-programs-in-python-3)
-   [LXC crash course](https://youtu.be/cqOtksmsxfg)
-   [HEAVY INSPIRATION](https://github.com/engineer-man/piston/blob/master/packages/python/3.9.4/build.sh)
-   [Converting Python code to one line](http://jagt.github.io/python-single-line-convert/)

-   [If I want TRULY async run code function that supports await and not just a callback](https://stackoverflow.com/questions/44829414/getting-stdout-and-stderr-streams-from-a-docker-container-in-node-js)
-   [Above ^](https://coderedirect.com/questions/539929/wait-for-callback-of-async-function-in-last-stream-ondata-event)

## Design

-   For every request we will spin up a new Docker image with the base requirements installed WITH the given version (or default version)
-   We will then install the packages for the user
-   Finally we will take the requested code and execute it in the given environment
-   We will have a time limit on the Docker container that will auto expire after a given timeframe

## Todo

-   Clean up this code and remove the unnecessary stuff
-   Add better error logging in the future
