import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import terser from "@rollup/plugin-terser";

const name = "dist/patron-components";

const bundle = (config) => ({
  ...config,
  input: "src/index.ts",
  external: (id) => !/^[./]/.test(id),
});

export default [
  bundle({
    plugins: [esbuild()],
    output: [
      {
        file: `${name}.cjs`,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: `${name}.js`,
        format: "es",
        sourcemap: true,
      },
      {
        file: `${name}.mjs`,
        format: "es",
        sourcemap: true,
      },
      {
        file: `${name}.min.mjs`,
        format: "es",
        plugins: [terser()],
        sourcemap: true,
      },
      {
        file: `${name}.min.js`,
        format: "iife",
        plugins: [terser()],
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `${name}.d.ts`,
      format: "es",
    },
  }),
];
