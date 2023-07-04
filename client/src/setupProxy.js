
const { createProxyMiddleware } = require('http-proxy-middleware');

const hostPort = process.env.HOST_PORT || 3001

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: `http://localhost:${hostPort}`,
            changeOrigin: true,
        })
    );
};