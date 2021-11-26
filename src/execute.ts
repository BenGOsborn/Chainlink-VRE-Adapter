import crypto from "crypto";

const xd = crypto.randomBytes(3);

const expression = `const crypto = require('crypto'); return crypto.randomBytes(3)`;
const res = new Function(expression)();

console.log(res);
