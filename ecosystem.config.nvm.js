module.exports = {
  apps: [
    {
      name: 'zeritu-backend',
      cwd: '/var/www/zeritu/zeritu_backend',
      // Use interpreter from NVM
      interpreter: process.env.NVM_DIR ? `${process.env.HOME}/.nvm/versions/node/v20.*/bin/node` : 'node',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3006,
        // Load NVM in the environment
        NVM_DIR: process.env.NVM_DIR || `${process.env.HOME}/.nvm`,
        PATH: process.env.NVM_DIR ? `${process.env.HOME}/.nvm/versions/node/v20.*/bin:${process.env.PATH}` : process.env.PATH
      },
      error_file: '/var/www/zeritu/logs/backend-error.log',
      out_file: '/var/www/zeritu/logs/backend-out.log',
      log_file: '/var/www/zeritu/logs/backend-combined.log',
      time: true,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'zeritu-frontend',
      cwd: '/var/www/zeritu/zeritu_web',
      // Use interpreter from NVM
      interpreter: process.env.NVM_DIR ? `${process.env.HOME}/.nvm/versions/node/v20.*/bin/node` : 'node',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3007,
        // Load NVM in the environment
        NVM_DIR: process.env.NVM_DIR || `${process.env.HOME}/.nvm`,
        PATH: process.env.NVM_DIR ? `${process.env.HOME}/.nvm/versions/node/v20.*/bin:${process.env.PATH}` : process.env.PATH
      },
      error_file: '/var/www/zeritu/logs/frontend-error.log',
      out_file: '/var/www/zeritu/logs/frontend-out.log',
      log_file: '/var/www/zeritu/logs/frontend-combined.log',
      time: true,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};

