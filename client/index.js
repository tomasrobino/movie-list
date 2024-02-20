import dotenv from "dotenv";
import { select, input } from "@inquirer/prompts";
dotenv.config({path: "../.env"});


console.log("MOVIE LIST");
let exit = true;
while (exit) {
    let answer = await select({
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
            },
            {
                name: "Exit the program",
                value: "exit"
            }
        ]
    });
    switch (answer) {
        case "list":        
            await fetch(`http://${process.env.HOST}:${process.env.PORT}/api`).then(res => res.json()).then(res => console.log(res));
            break;
        case "insert":
            async function watch() {
                let w = await input({message: "Have you watched it? (y/n)", validate: (value) => {
                    if (value === "" || (value === "y" || value === "yes" || value === "n" || value === "no")) {
                        return true;
                    } else {
                        "Invalid input"
                    }
                }})
                if (w === "y" || w === "yes") {
                    return 1;
                } else if (w === "n" || w === "no") {
                    return 0;
                } else return null;
            }
            await fetch(`http://${process.env.HOST}:${process.env.PORT}/api`, { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: await input({message: "Enter the title", validate: (value) => {
                        if (value !== "") {
                            return true;
                        } else {
                            "Please enter a title"
                        }
                    }}),
                    year: await input({message: "Enter the release year", default: "", validate: (value) => {
                        const y = parseFloat(value);
                        if (value === "" || (Number.isInteger(y) && y > 1800)) {
                            return true;
                        } else {
                            "Please enter a valid year"
                        }
                    }}),
                    rating: await input({message: "Enter the rating, from 0 to 10", validate: (value) => {
                        if (value === "" || (!isNaN(value) && value >= 0 && value <= 10)) {
                            return true;
                        } else {
                            "Please enter a valid rating"
                        }
                    }}),
                    watched: await watch()
                })
            });
            break;
        case "remove":
            break;
        case "modify":
            break;
        case "exit":
            exit = false;
            break;
    }
}