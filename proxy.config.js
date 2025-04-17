const proxy = [
  {
    context: '/backend/',
    target: 'http://localhost:8080',
    pathRewrite: { '^/backend/': '/' },
    secure: false
  }
];
module.exports = proxy;
