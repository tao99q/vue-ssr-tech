const path = require('path');

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');

const baseConfig = require('./webpack.config.base');
const isDev = process.env.NODE_ENV === 'development';

const defaultPlugins = [
  new webpack.DefinePlugin({
    process: {
      NODE_ENV: isDev ? '"development"' : '"production"'
    }
  }),
  new VueLoaderPlugin(),
  new HtmlWebpackPlugin()
];

const devServer = {
  port: '8000',
  host: 'localhost',
  overlay: {
    errors: true
  },
  open: true,
  hot: true
};

let config;

if (isDev) {
  config = merge(baseConfig, {
    mode: 'development', //'development' 'production'
    module: {
      rules: [
        {
          test: /\.styl(us)?$/,
          use: [
            'vue-style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            },
            'stylus-loader'
          ]
        }
      ]
    },
    devtool: '#cheap-module-eval-source-map',
    devServer: devServer,
    plugins: defaultPlugins.concat([
      // 热更新
      new webpack.HotModuleReplacementPlugin(),
      // 设置跳过编译时报错
      new webpack.NoEmitOnErrorsPlugin()
    ])
  });
} else {
  config = merge(baseConfig, {
    mode: 'production', //'development' 'production'
    entry: {
      app: path.join(__dirname, '../src/index.js'),
      vendor: ['vue']
    },
    output: {
      filename: '[name].[chunkhash:8].js',
      path: path.join(__dirname, '../dist')
    },
    module: {
      rules: [
        {
          test: /\.styl(us)?$/,
          use: ExtractPlugin.extract({
            fallback: 'vue-style-loader',
            use: [
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  sourceMap: true
                }
              },
              'stylus-loader'
            ]
          })
        }
      ]
    },
    plugins: defaultPlugins.concat([new ExtractPlugin('styles.[hash:8].css')]),
    optimization: {
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
            reuseExistingChunk: true
          },
          vendors: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            chunks: 'all'
          }
        }
      },
      runtimeChunk: {
        name: entrypoint => `runtime~${entrypoint.name}`
      }
    }
  });
}

module.exports = config;
