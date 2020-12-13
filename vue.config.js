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
		//  target: 'http://',
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
		manifestOptions: {
			start_url: '.',
			background_color: '#11cdef',
		},
		workboxPluginMode: 'InjectManifest',
		workboxOptions: {
			swSrc: 'src/service-worker.js',
			importWorkboxFrom: 'local',
			importsDirectory: 'js',
		}
	},
	css: {
		// Enable CSS source maps.
		sourceMap: process.env.NODE_ENV !== 'production'
	},
	chainWebpack: config => {
		config.module
			.rule('images')
			.use('image-webpack-loader')
			.loader('image-webpack-loader')
			.options({
				mozjpeg: {
					progressive: true,
					quality: 70
				},
				optipng: {
					enabled: false
				},
				pngquant: {
					quality: [0.65, 0.9],
					speed: 4
				},
				gifsicle: {
					interlaced: false
				},
			});
		config.optimization.delete("splitChunks");
		if (process.env.NODE_ENV === 'production') {
			// 清除css，js版本号
			config.output.filename('js/[name].js').end();
			config.output.chunkFilename('js/[name].js').end();
			// 为生产环境修改配置...
			config.plugin('extract-css').tap(args => [{
				filename: `css/[name].css`,
				chunkFilename: `css/[name].css`
			}])
		}
	},
	configureWebpack: (config) => {
		config.resolve.alias = {
			...config.resolve.alias,
		};
		config.optimization = {
			splitChunks: {
				cacheGroups: {
					common: {
						name: 'chunk-common',
						chunks: 'initial',
						minChunks: 2,
						maxInitialRequests: 5,
						minSize: 0,
						priority: 1,
						reuseExistingChunk: true,
						enforce: true,
					},
					vendors: {
						name: 'chunk-vendors',
						test: /[\\/]node_modules[\\/]/,
						chunks: 'initial',
						priority: 2,
						reuseExistingChunk: true,
						enforce: true,
					}
				},
			},
		};
	},
};
