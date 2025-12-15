module.exports = {
  apps: [
    {
      name: 'zeritu-backend',
      cwd: '/var/www/zeritu/zeritu_backend',
      script: 'npm',
      args: 'start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
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
      script: 'npm',
      args: 'start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
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

