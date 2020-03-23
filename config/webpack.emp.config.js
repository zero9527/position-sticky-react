const path = require('path');
const postcssNormalize = require('postcss-normalize');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const shouldUseSourceMap = true;

const isEnvDevelopment = process.env.NODE_ENV === 'development';
const isEnvProduction = process.env.NODE_ENV === 'production';

const resolvePath = _path => path.resolve(__dirname, _path);
const paths = {
  entry: resolvePath('../example/index.tsx'),
  publicPath: '.',
  srcPath: resolvePath('../example'),
  outputPath: resolvePath('../docs'),
  appHtml: resolvePath('../example/index.html')
};

const config = {
  mode: isEnvProduction ? 'production' : 'development',
  entry: paths.entry,
  output: {
    filename: '[name].[hash:8].js',
    chunkFilename: '[name].[hash:8].js',
    path: paths.outputPath,
    publicPath: isEnvDevelopment ? '/' : './'
  },
  resolve: {
    extensions: ['.css', '.tsx', '.ts', '.js', '.jsx']
  },
  devtool: shouldUseSourceMap ? 'source-map' : false,
  devServer: {
    port: '2333',
    quiet: true,
    hot: true
  },
  externals: isEnvProduction
    ? {
        react: 'React',
        'react-dom': 'ReactDOM'
      }
    : {},
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        loader: 'babel-loader',
        include: paths.srcPath
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                require('postcss-preset-env')({
                  autoprefixer: {
                    flexbox: 'no-2009'
                  },
                  stage: 3
                }),
                postcssNormalize()
              ]
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: paths.appHtml,
      templateParameters: {
        isEnvProduction
      }
    }),
    new ForkTsCheckerWebpackPlugin()
  ]
};

module.exports = config;
