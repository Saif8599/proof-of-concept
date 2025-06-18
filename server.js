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

// User
// TEMPORARY ID
const userID = 55192;

// Routes

// Proxy
app.get("/proxy-image", async (request, response) => {
  try {
    // 1. Pak en decode de URL
    const imageUrl = decodeURIComponent(request.query.url);

    // 2. Basis validatie
    if (!imageUrl?.includes("ls-test2.worrell.nl")) {
      return res.status(403).send("Alleen ls-test2.worrell.nl URLs toegestaan");
    }

    // 3. Haal afbeelding op
    const imgResponse = await fetch(imageUrl, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    // 4. Stuur door naar browser
    response.set({
      "Content-Type": imgResponse.headers.get("content-type"),
    });
    response.send(Buffer.from(await imgResponse.arrayBuffer()));
  } catch (error) {
    console.error("Proxy error:", error.message);
    response.status(500).send("Fout bij laden afbeelding");
  }
});

// Index
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

  // 1. API call voor alle members uit geselecteerde class
  const classMembersResponse = await fetch(
    `${baseUrl}/en/api/model/maxclass_membership/get/class/${classID}/member`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    }
  );
  const classMembers = await classMembersResponse.json();

  // console.log(`API member list van class ${classID}:`, classMembers.result);

  // 2. Verwerk elke member
  const membersWithDetails = await Promise.all(
    classMembers.result.map(async (classMemberId) => {
      const resultResponse = await fetch(
        `${baseUrl}/en/api/model/rsc_export/get/${classMemberId}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            Accept: "application/json",
          },
        }
      );
      const resultData = await resultResponse.json();
      // console.log(resultData);

      return {
        id: resultData.result?.id,
        profile: resultData.result,
        depiction_url: resultData.result?.depiction_url,
      };
    })
  );

  // 3. Render template
  response.render("class.liquid", {
    members: membersWithDetails,
    class_id: classID,
  });
});

app.post("/class/:classID/check-matches", function (request, response) {
  // 1. Pak ALLES wat ingevuld is in het formulier
  const formData = request.body; // Bijv: Key: 'match-55173', Value: '55173'
  const classID = request.params.classID;

  // 2. Een teller voor goede antwoorden
  let right = 0;
  let total = 0;

  // console.log(formData);

  // 3. Loop door ALLE formuliervelden heen
  for (const question in formData) {
    // 4. Kijk alleen naar vragen die met 'match-' beginnen
    if (question.startsWith("match-")) {
      total++; // Tel elke vraag mee

      // 5. Check of het answer goed is
      // Bijv: question = "match-55173", value = "55173"
      const key = question.replace("match-", ""); // Vervang match met "" zodat id overblijft
      const value = formData[question]; // "55173"

      const isCorrect = key === value;
      if (isCorrect) right++; // Tel 1 bij goed op
    }
  }

  // 6. Render het template met ALLE benodigde data
  response.render("class.liquid", {
    class_id: classID, // Klasnummer
    score: { // Score
      right: right,
      total: total,
    },
  });
});

// Geen matching route request
app.use((request, respond) => {
  respond.status(404).render("404.liquid");
});

// Port
app.set("port", process.env.PORT || 8000);
app.listen(app.get("port"), function () {
  console.log(`Project draait via http://localhost:${app.get("port")}`);
});
