require("dotenv").config();
module.exports = {
  apps: [
    {
      name: "API",
      script: "src/index.ts",
      watch: true,
      max_memory_restart: "1G",
      ignore_watch: ["files"],
      env: {
        NODE_PATH: "../../../:./node_modules",
        ...process.env
      }
    }
  ]
};
