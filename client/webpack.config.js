const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = () => {
  return {
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      // Webpack plugin that generates our html file and injects our bundles for use within a browser. 
      new HtmlWebpackPlugin({
        template: './index.html',
        title: 'Just Another Text Editor (JATE)'
      }),
     
      // Injects our custom service worker
      // "A service worker is a JavaScript asset that acts as a proxy between web browsers and web servers. They aim to improve reliability by providing offline access, as well as boost page performance" - Chrome Developers 
      new InjectManifest({
        swSrc: './src-sw.js',
        swDest: 'src-sw.js',
      }),

      // Creates a manifest.json file.
      // The manifest.json file is used for telling the browser about the web application. "A typical manifest file includes the app name, the icons the app should use, and the URL that should be opened when the app is launched, among other things." - web.dev
      new WebpackPwaManifest({
        fingerprints: false,
        inject: true,
        name: 'Just Another Text Editor (JATE)',
        short_name: 'JATE',
        description: 'A text editor made under the progressive web application paradigm',
        background_color: '#4B9CD3',
        theme_color: '#4B9CD3',
        start_url: './',
        publicPath: './',
        icons: [
          {
            src: path.resolve('src/images/logo.png'),
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join('assets', 'icons'),
          },
        ],
      }),
    ],

    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          // We use babel-loader in order to use ES6.
          // It is useful for making an app backwards compatible for older browsers. 
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/transform-runtime'],
            },
          },
        },
      ],
    },
  };
};
