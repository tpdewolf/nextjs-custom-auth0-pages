const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  webpack(config) {
    return Object.assign({}, config, {
      entry: function () {
        return config.entry().then(entry => {
          return Object.assign({}, entry, { auth0login: './auth0/login.tsx' });
        });
      },
      plugins: [
        ...config.plugins,
        new HtmlWebpackPlugin({
          inject: false,
          cache: false,
          template: './auth0/login.html',
          chunks: ['auth0login'],
          filename: 'auth0-login.html',
        }),
      ],
    });

    return config;
  },
};
