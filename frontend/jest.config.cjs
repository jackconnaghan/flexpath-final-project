// .cjs because Vite projects set "type": "module" in package.json,

const { testEnvironment } = require("../../react-tests/jest.config.cjs");

// and Jest reads its config with require().
module.exports = {
  // Fake browser (window, document, sessionStorage). Needs jest-environment-jsdom.
  testEnvironment: "jsdom",
  // testEnvironment: "node",

  // Runs before every test file: stubs and cleanup shared by all tests.
  setupFilesAfterEnv: ["<rootDir>/src/__testSetup__/SetupTests.js"],

  // Components import .css files. Jest can't parse CSS, so swap them for an empty object.
  moduleNameMapper: {
    "\\.(css)$": "<rootDir>/src/__testSetup/testStyling.js",
  },
};
