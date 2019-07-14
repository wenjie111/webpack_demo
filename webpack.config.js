const path = require('path');
const glob = require('glob')
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin'); // 引入HtmlWebpackPlugin插件
const extractTextPlugin = require("extract-text-webpack-plugin")
const pruifyCSSPlugin = require("purifycss-webpack")
const entry = require('./webpack_config/entry_webpack.js')//模块化webpack
const copyWebpackPlugin = require("copy-webpack-plugin")
if(process.env.type== "build"){
    var website={//生产环境
        publicPath:"http://cdn.jspang.com/"
    }
}else{
    var website={//开发环境
        publicPath:"http://192.168.199.136:1717/"
    }
}

module.exports={
    devtool:'eval-source-map',
    //入口文件的配置项
    entry:entry.path,
    //出口文件的配置项
    output:{
        //打包的路径文职
        path:path.resolve(__dirname,'dist'),
        //打包的文件名称
        filename:'[name].js',
        publicPath:website.publicPath
    },
    //模块：例如解读CSS,图片如何转换，压缩
    module:{
        rules: [
            {
              test: /\.css$/,
              use: extractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader', options: { importLoaders: 1 } },
                    {loader:'postcss-loader'}
                ]
              })
            },{
                test:/\.(png|jpg|gif)/ ,
                use:[{
                    loader:'url-loader',
                    options:{
                        limit:5000,
                        outputPath:'images/'
                    }
                }]
             },{
                test: /\.(htm|html)$/i,
                use:[ 'html-withimg-loader'] 
             },{
                test: /\.less$/,
                use: extractTextPlugin.extract({
                    use: [{
                        loader: "css-loader" 
                     }, {
                         loader: "less-loader" 
                     }],
                    fallback: "style-loader",
                  })
            },{
                test: /\.scss$/,
                use: extractTextPlugin.extract({
                    use: [{
                        loader: "css-loader" 
                     }, {
                         loader: "sass-loader" 
                     }],
                    fallback: "style-loader",
                  })
            },{
                test:/\.(jsx|js)$/,
                use:{
                    loader:'babel-loader',
                },
                exclude:/node_modules/
            }
          ]
    },
    // optimization: {
    //     splitChunks: {
    //         cacheGroups: {
    //             commons: {
    //                 name: "jquery",
    //                 chunks: "initial",
    //                 minChunks: 2
    //             }
    //         }
    //     }
    // },
    //插件，用于生产模版和各项功能
    plugins:[
        // new webpack.optimize.CommonsChunkPlugin({
        //     //name对应入口文件中的名字，我们起的是jQuery
        //     name:'jquery',
        //     //把文件打包到哪里，是一个路径
        //     filename:"assets/js/jquery.min.js",
        //     //最小打包的文件模块数，这里直接写2就好
        //     minChunks:2
        // }),

        new webpack.ProvidePlugin({
            $:"jquery",
        }),
        new HtmlPlugin({
            minify:{
                removeAttributeQuotes:true
            },
            hash:true,
            template:'./src/index.html'
        }),
        new extractTextPlugin("css/index.css"),
        new pruifyCSSPlugin({
            paths: glob.sync(path.join(__dirname, 'src/*.html')) // 同步扫描所有html文件中所引用的css
        }),
        new webpack.BannerPlugin('wenjie版权所有,禁止转载'),//版权~
        new copyWebpackPlugin ([{
            from:__dirname+'/src/public',
            to:'./public'
        }])
    ],
    //配置webpack开发服务功能
    devServer:{
        //设置基本目录结构
        contentBase:path.resolve(__dirname,'dist'),
        //服务器的IP地址，可以使用IP也可以使用localhost
        host:'192.168.199.136',
        //服务端压缩是否开启
        compress:true,
        //配置服务端口号
        port:1717
    },
    watchOptions:{
        //检测修改的时间，以毫秒为单位
        poll:1000, 
        //防止重复保存而发生重复编译错误。这里设置的500是半秒内重复保存，不进行打包操作
        aggregateTimeout:500, 
        //不监听的目录
        ignored:/node_modules/, 
    }
}