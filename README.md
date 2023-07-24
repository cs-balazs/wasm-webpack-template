# wasm-webpack-template

This template serves as a starting point for developing web-targeted wasm applications in rust. Includes a [webpack](https://www.npmjs.com/package/webpack) setup with a dev server that hot reloads for both ts and rust changes. Uses [tsify](https://crates.io/crates/tsify) for type-safety

## building

The project can be built with `npm run build`

## start server

The dev server can be started with `npm run dev`

## testing

`npm run test` executes both regular rust tests, and runs [vitest](https://www.npmjs.com/package/vitest)
