import t from 'tap'
import { TeX } from 'mathjax-full/js/input/tex.js'
import { MathML } from 'mathjax-full/js/input/mathml.js'

import { typesetJax, typesetMathML, typesetTex } from '../src/typeset'

const TEX_STRING = 'x'
const MATHML_STRING = '<math display="block"><mtable><mtr><mtd><msup><mrow><mo>(</mo><mi>a</mi><mo>+</mo><mi>b</mi><mo>)</mo></mrow><mn>2</mn></msup></mtd><mtd><mo>=</mo></mtd><mtd><msup><mi>c</mi><mn>2</mn></msup><mo>+</mo><mn>4</mn><mo>⋅</mo><mo>(</mo><mfrac><mn>1</mn><mn>2</mn></mfrac><mi>a</mi><mi>b</mi><mo>)</mo></mtd></mtr><mtr><mtd><msup><mi>a</mi><mn>2</mn></msup><mo>+</mo><mn>2</mn><mi>a</mi><mi>b</mi><mo>+</mo><msup><mi>b</mi><mn>2</mn></msup></mtd><mtd><mo>=</mo></mtd><mtd><msup><mi>c</mi><mn>2</mn></msup><mo>+</mo><mn>2</mn><mi>a</mi><mi>b</mi></mtd></mtr><mtr><mtd><msup><mi>a</mi><mn>2</mn></msup><mo>+</mo><msup><mi>b</mi><mn>2</mn></msup></mtd><mtd><mo>=</mo></mtd><mtd><msup><mi>c</mi><mn>2</mn></msup></mtd></mtr></mtable></math>'

t.test('Typeset Jax', async t => {
  t.test('Typeset MathML Jax', async t => {
    const mml = new MathML()
    const svg = typesetJax(MATHML_STRING, mml)
    t.ok(svg.startsWith('<svg'), 'Starts with opening SVG tag')
    t.ok(svg.endsWith('</svg>'), 'End with closing SVG tag')
  })

  t.test('Typeset TeX Jax', async t => {
    const tex = new TeX()
    const svg = typesetJax(TEX_STRING, tex)
    t.ok(svg.startsWith('<svg'), 'Starts with opening SVG tag')
    t.ok(svg.endsWith('</svg>'), 'End with closing SVG tag')
  })
})

t.test('Typeset SVG', async t => {
  t.test('TeX with default options', async t => {
    const svg = typesetTex(TEX_STRING)
    t.ok(svg.startsWith('<svg'), 'Starts with opening SVG tag')
    t.ok(svg.endsWith('</svg>'), 'End with closing SVG tag')
  })

  t.test('Inline TeX', async t => {
    const svg = typesetTex(TEX_STRING, { inline: true })
    t.ok(svg.startsWith('<svg'), 'Starts with opening SVG tag')
    t.ok(svg.endsWith('</svg>'), 'End with closing SVG tag')
  })

  t.test('TeX with custom colors', async t => {
    const opts = {
      background: 'red',
      foreground: 'blue'
    }
    const svg = typesetTex(TEX_STRING, opts)
    t.ok(svg.startsWith('<svg'), 'Starts with opening SVG tag')
    t.ok(svg.endsWith('</svg>'), 'End with closing SVG tag')
    t.ok(svg.includes(`background-color: ${opts.background}`), 'Background color is correct')
    t.ok(svg.includes(`color: ${opts.foreground}`), 'Background color is correct')
  })
})

t.test('Typeset MathML', async t => {
  t.test('MathML with default options', async t => {
    const svg = typesetMathML(MATHML_STRING)
    t.ok(svg.startsWith('<svg'), 'Starts with opening SVG tag')
    t.ok(svg.endsWith('</svg>'), 'End with closing SVG tag')
  })

  t.test('Inline MathML', async t => {
    const svg = typesetTex(MATHML_STRING, { inline: true })
    t.ok(svg.startsWith('<svg'), 'Starts with opening SVG tag')
    t.ok(svg.endsWith('</svg>'), 'End with closing SVG tag')
  })

  t.test('MathML with custom colors', async t => {
    const opts = {
      background: 'red',
      foreground: 'blue'
    }
    const svg = typesetTex(MATHML_STRING, opts)
    t.ok(svg.startsWith('<svg'), 'Starts with opening SVG tag')
    t.ok(svg.endsWith('</svg>'), 'End with closing SVG tag')
    t.ok(svg.includes(`background-color: ${opts.background}`), 'Background color is correct')
    t.ok(svg.includes(`color: ${opts.foreground}`), 'Background color is correct')
  })
})
