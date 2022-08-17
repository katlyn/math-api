declare module 'convert-svg-to-png' {
  export interface ConvertOptions {
    allowDeprecatedAttributes: boolean
    background: string
    baseFile: string
    baseUrl: string
    height: string | number
    width: string | number
    rounding: 'ceil' | 'floor' | 'round'
    scale: number
    puppeteer: Record
  }
  export function convert (svg: string | Buffer, options: Partial<ConvertOptions>): Promise<Buffer>
}
