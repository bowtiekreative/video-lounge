const babelDev = require('../babel.dev.js');
const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer(babelDev);
