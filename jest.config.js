module.exports = {
  verbose: true,
  testEnvironment: 'node',
  reporters: ['default'],
  testMatch: ['**/*.test.js'],
  moduleNameMapper: {
    'myspace/(.*)': '<rootDir>/$1',
  },
};
