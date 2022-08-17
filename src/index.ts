import build from './server'

const server = build({
  logger: {
    level: 'info'
  }
})
server.listen(80, '0.0.0.0', (err, address) => {
  if (err !== null) {
    server.log.error(err)
    process.exit(1)
  }
  server.log.info(`Listening on ${address}`)
})
