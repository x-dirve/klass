const { join } = require("path")
const alias = require('rollup-plugin-alias')
const buble = require("rollup-plugin-buble")
const resolve = require('rollup-plugin-node-resolve')
const cjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')

const typescript = require("rollup-plugin-typescript2")
const cwd = __dirname

const baseConfig = {
    input: join(cwd, "src/index.ts"),
    output: [
        {
            file: join(cwd, "dist/index.js"),
            format: "cjs",
            sourcemap: true,
            exports: "named"
        }
    ],
    external: ['@x-drive/utils'],
    plugins: [
        resolve({
            preferBuiltins: false
        }),
        cjs(),
        babel({
            babelrc: false,
            presets: [
                ['@babel/preset-env', {
                    modules: false
                }]
            ],
            plugins: [
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-proposal-object-rest-spread'
            ]
        }),
        alias({
            entries: [
                {
                    find: '@x-drive/utils',
                    replacement: join(cwd, 'node_modules/@x-drive/utils/dist/index.esm')
                }
            ]
        }),
        typescript({
            tsconfigOverride: {
                compilerOptions: {
                    preserveConstEnums: true
                }
            }
        }),
        buble()
    ]
}
const esmConfig = Object.assign({}, baseConfig, {
    output: Object.assign({}, baseConfig.output, {
        sourcemap: true,
        format: "es",
        file: join(cwd, "dist/index.esm.js")
    }),
    plugins: [
        typescript()
    ]
})

function rollup() {
    const target = process.env.TARGET

    if (target === "umd") {
        return baseConfig
    } else if (target === "esm") {
        return esmConfig
    } else {
        return [baseConfig, esmConfig]
    }
}
module.exports = rollup()
