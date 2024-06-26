require('dotenv').config();
const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');

// Swagger imports
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_BASE_URL = 'https://horoscopes.astro-seek.com/';

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Birth Chart API Documentation',
      version: '1.0.0',
      description: 'API for generating birth charts',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [{
      url: `http://localhost:${PORT}`,
    }],
  },
  apis: ['./index.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Root route handler
app.get('/', (req, res) => {
  res.send('Welcome to the Birth Chart API!');
});

/**
 * @swagger
 * /birth-chart:
 *   post:
 *     summary: Create a birth chart.
 *     description: Accepts date, time, and city to create a personalized birth chart.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 description: Date of birth in YYYY-MM-DD format.
 *               time:
 *                 type: string
 *                 description: Time of birth in HH:MM format.
 *               city:
 *                 type: string
 *                 description: City of birth.
 *     responses:
 *       200:
 *         description: Birth chart created successfully.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Failed to fetch birth chart information.
 */
app.post('/birth-chart', async (req, res) => {
  const {date, time, city} = req.body;

  if (!date || !time || !city) {
    return res.status(400).send('Missing required fields: date, time, city');
  }

  console.log('Received request:', {date, time, city});
  const [year, month, day] = date.split('-');
  const [hours, minutes] = time.split(':');

  try {
    const scrapeResult = await scrapeBirthChart(day, month, year, hours, minutes, city);
    res.json({success: true, data: scrapeResult});
  } catch (error) {
    console.error('Error handling birth chart request:', error);
    res.status(500).send('Failed to fetch birth chart information');
  }
});

async function scrapeBirthChart(day, month, year, hours, minutes, city) {
  let browser = null;
  try {
    console.log('Starting scrapeBirthChart function');
    browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto(`${API_BASE_URL}birth-chart-horoscope-online`, {waitUntil: 'networkidle0'});

    console.log('Filling in the form');
    await page.select('select[name="narozeni_den"]', day);
    await page.select('select[name="narozeni_mesic"]', month);
    await page.select('#year_of_birth_select', year);
    await page.select('#id_time_entry > div:nth-child(5) > select:nth-child(1)', hours);
    await page.select('#id_time_entry > div:nth-child(5) > select:nth-child(2)', minutes);
    await page.type('#city', city);

    console.log('Submitting the form');
    const [response] = await Promise.all([
      page.waitForNavigation({waitUntil: 'networkidle0'}),
      page.click('input[type="submit"]'),
    ]);

    console.log('Form submitted and page navigated to results');


    const result = await page.evaluate(() => {
      const zodiacSignElement = document.querySelector('#vypocty_toggle > div:nth-child(5) > div:nth-child(4) > div.dum-znameni');
      const planetPositionsElement = document.querySelector('#vypocty_toggle > div:nth-child(5)');
      const housePlacementsElement1 = document.querySelector('#vypocty_toggle > div.cl.vypocet-planet');
      const housePlacementsElement2 = document.querySelector('#vypocty_toggle > div:nth-child(10)');

      const data = {
        zodiacSign: zodiacSignElement ? zodiacSignElement.innerText : '',
        //ascendantSign: '',
        planetPositions: planetPositionsElement ? planetPositionsElement.innerText : '',
        housePlacements: [
          housePlacementsElement1 ? housePlacementsElement1.innerText : '',
          housePlacementsElement2 ? housePlacementsElement2.innerText : ''
        ]
      };

      return data;
    });

    console.log('Data extracted:', JSON.stringify(result));


    fs.writeFileSync('birth-chart-data.json', JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    console.error('An error occurred during scraping:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
