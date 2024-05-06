const express = require('express'); // Import Express for web framework
const axios = require('axios'); // Import Axios for making HTTP requests
const { JSDOM } = require('jsdom'); // Import JSDOM for parsing HTML content
const ejs = require('ejs'); // Import EJS for templating (optional)
const path = require('path'); // Import path module for file paths
const app = express(); // Create an Express application

// Configure EJS templating engine (optional)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/src/views'));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory

// Function to scrape product data from HTML content
async function scrapeProductData(data) {

  // Create a JSDOM instance from the HTML string
  const html = data.data;  // Assuming 'data' is an object with 'data' property holding the HTML
  const document = new JSDOM(html).window.document;

  // Extract product details from the search results
  const products = [];
  const productElements = document.querySelectorAll('.puisg-row'); // Select elements containing product information (adjust selector as needed)

  // Loop through each product element
  for (const productElement of productElements) {
    let title = false;
    let rating = false;
    let imageUrl = false;
    let imageSrcset = false;

    // Extract title using the specified CSS selector (adjust selector as needed)
    const titleElement = productElement.querySelector('.a-size-small.a-color-base.a-text-normal');
    if (titleElement) {
      title = titleElement.textContent.trim();
    }

    // Extract rating using the specified CSS selector (adjust selector as needed)
    const ratingElement = productElement.querySelector('.a-section.a-spacing-none.a-spacing-top-micro > .a-row.a-size-mini');
    if (ratingElement) {
      rating = ratingElement.parentElement.innerHTML; // Extract entire rating HTML for potential further processing
    }

    // Extract image URL using the specified CSS selector (adjust selector as needed)
    const imageElement = productElement.querySelector('.s-image');
    if (imageElement) {
      imageUrl = imageElement.src;
    }

    // Extract image srcset using the specified CSS selector (adjust selector as needed)
    if (imageElement) {
      imageSrcset = imageElement.srcset;
    }

    // Check if all required data is found
    if (title && rating && imageUrl && imageSrcset) {
      products.push({ // Add product details to the products array
        title,
        rating,
        imageUrl,
        imageSrcset
      });
    } else {
      // If any data is missing, stop iterating and return false (optional)
      result = false;
      break;
    }
  }

  // Return the scraped products or a flag indicating no products found
  if (products.length > 0) {
    return products;
  } else {
    return false; // Or return an empty array or a specific message
  }
};

// Route handler for scraping products (API endpoint)
app.get('/api/scrape', (req, res) => {
  const keyword = req.query.keyword; // Get the keyword from the query string

  // Make a GET request to Amazon search using Axios
  axios.get(`https://www.amazon.com.br/s?k=${keyword}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36', // Set a User-Agent header (consider respecting Amazon's robots.txt)
    }
  })
    .then(response => {
      // Handle successful response from the Amazon search

      scrapeProductData(response).then(resp => {
        const data = resp;
        if (!data || data.length === 0) { // Check if products were found
          res.render('not-found'); // Render a "not found" page (optional, using EJS)
        } else {
          res.json({ data }); // Send the scraped product data as JSON response
        }
      })
    })
    .catch(error => {
      // Handle errors during the scraping process
      console.error(error.data); // Log the error details
      res.status(500).send('Error scraping products'); // Send a 500 status code and error message
    });
});

// Route handler for the home page (optional, using EJS)
app.get('/', (req, res) => {
  res.render('home');
});

// Start the server and listen on port 3000
app.listen(3000, () => {
  console.log('Server started on port 3000');
});