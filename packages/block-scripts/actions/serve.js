console.log("action serve");

await new Promise((resolve) => {
  setTimeout(resolve, 1000);
});

console.log(process.argv);
