import express from "express";

import { Liquid } from "liquidjs";

// Express
const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// Liquid
const engine = new Liquid();

app.engine("liquid", engine.express());

// Views
app.set("views", "./views");

// API
// TEMPORARY ENDPOINT
const directusBaseUrl = "https://fdnd-agency.directus.app/items";
const messagesEndpoint = `${directusBaseUrl}/bib_signups`;

// Routes
app.get("/", async function (request, response) {
  response.render("index.liquid");
});

// notice-board
app.get("/notice-board", async function (request, response) {
  const res = await fetch(`${directusBaseUrl}/bib_signups`);
  const json = await res.json();

  response.render("index.liquid", {
    messages: json.data
  });
});

app.post("/notice-board", async function (request, respond) {
  // Haal textArea uit de request body
  const { textArea } = request.body;

  // Post opmerking naar messagesEndpoint
  await fetch(`${messagesEndpoint}`, {
    method: "POST",
    body: JSON.stringify({
      message: textArea,
      date_created: Date(),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  respond.redirect("/notice-board");
});

// Port
app.set("port", process.env.PORT || 8000);
app.listen(app.get("port"), function () {
  console.log(`Project draait via http://localhost:${app.get("port")}`);
});
