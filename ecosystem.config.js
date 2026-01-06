module.exports = {
  apps: [
    {
      name: "secure-backend",
      cwd: "./backend",
      script: "server.js",
      env: {
        NODE_ENV: "production",
        PORT: 5000
      }
    },
    {
      name: "secure-frontend",
      cwd: "./frontend",
      script: "npm",
      args: "run preview",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
