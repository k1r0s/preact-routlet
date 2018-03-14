import babel from 'rollup-plugin-babel';

export default [
    babel({
      exclude: 'node_modules/**',
      "presets": [
        [
          "env",
          {
            "modules": false
          }
        ]
      ],
      "plugins": [
        "external-helpers",
        "transform-object-rest-spread",
        "transform-class-properties"
      ]
    })
  ]
