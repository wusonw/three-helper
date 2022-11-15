// rollup.config.js
import serve from "rollup-plugin-serve";
import typescript from "@rollup/plugin-typescript";
import livereload from "rollup-plugin-livereload";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";

export default [
  {
    input: "src/main.ts",
    output: {
      file: "./build/main.js",
      format: "es",
    },
    plugins: [
      // 本地服务器
      serve({
        open: true, // 自动打开页面
        port: 8000,
        openPage: "/index.html", // 打开的页面
        contentBase: "",
      }),
      typescript(),
      resolve(),
      commonjs(),
      livereload("build/bundle.js"),
    ],
  },
];
