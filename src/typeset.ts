import { mathjax } from 'mathjax-full/js/mathjax.js'
import { TeX } from 'mathjax-full/js/input/tex.js'
import { MathML } from 'mathjax-full/js/input/mathml.js'
import { SVG } from 'mathjax-full/js/output/svg.js'
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js'
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js'
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js'
import { InputJax } from 'mathjax-full/js/core/InputJax'

const DEFAULT_OPTIONS = {
  width: 1280,
  ex: 8,
  em: 16,
  background: 'transparent',
  foreground: 'black',
  inline: true
}

type TypesetOptions = Partial<typeof DEFAULT_OPTIONS>

export const typesetJax = (input: string, jax: InputJax<unknown, unknown, unknown>, opts: TypesetOptions = {}): string => {
  const options: typeof DEFAULT_OPTIONS = { ...DEFAULT_OPTIONS, ...opts }

  const adaptor = liteAdaptor()
  RegisterHTMLHandler(adaptor)

  const svg = new SVG({ fontCache: 'local' })
  const html = mathjax.document('', { InputJax: jax, OutputJax: svg })

  const node = html.convert(input, {
    display: !options.inline,
    em: options.em,
    ex: options.ex,
    containerWidth: options.width
  })

  const svgString = adaptor.innerHTML(node)
  const css = `svg {
  color: ${options.foreground};
  background-color: ${options.background}
}`

  return svgString.replace('<defs>', `<defs><style>${css}</style>`)
}

export const typesetTex = (input: string, opts: TypesetOptions = {}): string => {
  const packages = AllPackages.sort()
  const tex = new TeX({ packages })
  return typesetJax(input, tex, opts)
}

export const typesetMathML = (input: string, opts: TypesetOptions = {}): string => {
  const mml = new MathML()
  return typesetJax(input, mml, opts)
}
