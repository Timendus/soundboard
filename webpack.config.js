const path = require('path');

module.exports = {
	mode: 'development',

	entry: {
		'soundboard': './src/js/app/index.js',
    'service-worker': './src/js/service-worker/index.js'
	},

	output: {
		path: path.join(__dirname, 'docs'),
		filename: '[name].js'
	},

	devServer: {
		contentBase: path.join(__dirname, 'docs'),
		disableHostCheck: true
	},

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      }
    ]
  }
};
