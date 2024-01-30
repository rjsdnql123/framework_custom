
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const unplugin = require('unplugin-jsx-string/webpack')

module.exports = {
  entry: './index.js', // 엔트리 포인트 설정
  mode: 'development', // 개발 모드 설정
  output: {
    filename: 'bundle.js', // 번들 파일 이름 설정
    path: path.resolve(__dirname, 'dist') // 번들 파일 경로 설정
  },
  plugins: [
    
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
  ],
  devServer: {
    historyApiFallback: true,
    port: 3000,
    hot: true
  }
};
