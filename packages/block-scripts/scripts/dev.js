console.log("dev script");

await new Promise((resolve) => {
  setTimeout(resolve, 1000);
});

console.log(process.env.SCRIPT_ARGV);
