// Get references to DOM elements: keyword input, scrape button, and results container
const keywordInput = document.getElementById('keywordInput');
const scrapeButton = document.getElementById('scrapeButton');
const resultsContainer = document.getElementById('results');

// Function to display scraped product results
function displayResults(products) {
  // Clear any existing content in the results container
  resultsContainer.innerHTML = '';

  // Check for empty product list
  if (products.length === 0) {
    resultsContainer.innerHTML = '<p>No products found.</p>';
    return;
  } else if (typeof products === "string") {
    resultsContainer.innerHTML = products;
    return
  };

  // Create an unordered list element to hold the product details
  const resultsList = document.createElement('ul');
  resultsList.classList.add('list-items');

  // Loop through each product in the provided list
  products.forEach(product => {

    // Create a list item element for each product
    const listItem = document.createElement('li');
    listItem.classList.add('item-content');  // Add a class for styling (optional)

    // Create the HTML content for each product item using template literals
    listItem.innerHTML = `
    <img class="item-content__img" src="${product.imageUrl}" srcset="${product.imageSrcset}" alt="${product.title}"/>
    <h3 class="item-content__title">${product.title}</h3>
    <span class="item-content__stars" >Avaliação: ${product.rating}</span>
    `;

    // Append the list item to the unordered list
    resultsList.appendChild(listItem);

  });

  // Append the unordered list containing product details to the results container
  resultsContainer.appendChild(resultsList);
};

// Add event listener to the scrape button
scrapeButton.addEventListener('click', async () => {
  const keyword = keywordInput.value.trim(); // Get the keyword from the input field and trim whitespace

  // Check if keyword is empty
  if (!keyword) {
    alert('Please, insert a keyword');
    return;
  }

  // Show a "Loading" message in the results container while fetching data
  resultsContainer.innerHTML = '<p class="loading">Loading</p>'; // Indicate loading


  try {
    // Make a fetch request to the API endpoint `/api/scrape?keyword=${keyword}`
    const response = await fetch(`/api/scrape?keyword=${keyword}`);

    // Parse the response as text
    let data = await response.text();

    // Check if the response starts with a doctype declaration (indicating potential HTML error page)
    if (!data.startsWith('<!DOCTYPE')) {

      // Parse the JSON data if it's not an error page
      data = JSON.parse(data);
      const products = data.data;  // Extract the "data" property containing product information
      displayResults(products);  // Display the scraped products

    } else {

      // If it's an error page (HTML), display it directly
      displayResults(data);

    };

  } catch (error) {
    console.error(error);  // Log errors to the console
    resultsContainer.innerHTML = '<p>Error getting product.</p>'; // Inform user of error getting products (in Portuguese)
  };
});