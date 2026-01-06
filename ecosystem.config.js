module.exports = {
  apps: [
    {
      name: "secure-app-combined",
      script: "./backend/server.js",
      env: {
        NODE_ENV: "production",
        PORT: 3999,
        HOST: "0.0.0.0"
      },
      watch: false
    }
  ]
};
