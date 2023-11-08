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
  //Write your code here.

  const results = await db.query("SELECT country_code FROM visited_countries") // Query
  let total = results.rows.length;
  console.log(`There are ${total} entries.`)                     // Control

  results.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  console.log(results.rows);

  res.render("index.ejs", {                                                         // Rendering
    countries: countries,
    total: total
  })

console.log(countries)                                                       // Control
db.end();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});