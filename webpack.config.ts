import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import "webpack-dev-server";
import { exec } from "child_process";
import WatchExternalFilesPlugin from "webpack-watch-files-plugin";

class BuildWasmHook extends webpack.DefinePlugin {
  apply(compiler: webpack.Compiler) {
    compiler.hooks.watchRun.tapPromise("BuildWasmHook", async (compiler) => {
      const logger = compiler.getInfrastructureLogger("BuildWasmHook");
      const rustCodeChanged = [
        ...(compiler.modifiedFiles?.values() ?? []),
      ].some((file) => file.endsWith(".rs"));

      if (rustCodeChanged) {
        await new Promise<void>((resolve, reject) => {
          const proc = exec(
            "npm run build:wasm && npm run build:wasm-bindgen",
            (error, stdout, stderr) => {
              if (error) {
                logger.error(stderr);
                logger.error(error);
              }
              resolve();
            }
          );
          proc.stdout?.pipe(process.stdout);
          proc.stderr?.pipe(process.stderr);
        });
      }
    });
  }
}

const config: webpack.Configuration = {
  mode: "production",
  entry: "./site/index.ts",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "index.js",
  },
  target: "web",
  experiments: {
    asyncWebAssembly: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "public"),
    },
    compress: true,
    port: 9000,
    watchFiles: ["./site/**/*", "./wasm/**/*"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "swc-loader",
          options: {
            jsc: {
              parser: {
                syntax: "typescript",
              },
            },
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new WatchExternalFilesPlugin({
      files: ["./src/**/*.rs"],
    }),
    new BuildWasmHook({}),
    new HtmlWebpackPlugin({
      template: "./site/index.html",
    }),
  ],
};

export default config;
