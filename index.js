import fs from "fs";
import { Command } from "commander";

const program = new Command();

program
  .name("BudgetTracker")
  .description("A CLI utility to help you manage your budget effectively")
  .version("1.0.0");

const loadBudgets = () => {
  if (fs.existsSync("./data/budgets.json")) {
    const data = fs.readFileSync("./data/budgets.json", "utf-8");
    return JSON.parse(data);
  }
  return [];
};

const saveBudgets = (budgets) => {
  fs.writeFileSync("./data/budgets.json", JSON.stringify(budgets, null, 2));
};


program
  .command("add")
  .description("Add a new budget entry")
  .option("-t, --title <title>", "Budget title")
  .option("-a, --amount <amount>", "Total budget amount")
  .action((options) => {
    const { title, amount } = options;
    const newEntry = {
      title,
      amount,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let budgets = loadBudgets();
    const existingEntry = budgets.find((entry) => entry.title === title);

    if (existingEntry) {
      console.log(`An entry with the title '${title}' already exists.`);
      return;
    }

    budgets.push(newEntry);
    saveBudgets(budgets);
    console.log(`New budget entry '${title}' added successfully.`);
  });


program
  .command("update")
  .description("Update an existing budget entry")
  .option("-t, --title <title>", "Budget title to update")
  .option("-a, --amount <amount>", "New budget amount")
  .action((options) => {
    const { title, amount } = options;
    let budgets = loadBudgets();

    const entry = budgets.find((entry) => entry.title === title);
    if (!entry) {
      console.log(`Budget entry with title '${title}' not found.`);
      return;
    }

    entry.amount = amount || entry.amount;
    entry.updatedAt = new Date();

    saveBudgets(budgets);
    console.log(`Budget entry '${title}' updated successfully.`);
  });


program
  .command("view")
  .description("View all budget entries or a specific entry by title")
  .option("-t, --title <title>", "Title of budget entry to view")
  .action((options) => {
    const { title } = options;
    const budgets = loadBudgets();

    if (title) {
      const entry = budgets.find((entry) => entry.title === title);
      if (entry) {
        console.log("Budget Entry Details:");
        console.log(`Title: ${entry.title}`);
        console.log(`Amount: ${entry.amount}`);
        console.log(`Created At: ${entry.createdAt}`);
        console.log(`Last Updated: ${entry.updatedAt}`);
      } else {
        console.log(`No budget entry found with the title '${title}'.`);
      }
    } else {
      if (budgets.length === 0) {
        console.log("No budget entries available.");
      } else {
        console.log("All Budget Entries:");
        budgets.forEach((entry) => {
          console.log("-------------");
          console.log(`Title: ${entry.title}`);
          console.log(`Amount: ${entry.amount}`);
          console.log(`Created At: ${entry.createdAt}`);
          console.log(`Last Updated: ${entry.updatedAt}`);
        });
      }
    }
  });

program
  .command("delete")
  .description("Delete a budget entry by title")
  .option("-t, --title <title>", "Title of budget entry to delete")
  .action((options) => {
    const { title } = options;
    let budgets = loadBudgets();

    const filteredBudgets = budgets.filter((entry) => entry.title !== title);
    if (filteredBudgets.length === budgets.length) {
      console.log(`No budget entry found with the title '${title}'.`);
      return;
    }

    saveBudgets(filteredBudgets);
    console.log(`Budget entry with title '${title}' deleted successfully.`);
  });

program.parse(process.argv);
