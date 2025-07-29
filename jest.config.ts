/* eslint-disable */
export default {
  displayName: 'nat-builder',
  preset: './jest.preset.js',
  passWithNoTests: true,
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: './coverage',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$|ng-zorro-antd|@ant-design)',
  ],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/src/**/?(*.)+(spec|test).[jt]s?(x)',
    '<rootDir>/src/**/*.spec.ts',
    '<rootDir>/src/**/*.test.ts',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/app/components/$1',
    '^@services/(.*)$': '<rootDir>/src/app/services/$1',
    '^@models/(.*)$': '<rootDir>/src/app/models/$1',
    '^@pages/(.*)$': '<rootDir>/src/app/pages/$1',
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '^@utils/(.*)$': '<rootDir>/src/app/utils/$1',
    '^ng-zorro-antd/(.*)$': '<rootDir>/node_modules/ng-zorro-antd/$1',
  },
};
