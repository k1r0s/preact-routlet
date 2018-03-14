import common from './rollup.common'

export default {
  input: `preact.dev.js`,
  output: [
		{ file: 'preact.js', name: 'routletPreact', format: 'umd' },
  ],
  plugins: common
}
