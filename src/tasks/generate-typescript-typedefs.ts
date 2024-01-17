const chalk = require("chalk");

const generateTypescriptTypedefs = async () => {
  console.log(chalk.green("✓") + " Testing testing ***");
  return Promise.resolve("woo!");
};

module.exports = generateTypescriptTypedefs;
