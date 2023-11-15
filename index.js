import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  host: "localhost",
  user: "postgres",
  database: "world",  
  password: "postgres",
  port: 5432
});

db.connect();

let countries = [];

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", async (req, res) => {

  const results = await db.query("SELECT country_code FROM visited_countries") // Query
  let total = results.rows.length;
  // console.log(`There are ${total} entries.`)                     // Control

  results.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  // console.log(results.rows);

  res.render("index.ejs", {                                                         // Rendering
    countries: countries,
    total: total
  })

// console.log(countries)                                                       // Control
});

app.post("/add", async (req, res) => {                                                              // POST Route where user enter new visited country  

let country = req.body.country;                                                                     // Catch the user entry
const newCountry = await db.query(`SELECT * FROM countries WHERE country_name = '${country}' `);    // Query in the countries db which country it is

let newCountryData = [];                                                                            // Prepare a data array to insert into the visited_countries db
newCountry.rows.forEach(row => {                                                                    // Foreach loop to read the array given by pg
  newCountryData.push(row.country_code)
});

// console.log(newCountryData);

await db.query(`INSERT INTO visited_countries                                                       
(country_code) VALUES($1)`,
newCountryData);                                                                                    // Insert the new country into visited_countries db

res.redirect("/");                                                                                  // Redirect to the main page
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});