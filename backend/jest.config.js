/** @type {import('ts-jest').JestConfigWithTsJest} **/

module.exports = {
  preset: "ts-jest",                                     // Use ts-jest for TypeScript support
  testEnvironment: "node",                               // Set the test environment for Express (backend)
  testMatch: ["**/tests/**/*.test.ts"],                  // Look for test files inside the 'tests' folder
  clearMocks: true,                                      // Automatically reset mocks between tests
  setupFilesAfterEnv: ["./tests/setup.ts"],              // Setup file (if needed)
  moduleDirectories: ["node_modules", "src"],            // Allow importing modules from 'src'
};