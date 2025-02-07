import path from "path";
import server from "../src/server";


afterAll(() => {
  server.close(); // Stop the server after tests
});