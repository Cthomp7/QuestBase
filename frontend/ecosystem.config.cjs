module.exports = {
  apps: [
    {
      name: "questbase",
      script: "server/server.js",
      env_production: {
        NODE_ENV: "production",
      },
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
