# Birth Chart API

This project is a Node.js application that serves an API for fetching birth chart information based on user input. It
uses Express.js for handling HTTP requests and Puppeteer for web scraping from a specified astrology website. The
application also includes Swagger for interactive API documentation.

## Getting Started

These instructions will get your copy of the project up and running on your local machine for development and testing
purposes.

### Prerequisites

- Node.js (v14 or later recommended)
- npm (Node Package Manager)

### Installing

1. **Clone the Repository**
   ```sh
   git clone https://github.com/YuqiGuo105/birth_chart.git
   cd birth_chart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
    - Create a .env file in the project root and add the following:
   ```bash
   PORT='3000'
   ```

4. **Running the Application**
   To run the project, use the following command:
   ```bash
   node index.js
   ```

## Usage
### Accessing the API

The API currently supports a POST request to fetch birth chart information. You must provide the date, time, and city
for which you wish to fetch the birth chart information.

Endpoint: /birth-chart

Method: POST

Body:

   ```bash
   {
      "date": "YYYY-MM-DD",
      "time": "HH:MM",
      "city": "City Name"
  }
   ```

### Swagger API Documentation

To view and interact with the API documentation, navigate to http://localhost:3000/api-docs after starting the server.

## Built With

- [Node.js](https://nodejs.org/) - The JavaScript runtime used
- [Express.js](https://expressjs.com/) - Web framework for Node.js
- [Puppeteer](https://pptr.dev/) - For web scraping functionalities
- [Swagger UI Express](https://www.npmjs.com/package/swagger-ui-express) and [Swagger JSDoc](https://www.npmjs.com/package/swagger-jsdoc) - For documenting the API

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

