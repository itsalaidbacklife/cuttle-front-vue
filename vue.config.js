module.exports = {
	transpileDependencies: ['vuetify'],
	configureWebpack: {
		devtool: 'source-map',
	},
	outputDir: process.env.VUE_APP_BUILD_OUTPUT || 'dist',
};
