import type { Config } from 'jest';

const config: Config = {
  displayName: 'nat-builder',
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^@pages/(.*)$': '<rootDir>/src/app/pages/$1',
    '^@components/(.*)$': '<rootDir>/src/app/components/$1',
    '^@services/(.*)$': '<rootDir>/src/app/services/$1',
    '^@styles/(.*)$': '<rootDir>/src/styles/$1',
    '^@models/(.*)$': '<rootDir>/src/app/models/$1',
    '^@utils/(.*)$': '<rootDir>/src/app/utils/$1',
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/__mocks__/fileMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$|ng-zorro-antd|@ant-design|@ctrl)',
  ],
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.d.ts',
    '!src/main.ts',
  ],
  coverageDirectory: 'coverage',
};

export default config;
