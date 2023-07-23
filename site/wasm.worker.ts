const { default: init, sumNumbers } = await import("../wasm");

const main = async () => {
  await init();

  const result = sumNumbers({
    kind: 1,
    numbersOne: [1, 2, 3],
    numbersTwo: [4, 5, 6],
  });

  postMessage(JSON.stringify(result));
};

main();

export {};
