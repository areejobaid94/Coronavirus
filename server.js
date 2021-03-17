const express = require("express");
const superAgent = require("superagent");
const pg = require("pg");
const cors = require("cors");
const methodOverride = require("method-override");
// setup and configuration
require("dotenv").config();
const app = express();
app.use(cors());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static("public"));
const port = process.env.PORT;
app.use(express.urlencoded({ extended: true }));
// const client = new pg.Client(process.env.DATABASE_URL); // on your machine
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
}); // for heroku

app.get("/", renderHomePage);

app.post("/search", searchForacases);

app.get("/all", getAll);

app.post("/add", addToDB);

app.get("/myRecords", RenderMyRecords);

app.get("/details/:id", getDetails);

app.delete("/delete/:id", deleteFromDB);

function deleteFromDB(req, res) {
  return client
    .query("DELETE FROM allCases WHERE ID = $1", [req.params.id])
    .then(() => {
      res.redirect("/myRecords");
    })
    .catch((err) => {
      console.log(err);
    });
}

function getDetails(req, res) {
  return client
    .query("SELECT * FROM allCases where id = $1", [req.params.id])
    .then((data) => {
      res.render("details", { data: data.rows[0] });
    })
    .catch((err) => {
      console.log(err);
    });
}

function RenderMyRecords(req, res) {
  return client
    .query("SELECT * FROM allCases")
    .then((data) => {
      console.log(data.rows);
      res.render("myRecords", { data: data.rows });
    })
    .catch((err) => {
      console.log(err);
    });
}

function addToDB(req, res) {
  console.log(req.body);
  return client
    .query(
      "INSERT INTO allCases (Country,CountryCode,TotalConfirmed,TotalDeaths,TotalRecovered,Date)  values ($1,$2,$3,$4,$5,$6)",
      [
        req.body.Country,
        req.body.CountryCode,
        req.body.TotalConfirmed,
        req.body.TotalDeaths,
        req.body.TotalRecovered,
        req.body.Date,
      ]
    )
    .then(() => {
      res.redirect("/myRecords");
    })
    .catch((err) => {
      console.log(err);
    });
}

function getAll(req, res) {
  return superAgent
    .get("https://api.covid19api.com/summary")
    .then((data) => {
      res.render("allCountries", { data: data.body.Countries });
    })
    .catch((err) => {
      console.log(err);
    });
}

function renderHomePage(req, res) {
  getTota()
    .then((data) => {
      console.log(data);
      res.render("index", { data, data });
    })
    .catch((err) => {
      console.log(err);
    });
}

function searchForacases(req, res) {
  return superAgent
    .get(
      `https://api.covid19api.com/country/${req.body.name}?from=${req.body.from}&to=${req.body.to}`
    )
    .then((data) => {
      res.render("getCountryResult", { data: data.body });
      console.log(data.body);
    })
    .catch((err) => {
      console.log(err);
    });
}

function getTota() {
  return superAgent
    .get("https://api.covid19api.com/world/total")
    .then((data) => {
      return data.body;
    })
    .catch((err) => {
      console.log(err);
    });
}

client
  .connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`app listening at http://localhost:${port}`);
    });
  })
  .catch((e) => {
    console.log(e, "errrrrroooooorrrr");
  });
