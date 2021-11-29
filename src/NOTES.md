## Resources

-   [Manipulate Docker containers](https://www.npmjs.com/package/dockerode)
-   [Make an adapter](https://youtu.be/65NhO5xxSZc)
-   [Template](https://github.com/thodges-gh/CL-EA-NodeJS-Template/blob/master/app.js)
-   [HEAVY INSPIRATION](https://github.com/engineer-man/piston/blob/master/packages/python/3.9.4/build.sh)
-   [Converting Python code to one line](http://jagt.github.io/python-single-line-convert/)

## Design

-   \*\*\*\* Perhaps a more reliable way of getting the data would be to output the entire stream to some sort of file, then read from the file and pipe the output to the stream
-   How about I make it so that users should just return their responses in a JSON format under the key of "data" to avoid any sort of problems ?

## Todo

-   Fix some of the output edge cases e.g. new lines includes the '$', unprintable characters (but allow support for unicode characters)
-   Make docs
