if (process.env.NODE_ENV === 'production') {
  module.exports = {
    mongoURI: 'mongodb://busbee:busbee1234@ds121105.mlab.com:21105/busbee-prod'
  };
} else {
  module.exports = { mongoURI: 'mongodb://localhost/busbee-dev' };
}
