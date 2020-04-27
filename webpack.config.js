const path = require("path");
// const webpack = require('webpack');
const CopyWebpackPlugin = require("copy-webpack-plugin"); // 静态资源输出
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 独立打包html
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 独立打包css

module.exports = {
  // 打包环境
  //  mode: 'development', // 开发模式默认开启调试
  mode: "production",

  // 入口文件
  entry: {
    index: "./src/index.js",
  },

  // 出口文件
  output: {
    path: path.resolve(__dirname, "./dist"), // 输出文件的路径, 绝对路径，另一种写法：__dirname + './dist'
    filename: "index.js", // 出口文件名，（将入口文件打包为一个出口文件）
    // filename: '[name].js', // 出口文件名，（多个入口文件会打包多个出口文件，需要为入口文件起名即使entry为一个对象，）
    publicPath: "./", // 输出解析文件的目录，url 相对于 HTML 页面
  },

  // 本地服务器，需要安装webpack-dev-server
  devServer: {
    contentBase: path.resolve(__dirname, "./dist"), // 访问目录
    host: "", // ip地址，默认loaclhost
    port: 8080, // 端口号，默认8080
    inline: true, // 自动刷新
    // hot: true ,                 // 模块热替换机制,使用了热模块替换机制，HotModuleReplacementPlugin插件会自动添加到项目中
    // open: true,                 // 自动打开浏览器
    // overlay: true,              // 页面报错提示
  },

  // 模块
  module: {
    // 注意配置插件时注意类型转换中插件的顺序
    rules: [
      // css loaders 方案一
      // {
      //     test: /\.css$/,
      //     use: [ 'style-loader', 'css-loader', 'postcss-loader'],
      //     // loader: [ 'style-loader', 'css-loader', postcss-loader'],
      //     // use: [
      //     //     {loader: 'style-loader'},
      //     //     {loader: 'css-loader'},
      //     //     {loader: 'postcss-loader'}
      //     // ] ,
      // },
      // css loaders 方案二，独立css文件
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: "./", },
          },
          {loader: "css-loader"},
          {loader: "postcss-loader" },
        ],
      },

      // image loaders
      {
        test: /\.(jpg|gif|png|svg)/,
        use: [
          {
            loader: "url-loader",
            options: {
              name: "images/[name]-[hash:8].[ext]",
              limit: 5000, // 小于5kb的文件转为base64
              publicPath: "./",
            },
          },
        ],
      },

      // js loaders
      {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ['babel-loader',]
      }
    ],
  },

  // 插件
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html", // 默认index.html
      hash: true, // 消除缓存
      chunks: ["index"], // 只引入指定的js文件
      // 压缩html
      minify: {
        removeComments: true, // 移除注释
        collapseWhitespace: true, // 移除空格
        removeAttributeQuotes: true, // 移除属性引号
      },
    }),

    // 打包前自动删除上一次打包的文件夹
    //  new CleanWebpackPlugin('./dist'),

    // 开启热替换，配合devServer.hot = true
    // new webpack.HotModuleReplacementPlugin(),

    // 需要打包但不需要转换的文件
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "./src/assets"),
        to: "./assets",
      },
    ]),

    // 独立css，
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: '[id].css',
    }),
  ],
};
