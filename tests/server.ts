import t from 'tap'
import buildServer from '../src/server'

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).toString()

t.test('GET `/` route', async t => {
  const server = buildServer()
  t.teardown(async () => await server.close())

  const response = await server.inject().get('/').end()
  t.equal(response.statusCode, 200, 'Returns a status code of 200')
  t.equal(response.body, 'hello there', 'Response body is `hello there`')
  t.equal(response.headers['content-type'], 'text/plain; charset=utf-8', 'Mimetype is `text/plain; charset=utf-8`')
})

t.test('GET /render', async t => {
  const server = buildServer()
  t.teardown(async () => await server.close())

  t.test('Output SVG', async t => {
    const response = await server.inject().get('/render?input=latex&output=svg&source=x').end()
    t.equal(response.statusCode, 200, 'Response has OK status code')
    t.equal(response.headers['content-type'], 'image/svg+xml', 'Response has correct MIME type')
    t.ok(response.body.includes('</svg>'), 'Response contains SVG closing tag')
  })

  t.test('Output PNG', async t => {
    const response = await server.inject().get('/render?input=latex&output=png&source=x&width=500').end()
    const data = response.body.slice(0, PNG_SIGNATURE.length)

    t.equal(response.statusCode, 200, 'Response has OK status code')
    t.equal(response.headers['content-type'], 'image/png', 'Response has correct MIME type')
    t.strictSame(data, PNG_SIGNATURE, 'Response has correct PNG signature')
  })
})

t.test('POST /render', async t => {
  const server = buildServer()
  t.teardown(async () => await server.close())

  t.test('Output SVG', async t => {
    const response = await server.inject().post('/render').body({
      input: 'latex',
      output: 'svg',
      source: 'x',
      width: 500
    }).end()

    t.equal(response.statusCode, 200, 'Response has OK status code')
    t.equal(response.headers['content-type'], 'image/svg+xml', 'Response has correct MIME type')
    t.ok(response.body.includes('</svg>'), 'Response contains SVG closing tag')
  })

  t.test('Output PNG', async t => {
    const response = await server.inject().post('/render').body({
      input: 'latex',
      output: 'png',
      source: 'x',
      width: 500
    }).end()
    const data = response.body.slice(0, PNG_SIGNATURE.length)

    t.equal(response.statusCode, 200, 'Response has OK status code')
    t.equal(response.headers['content-type'], 'image/png', 'Response has correct MIME type')
    t.strictSame(data, PNG_SIGNATURE, 'Response has correct PNG signature')
  })
})
