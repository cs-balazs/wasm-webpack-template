import { SomeOutput } from "../wasm";

const worker = new Worker(new URL("./wasm.worker.ts", import.meta.url));

worker.addEventListener("message", ({ data }) => {
  const result: SomeOutput = JSON.parse(data);
  console.log("Message from worker:", result);
});

export {};
