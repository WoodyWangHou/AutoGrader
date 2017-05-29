module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'test_server',
      script    : 'app.js'
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'ubuntu',
      host : 'ec2-52-77-231-105.ap-southeast-1.compute.amazonaws.com',
      key  : '~/.ssh/test-nusautograder.pem',
      ref  : 'origin/master',
      repo : 'git@github.com:WoodyWangHou/test_NUSAutograder_server.git',
      path : 'test-server',
      'post-deploy' : 'npm install && sudo pm2 reload ecosystem.config.js --env production'
    }
  }
};
