import fs from 'fs';
import { Command } from "commander";

const program = new Command();

program.name("BudgetTracker").description("A CLI utility to help you keep track of your budget").version("1.0.0");

program.command("new")
.description("Adds a new note")
.option("-t | --title <value>", "Weekly budget")
.option("-b | --body <value>", "The entire budget")
.action(function(options) {
    const title = options.title;
    const body = options.body;
    
    const newBudget = {
        title: title,
        body: body,
        createdAt: new Date(),
        lastUpdateAt: new Date(),
    }
    
    const loadedBudget = fs.readFileSync("./data/budgets.json", "utf-8");
    let budget;
    if (!loadedBudget) {
        budget = [];
    }
    budget = JSON.parse(loadedBudget);

    budget.push(newBudget);

    fs.writeFileSync("./data/budgets.json", JSON.stringify(budget));
});



program.parse(process.argv);