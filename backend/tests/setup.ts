import server from "../src/server";

// Set the NODE_ENV to test
process.env.NODE_ENV = "test";

afterAll(() => {
  server.close(); // Stop the server after tests
});