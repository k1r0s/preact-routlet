import common from './rollup.common'

export default {
  input: `react.dev.js`,
  output: [
		{ file: 'react.js', name: 'routletReact', format: 'umd' },
  ],
  plugins: common
}
