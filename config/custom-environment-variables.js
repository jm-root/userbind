module.exports = {
  gateway: 'gateway',
  redis: 'redis',
  mysql: 'mysql',
  service_name: 'userbind',
  modules: {
    'jm-server-jaeger': {
      config: {
        jaeger: 'jaeger'
      }
    }
  }
}
