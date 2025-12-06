const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const PUBLIC_ENV = {
  API_BASE_URL: process.env.API_BASE_URL || '/api',
  APP_NAME: process.env.APP_NAME || 'ProjXpert',
  NODE_ENV: process.env.NODE_ENV || 'development',
  REACT_APP_SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN || '',
};

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.jsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    publicPath: '/',
  },
  resolve: { extensions: ['.js', '.jsx'] },
  module: {
    rules: [
      { test: /\.jsx?$/, exclude: /node_modules/, use: 'babel-loader' },
      { test: /\.css$/i, use: ['style-loader', 'css-loader', 'postcss-loader'] },
    ],
  },
  devServer: {
    historyApiFallback: true,
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: 'all',
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        // ✅ put cookieDomainRewrite here (inside the proxy rule), not at the top level
        cookieDomainRewrite: 'localhost',
        // Increase timeouts for slow backend startups or long-running requests during development
        // proxyTimeout controls how long the proxy will wait for the target to respond
        proxyTimeout: 120000,
        // timeout controls socket inactivity timeout
        timeout: 120000,
        // enable websocket proxying (useful if your backend exposes ws endpoints)
        ws: true,
        // make the proxy verbose in the terminal to diagnose failures
        logLevel: 'debug',
        // If you also need cookies sent from browser -> server:
        // onProxyReq(proxyReq, req, res) {
        //   // nothing needed; this is just a hook if you want to inspect
        // }
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'public', 'index.html') }),
    new webpack.DefinePlugin({ 'process.env': JSON.stringify(PUBLIC_ENV) }),
  ],
};
