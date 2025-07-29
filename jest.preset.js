const nxPreset = require("@nx/jest/preset").default;

module.exports = {
  ...nxPreset,
  coverageReporters: ["json", "lcov", "text", "clover"],
  snapshotFormat: {
    escapeString: true,
    printBasicPrototype: true,
  },
};
