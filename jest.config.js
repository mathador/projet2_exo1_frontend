
module.exports = {
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/src/'],
  testMatch: ['**/+(*.)+(spec).+(ts|js)'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  collectCoverage: true,
  coverageReporters: ['html'],
  testPathIgnorePatterns: [
    '<rootDir>/src/app/core/service/user-mock.service.ts',
    '<rootDir>/src/environments/',
    '<rootDir>/src/shared/',
    '<rootDir>/src/app/core/models/'
  ]
};
