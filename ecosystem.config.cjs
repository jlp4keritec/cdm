module.exports = {
  apps: [{
    name: 'coupe-maison',
    cwd: '.',                 // l'app est à la racine (server.js), pas dans backend/
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '300M',
    env: { NODE_ENV: 'production' },
    error_file: '/home/ubuntu/.pm2/logs/coupe-maison-error.log',
    out_file: '/home/ubuntu/.pm2/logs/coupe-maison-out.log',
    time: true
  }]
};
