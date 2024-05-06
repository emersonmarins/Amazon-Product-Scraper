
# Product Scraper with Node.js

This repository includes a simple product scraper built with Node.js using Express, Axios, and JSDOM for the back-end, and HTML, CSS, and Vanilla JavaScript for the front-end. It fetches product data (title, rating, image) from Amazon based on a user-provided keyword.

## Setup Instructions

### Install Dependencies:
1. Clone this repository and navigate to the project directory.
2. Run the following command in your terminal to install the required dependencies:

#### bash
```
npm install
```
### Start the server by running:
#### Bash
```
npm start
```
This will start the server on port 3000 by default.

  
# Usage

#### 1. Frontend:  
A basic frontend is included using EJS templates. You can access the scraper
functionality by visiting http://localhost:3000/ in your web browser.
  
#### 2. API Endpoint:  
The scraper functionality is still exposed through an API endpoint at 
http://localhost:3000/api/scrape. You can make a GET request to this 
endpoint with a query parameter named keyword containing the product you 
want to scrape. The server will respond with JSON data containing the scraped 
product information or an error message if no products are found.
  
  
#### Example Usage (using cURL):
#### Bash
```
curl http://localhost:3000/api/scrape?keyword=headphones
```
This will return JSON data containing the scraped product details for headphones (if found).
  
---  
#### Note:
- This scraper is for educational purposes only. Respect Amazon's robots.txt 
  guidelines and terms of service when using it.
- The scraping logic might need adjustments as Amazon's website structure changes.

---                                                                      
#### Contributing
Feel free to fork this repository and contribute improvements!
  
---
#### License
This project is licensed under the MIT License. See the LICENSE file for details.
