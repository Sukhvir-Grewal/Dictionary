const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const app = express();

//Using this port for testing
const Http_port = 8080;
let counter = 0;
//Setting up the handleBars for the views folder
app.engine(
    ".hbs",
    exphbs.engine({
        extname: "hbs",
        helpers: {
            count: () => `${++counter}. `,
            countReset: () => {
                counter = 0;
            },
            space: () => " ",
        },
    })
);
app.set("view engine", ".hbs");

//This is main url for the api to search the word for their meaning
const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";

//This will make us able to work with form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//This folder is static mostly will be use for css(only be used for this website) and images(not for this website)
app.use(express.static("public"));

//Main page route
app.get("/", (req, res) => {
    res.render("meaning");
});

//Main page Logic
app.post("/", async (req, res) => {
    try {
        const { search } = req.body;
        const response = await fetch(url + search);
        const json = await response.json();
        //This array will hold the meaning, examples of the word and will pass it
        //to meaning.hbs to print on page
        const meanings = [];
        let audio;

        //testing looping through all the meanings
        //Logic to search the audio in the phonetics array
        for (let i = 0; i < json[0].phonetics.length; i++) {
            if (json[0].phonetics[i].audio !== "") {
                audio = json[0].phonetics[i].audio;
            }
        }

        const wordName = json[0].word;

        for (let i = 0; i < json[0].meanings[0].definitions.length; i++) {
            const { definition, example, synonyms, antonyms } =
            json[0].meanings[0].definitions[i];
            //we will use this regular expression
            //to erase all the word inside () in the starting
            //of the word's meaning like (noun)
            const meaning = definition.replace(/\([^)]*\)/g, "").trim();
            console.log(example)
            meanings.push({
                meaning,
                examples: example,
                synonyms,
                antonyms,
            });
        }

        res.render("meaning", { meanings, audio, wordName });
    } catch (err) {
        res.render("meaning", {
            wordName: req.body.search,
            meanings: null,
            error: `Sorry, we could not find the meaning of ${req.body.search}. Please try again!`,
        });
    }
});

//Starting Server
app.listen(Http_port, () => {
    console.log(`Server running on port ${Http_port}`);
});
