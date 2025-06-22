Ontwerp en maak een data driven online concept voor een opdrachtgever

De instructies voor deze opdracht staan in: [docs/INSTRUCTIONS.md](https://github.com/fdnd-task/proof-of-concept/blob/main/docs/INSTRUCTIONS.md)

# LearningStone Match Game

![image](https://github.com/user-attachments/assets/44ea615c-6143-4d51-8b9e-a428955e95bc)

![image](https://github.com/user-attachments/assets/cbd68b0d-3605-4627-bd1f-61bb64d31bc4)

## Inhoudsopgave

  * [Beschrijving](#beschrijving)
  * [Kenmerken](#kenmerken)
  * [Functionaliteit](#functionaliteit)
  * [Installatie](#installatie)
  * [Licentie](#licentie)

## Beschrijving
De **LearningStone Match Game** is een interactieve feature ontwikkeld voor het LearningStone platform, specifiek voor gebruik in groepsruimtes tijdens trainingen. Het spel heeft als hoofddoel om:

- De **sociale verbinding** tussen trainees te versnellen
- Het **leren van namen en gezichten** in grote groepen (50-500 personen) te vergemakkelijken
- Een **speels element** toe te voegen aan blended learning-omgevingen

Dit project is ontwikkeld voor MaxiMonster (voorheen MaxiClass) als onderdeel van hun blended learning platform.

## Kenmerken
In dit project heb ik gebruik gemaakt van Node.js en Express om een webserver te maken. Voor het genereren van dynamische HTML-pagina's is er gebruik gemaakt van Liquid, dit maakt de webpagina's flexibel en makkelijk te onderhouden maakt.

### Ontwerpkeuzes

**Routes & data**
- Homepagina "/" : Er een GET route voor de index zonder gegevens gemaakt en rendert index.liquid.
- Groepsruimte "/class/55001" : Hier bevindt zich de selecteerde class met daarin de match game.
- Prikbord "/notice-board" : Hier kom je op het prikbord pagina waar je een opmerking kan posten.


**UI States & Interacties**
Loading states: Voor de buttons in de Groepsruimte en Prikbord heb ik bewust gekozen voor een loading state. Wanneer gebruikers op een knop klikken, verandert deze direct in een loading animatie. Dit geeft direct visuele feedback dat hun actie is geregistreerd  

**Perceived performance**
De profielfoto's worden dynamisch geladen via een lazy loading techniek, waarbij alleen zichtbare afbeeldingen direct worden ingeladen.

**View transitions**
Om de performance voor de gebruiker te verbeteren heb ik view transitions toegepast.

**Progressive Enhancement**
De match-game is opgebouwd vanuit een solide HTML-formulier basis die via POST-requests werkt. Dit functionaliteit is vervolgens verrijkt met:
- Een subtiele match resultaat na het controleren.
- Visuele feedback met een loading state.

Het notice-board volgt hetzelfde principe met:
- Eerst een traditioneel formulier als fundament.
- Zonder pagina te herladen zie je meteen je commentaar verschijnen.

## Functionaliteit
**Match Game**

Foto-naam matching:
- Members matchen profielfoto’s met de juiste namen.
- Werkt met LearningStone-profielen vanuit de API (automatisch up-to-date).
- Responsief design: optimal werkt op zowel mobiel (tap-to-match) als desktop.

Scorebord:
- Directe feedback na elke match met je resultaten.
  
**Notice Board**

- Gebruikers kunnen berichten plaatsen via een invoerveld.
- Posts verschijnen onmiddellijk in de feed na plaatsen.

## Installatie

1. **Clone de repository:**
   ```bash
   git clone https://github.com/Saif8599/proof-of-concept.git
   ```
2. **Installeer de dependencies:**
   ```bash
   npm install
   ```
3. **Start de server:**
   ```bash
   npm start
   ```
4. **Toegang tot de applicatie:**
   - Open een browser en ga naar: `http://localhost:8000`

## Licentie

This project is licensed under the terms of the [MIT license](./LICENSE).
