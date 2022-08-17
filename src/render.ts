import { convert } from 'convert-svg-to-png'
import { Static, Type } from '@sinclair/typebox'
import { typesetMathML, typesetTex } from './typeset'

export const RenderOpts = Type.Object({
  input: Type.Union([Type.Literal('latex'), Type.Literal('mathml')]),
  output: Type.Union([Type.Literal('svg'), Type.Literal('png')]),
  source: Type.String(),
  inline: Type.Optional(Type.Boolean()),
  width: Type.Optional(Type.Integer()),
  height: Type.Optional(Type.Integer()),
  foreground: Type.Optional(Type.String()),
  background: Type.Optional(Type.String())
})

export type RenderOptsType = Static<typeof RenderOpts>

const typesetters = {
  latex: typesetTex,
  mathml: typesetMathML
}

export const render = async (opts: RenderOptsType): Promise<string | Buffer> => {
  const svg = typesetters[opts.input](opts.source, opts)

  switch (opts.output) {
    case 'svg':
      return svg

    case 'png':
      return await convert(svg, {
        width: opts.width,
        height: opts.height,
        puppeteer: {
          args: [
            '--no-sandbox'
          ]
        }
      })
  }
}
