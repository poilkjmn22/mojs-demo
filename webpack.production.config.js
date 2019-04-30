const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const fs = require('fs');
const _ = require('lodash');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyjsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

// const {
//     WebPlugin
// } = require('web-webpack-plugin');

const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length
});
// var es3ifyPlugin = require('es3ify-webpack-plugin');

//获取本机的IP地址
function getLocalIPv4(networkName) {
    var network = os.networkInterfaces();
	if(os.type()==="Darwin"){  //mac系统
		networkName = 'en0';
	}else{
		networkName = '本地连接';
	}
	return _.chain(network[networkName])
		.find(n => /((?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d))/.test(n.address))
		.get('address')
		.value()
}

const PUBLIC_PATH = '/dist/';

module.exports = {
    entry: {
      index: './js/index.js'
    },
    mode: 'production',
    module: {
        rules: [{
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.js$/,
                // loader: 'babel-loader',
                use: 'happypack/loader?id=happyBabel'
            },
            {
                test: /\.(ttf|woff|woff2|eot|svg|jpg|png)$/,
                loader: 'file-loader'
            }
        ]
    },
    optimization: {
        minimizer: [new UglifyjsPlugin({
            uglifyOptions: {
                compress: {
                    // 在UglifyJs删除没有用到的代码时不输出警告
                    warnings: false,
                    // 删除所有的 `console` 语句，可以兼容ie浏览器
                    drop_console: true,
                    // 内嵌定义了但是只用到一次的变量
                    collapse_vars: true,
                    // 提取出出现多次但是没有定义成变量去引用的静态值
                    reduce_vars: true
                }
            },
            extractComments: true
        })]
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HappyPack({
            //用id来标识 happypack处理那里类文件
            id: 'happyBabel',
            //如何处理  用法和loader 的配置一样
            loaders: [{
                loader: 'babel-loader',
            }],
            //共享进程池
            threadPool: happyThreadPool,
            //允许 HappyPack 输出日志
            verbose: true,
        }),
        // new MiniCssExtractPlugin({
        //     // Options similar to the same options in webpackOptions.output
        //     // both options are optional
        //     filename: "[name].bundle.css",
        //     chunkFilename: "[id].css",
        //     publicPath: PUBLIC_PATH
        // }),
        // new WebPlugin({
        //   filename: 'index.html',
        //   template: './template.html',
        //   requires: ['index']
        // }),
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(true)
        }),
        new CompressionPlugin(),
        new BundleAnalyzerPlugin({
            analyzerHost: 'localhost',
            analyzerPort: 5000,
            // defaultSizes: ['stat', 'parsed', 'gzip'],
            openAnalyzer: false
        })
    ],
    resolve: {
        mainFields: ['jsnext:main', 'module', 'main'],
        alias: {
            Components: './components'
        },
        extensions: ['.js', '.json', '.css', '.scss'],
        modules: ['node_modules']
    },
    output: {
        // filename: '[name].bundle.js',
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: PUBLIC_PATH,
        // libraryTarget: 'umd'
    },
    externals: {
    }
};
