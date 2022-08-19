import { Static, Type } from '@sinclair/typebox'
import { typesetMathML, typesetTex } from './typeset'
import { spawn } from 'child_process'
import { file } from 'tmp-promise'
import { readFile, writeFile } from 'fs/promises'
import { InternalServerError } from 'http-errors'

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
    case 'svg': {
      return svg
    }

    case 'png': {
      const origSvg = await file({ postfix: '.svg' })
      const marginSvg = await file({ postfix: '.svg' })
      const renderedPng = await file({ postfix: '.png' })
      try {
        await writeFile(origSvg.path, svg)

        const marginProcess = spawn('inkscape', [
          origSvg.path,
          '--export-margin=50',
          '--export-plain-svg',
          '--export-type=svg',
          '--export-overwrite',
          `--export-filename=${marginSvg.path}`
        ])

        await new Promise((resolve, reject) => {
          marginProcess.on('exit', (code) => {
            if (code === 0) {
              resolve(code)
            } else {
              reject(code)
            }
          })
          marginProcess.on('error', reject)
        })

        const args = [
          marginSvg.path,
          '--export-type=png',
          '--export-overwrite',
          `--export-filename=${renderedPng.path}`
        ]
        if (opts.width !== undefined) {
          args.push('-w', opts.width.toString())
        }
        if (opts.height !== undefined) {
          args.push('-h', opts.height.toString())
        }
        if (opts.background !== undefined) {
          args.push('-b', opts.background)
        }

        const renderer = spawn('inkscape', args)
        await new Promise((resolve, reject) => {
          renderer.on('exit', (code) => {
            if (code === 0) {
              resolve(code)
            } else {
              reject(code)
            }
          })
          renderer.on('error', reject)
        })

        return await readFile(renderedPng.path)
      } catch (err) {
        throw new InternalServerError('Unable to rasterize')
      } finally {
        await Promise.all([
          origSvg.cleanup(),
          marginSvg.cleanup(),
          renderedPng.cleanup()
        ])
      }
    }
  }
}
