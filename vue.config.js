const webpack = require('webpack');
const isProd = process.env.NODE_ENV === "production";

module.exports = {
  devServer: {
    open: process.platform === 'darwin',
    port: 80,
	//host: "pixivel.com",
    https: false,
    hotOnly: false,
    //proxy: {
     // '/api': {
     //  target: 'http://wq.boxpaper.club',
     //   pathRewrite: {'^/api' : ''}
     //}
    //},
    before: app => {}
  },
  configureWebpack: {
    // Set up all the aliases we use in our app.
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 6
      })
    ]
  },
  pwa: {
    name: 'Pixivel',
    themeColor: '#11cdef',
    msTileColor: '#0fa9e1',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: '#0d80d8'
  },
  css: {
    // Enable CSS source maps.
    sourceMap: process.env.NODE_ENV !== 'production'
  }
};
