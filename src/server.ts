import fastify from 'fastify'
import { render, RenderOpts, RenderOptsType } from './render'

const contentTypes = {
  svg: 'image/svg+xml',
  png: 'image/png'
}

export default function build (opts = {}): ReturnType<typeof fastify> {
  const server = fastify(opts)

  // TODO: Register routes
  server.get('/', async function (req, res) {
    return 'hello there'
  })

  server.get<{ Querystring: RenderOptsType }>('/render', {
    schema: {
      querystring: RenderOpts
    }
  }, async (request, reply) => {
    void reply.type(contentTypes[request.query.output])
    return await render(request.query)
  })

  server.post<{ Body: RenderOptsType }>('/render', {
    schema: {
      body: RenderOpts
    }
  }, async (request, reply) => {
    void reply.type(contentTypes[request.body.output])
    return await render(request.body)
  })

  return server
}
