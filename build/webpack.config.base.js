const path = require('path');

const config = {
  target: 'web',
  // mode: 'development', //'development' 'production'
  entry: path.join(__dirname, '../client/index.js'),
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, '../dist')
  },
  resolve: {
    extensions: ['.js', '.jsx', '.vue', '.styl'], // import引入文件的时候不用加后缀
    modules: [
      // 配置路径别名
      'node_modules',
      path.resolve(__dirname, '../client/views'),
      path.resolve(__dirname, '../client/assets')
    ]
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(gif|jpg|png|jpeg|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              name: 'resources/[path][name]-[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  }
};

module.exports = config;
