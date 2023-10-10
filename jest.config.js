module.exports = {
  transform: {
    '@aurora-is-near[/\\\\].+\\.(js|jsx|ts|tsx)$':
      './babelTransformImportExport.js',
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.svg$': './svgTransform.js'
  },
  setupFilesAfterEnv: ['./src/setupTests.js'],
  transformIgnorePatterns: [
    'node_modules[/\\\\](?!@aurora-is-near[/\\\\]engine[/\\\\])',
  ],
  "moduleNameMapper": {
    "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/src/__mocks__/fileMock.js",
    "\\.(css|less)$": "<rootDir>/src/__mocks__/styleMock.js",
    "d3": "<rootDir>/src/__mocks__/styleMock.js",
  }
};
