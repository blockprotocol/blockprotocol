console.log("action build");

await new Promise((resolve) => {
  setTimeout(resolve, 1000);
});

console.log(process.argv);
