import express from "express";

import { Liquid } from "liquidjs";

import "dotenv/config";

// API variabelen uit .env
const baseUrl = process.env.API_BASE_URL;
const apiKey = process.env.API_KEY;

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

// Notice-board
app.get("/notice-board", async function (request, response) {
  const res = await fetch(`${directusBaseUrl}/bib_signups`);
  const json = await res.json();

  response.render("notice-board.liquid", {
    messages: json.data,
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

// Class
app.get("/class/:classID", async function (request, response) {
  const classID = request.params.classID;

  // API call voor alle members uit geselecteerde class
  const classMembersResponse = await fetch(
    `${baseUrl}/en/api/model/maxclass_membership/get/class/${classID}/member`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    }
  );

  const members = await classMembersResponse.json();
  console.log(`API member list van class ${classID} :`, members);

  response.render("class.liquid", {
    members: members.result, // selecteer aray 'result' in members
  });
});

// Port
app.set("port", process.env.PORT || 8000);
app.listen(app.get("port"), function () {
  console.log(`Project draait via http://localhost:${app.get("port")}`);
});
