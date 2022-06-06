const path = require('path');

module.exports = {
	mode: 'development',
	entry: './src/index.js',
	devtool: 'inline-source-map',
	resolve: {
		extensions: ['.ts', '.js', '.json'],
	},
	devServer: {
		static: {
			directory: path.join(__dirname, "dist"),
		},
		compress: true,
		port: 8080,
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	plugins: [
	],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.html$/,
				loader: "html-loader",
			},
			{
				test: /\.css$/i,
				use: [
					"raw-loader",
				],
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					"raw-loader",
					"sass-loader",
				],
			},
			{
				test: /\.less$/i,
				use: [
					"raw-loader",
					"less-loader",
				],
			},
		],
	},
};
