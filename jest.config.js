module.exports = {
  verbose: true,
  testEnvironment: 'jsdom', // TODO: provide a separate config when 'node' is required
  reporters: ['default'],
  testMatch: ['**/*.test.js', '**/*.test.jsx'],
  moduleNameMapper: {
    'myspace/(.*)': '<rootDir>/$1',
  },
};
