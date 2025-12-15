module.exports = {
  apps: [
    {
      name: 'zeritu-backend',
      cwd: '/home/barch/zeritu/zeritu_backend',
      script: './start.sh',
      interpreter: 'bash',
      env: {
        NODE_ENV: 'production',
        PORT: 3006
      },
      error_file: '/home/barch/zeritu/logs/backend-error.log',
      out_file: '/home/barch/zeritu/logs/backend-out.log',
      log_file: '/home/barch/zeritu/logs/backend-combined.log',
      time: true,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'zeritu-frontend',
      cwd: '/home/barch/zeritu/zeritu_web',
      script: './start.sh',
      interpreter: 'bash',
      env: {
        NODE_ENV: 'production',
        PORT: 3007
      },
      error_file: '/home/barch/zeritu/logs/frontend-error.log',
      out_file: '/home/barch/zeritu/logs/frontend-out.log',
      log_file: '/home/barch/zeritu/logs/frontend-combined.log',
      time: true,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};

