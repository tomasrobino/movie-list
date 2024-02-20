import dotenv from "dotenv";
import { select, input } from "@inquirer/prompts";
dotenv.config({path: "../.env"});


console.log("MOVIE LIST");
let exit = true;

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
            await fetch(`http://${process.env.HOST}:${process.env.PORT}/api`).then(res => res.json()).then(res => {
                res.forEach(element => {
                    console.log("Title: "+element.name);
                    if (element.rating === null) {
                        console.log("Unknown");
                    } else console.log("Rating: "+element.rating);
                    if (element.release_year === null) {
                        console.log("Unknown");
                    } else console.log("Release year: "+element.release_year);
                    if (element.watched === null) {
                        console.log("Unknown");
                    } else if (element.watched === 1) {
                        console.log("Watched: Yes")
                    } else console.log("Watched: No");
                    console.log("-----------------");
                });
            });
            break;
        case "insert":
            let reinsert = true;
            while (reinsert) {
                const title = await input({message: "Enter the title", validate: (value) => {
                    if (value !== "") {
                        return true;
                    } else {
                        "Please enter a title"
                    }
                }})
                const year = await input({message: "Enter the release year", default: "", validate: (value) => {
                    const y = parseFloat(value);
                    if (value === "" || (Number.isInteger(y) && y > 1800)) {
                        return true;
                    } else {
                        "Please enter a valid year"
                    }
                }})
                const rating = await input({message: "Enter the rating, from 0 to 10", validate: (value) => {
                    if (value === "" || (!isNaN(value) && value >= 0 && value <= 10)) {
                        return true;
                    } else {
                        "Please enter a valid rating"
                    }
                }})
                const watched = await watch();

                const res = await fetch(`http://${process.env.HOST}:${process.env.PORT}/api?title=${title}&year=${year}`).then(res => res.json()).then(res => res);

                if (res.length === 0) {
                    await fetch(`http://${process.env.HOST}:${process.env.PORT}/api`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            title: title,
                            year: year,
                            rating: rating,
                            watched: watched
                        })
                    });
                    reinsert = false;
                    console.log("Addition successful");
                } else console.log("Movie already exists, please try again");
            }
            break;
        case "remove":
            let reremove = true;
            while (reremove) {
                const title = await input({message: "Enter the title", validate: (value) => {
                    if (value !== "") {
                        return true;
                    } else {
                        "Please enter a title"
                    }
                }})
                const year = await input({message: "Enter the release year", default: "", validate: (value) => {
                    const y = parseFloat(value);
                    if (value === "" || (Number.isInteger(y) && y > 1800)) {
                        return true;
                    } else {
                        "Please enter a valid year"
                    }
                }})

                const res = await fetch(`http://${process.env.HOST}:${process.env.PORT}/api?title=${title}&year=${year}`).then(res => res.json()).then(res => res);

                if (res.length !== 0) {
                    await fetch(`http://${process.env.HOST}:${process.env.PORT}/api`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            title: title,
                            year: year
                        })
                    });
                    reremove = false;
                    console.log("Removal successful");
                } else console.log("Movie doesn't exist, please try again");
            }
            break;
        case "modify":
            let remod = true;
            while (remod) {
                const title = await input({message: "Enter the title", validate: (value) => {
                    if (value !== "") {
                        return true;
                    } else {
                        "Please enter a title"
                    }
                }})
                const year = await input({message: "Enter the release year", default: "", validate: (value) => {
                    const y = parseFloat(value);
                    if (value === "" || (Number.isInteger(y) && y > 1800)) {
                        return true;
                    } else {
                        "Please enter a valid year"
                    }
                }})
                
                const res = await fetch(`http://${process.env.HOST}:${process.env.PORT}/api?title=${title}&year=${year}`).then(res => res.json()).then(res => res);

                if (res.length !== 0) {
                    let field = await select({ message: "Choose which field to modify:", choices: [
                        {
                            name: "Title",
                            value: "name",
                        },
                        {
                            name: "Release year",
                            value: "year"
                        },
                        {
                            name: "Rating",
                            value: "rating"
                        },
                        {
                            name: "Watch status",
                            value: "watched"
                        }
                    ]})

                    let ans;
                    switch (field) {
                        case "name":
                            ans = await input({message: "Enter the title", validate: (value) => {
                                if (value !== "") {
                                    return true;
                                } else {
                                    "Please enter a title"
                                }
                            }});
                            break;
                        case "year":
                            ans = await input({message: "Enter the release year", default: "", validate: (value) => {
                                const y = parseFloat(value);
                                if (value === "" || (Number.isInteger(y) && y > 1800)) {
                                    return true;
                                } else {
                                    "Please enter a valid year"
                                }
                            }});
                            break;
                        case "rating":
                            ans = await input({message: "Enter the rating, from 0 to 10", validate: (value) => {
                                if (value === "" || (!isNaN(value) && value >= 0 && value <= 10)) {
                                    return true;
                                } else {
                                    "Please enter a valid rating"
                                }
                            }});
                            break;
                        case "watched":
                            ans = await watch();
                            break;
                    }

                    await fetch(`http://${process.env.HOST}:${process.env.PORT}/api`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            field: field,
                            answer: ans,
                            title: title,
                            year: year
                        })
                    });
                    remod = false;
                    console.log("Modification successful");
                } else console.log("Movie doesn't exist, please try again");
            }
            break;
        case "exit":
            exit = false;
            break;
    }
}