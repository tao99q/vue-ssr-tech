const path = require('path');

const {VueLoaderPlugin} = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const isDev = process.env.NODE_ENV === 'development';


const config = {
  target: 'web',
  mode: 'development',//'development' 'production'
  entry: path.join(__dirname, './src/index.js'),
  output: {
    filename: 'bundle.[hash:8].js',
    path: path.join(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.vue', '.styl'], // import引入文件的时候不用加后缀
    modules: [ // 配置路径别名
      'node_modules'
      , path.resolve(__dirname, 'src/todo')
      , path.resolve(__dirname, 'src/assets')
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
        test: /\.(gif|jpg|png|jpeg|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 1024,
            name: '[hash:8].[ext]'
          }
        }]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin(),
  ],
};

if (isDev) {
  config.module.rules.push({
    test: /\.styl(us)?$/,
    use: [
      'style-loader',
      'css-loader',
      {
        loader: "postcss-loader",
        options: {
          sourceMap: true
        }
      },
      'stylus-loader'
    ]
  });
  config.devtool = '#cheap-module-eval-source-map';
  config.devServer = {
    port: '8000',
    host: 'localhost',
    overlay: {
      errors: true,
    },
    open: true,
    hot: true,
  };
  config.plugins.push(
    // 热更新
    new webpack.HotModuleReplacementPlugin(),
    // 设置跳过编译时报错
    new webpack.NoEmitOnErrorsPlugin()
  );
} else {
  config.entry = {
    app: path.join(__dirname, 'src/index.js'),
    vendor: ['vue'],
  };
  config.output.filename = '[name].[chunkhash:8].js';
  config.module.rules.push(
    {
      test: /\.styl(us)?$/,
      use: ExtractPlugin.extract({
        fallback: 'style-loader',
        use: [
          'css-loader',
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true
            }
          },
          'stylus-loader'
        ]
      })
    }
  );
  config.plugins.push(
    new ExtractPlugin("styles.[hash:8].css"),
  );
  config.optimization = {
    splitChunks: {
      chunks: 'async',
      // 大于30KB才单独分离成chunk
      minSize: 30000,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        default: {
          priority: -20,
          reuseExistingChunk: true,
        },
        vendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: "all"
        },
      }
    },
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`
    }
  }
}

module.exports = config;