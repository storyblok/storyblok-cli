const chalk = require("chalk");

const generateTypescriptTypedefs = async () => {
  console.log(chalk.green("✓") + " Generating TS typedefs ***");
  return Promise.resolve("woo!");
};

module.exports = generateTypescriptTypedefs;
