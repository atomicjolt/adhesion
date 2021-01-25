const { environment } = require('@rails/webpacker')
// const CopyPlugin = require('copy-webpack-plugin')

const graphqlLoader = {
  test: /\.(graphql|gql)$/,
  exclude: /node_modules/,
  loader: 'graphql-tag/loader'
};

// environment.plugins.prepend(
//   'CopyPlugin',
//   new CopyPlugin({
//     patterns: [
//       {
//         from: "../../node_modules/pdfjs-dist/build/pdf.worker.js",
//         to: "pdf.worker.js",
//       },
//     ],
//   }),
// )

// Insert json loader at the end of list
environment.loaders.append('graphql', graphqlLoader);

module.exports = environment
