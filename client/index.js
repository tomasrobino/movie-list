import { select } from "@inquirer/prompts";
console.log("MOVIE LIST");
const answer = await select({
    message: "Choose your action",
    choices: [
        {
            name: "List all movies",
            value: "list",
            description: "Lists all currently known movies"
        },
        {
            name: "Add new movie",
            value: "insert",
            description: "Adds a new movie to the database"
        },
        {
            name: "Remove movie",
            value: "remove",
            description: "Removes a movie from the database"
        },
        {
            name: "Modify a movie",
            value: "modify",
            description: "Modifies a movie currently in the database"
        }
    ]
});