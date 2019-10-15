const path = require('path');

module.exports = {
  entry: {
    main: './src/app.js',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  debug: true,
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: [/\.jsx?$/],
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: [
            'es2015',
            'react',
          ],
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
        loader: 'file-loader',
      },
    ],
  },
};
