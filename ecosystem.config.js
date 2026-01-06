module.exports = {
  apps : [
    {
      name: "secure-backend",
      cwd: "./backend",
      script: "server.js",
      env: {
        PORT: 5000,
        NODE_ENV: "production",
        // Force bind to all interfaces if needed, though Express usually does this by default
        // HOST: "0.0.0.0" 
      }
    },
    {
      name: "secure-frontend",
      cwd: "./frontend",
      script: "npm",
      // Passes arguments to the underlying vite preview command
      // --port 3999: sets the port
      // --host 0.0.0.0: binds to all network interfaces
      args: "run preview -- --port 3999 --host 0.0.0.0",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
