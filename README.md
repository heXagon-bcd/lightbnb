# LightBnB
A simple single page airbnb clone that uses server side javascript to display the information from queries to web pages via SQL queries

## Install Instructions
1. Go to the `LightBnB_WebApp-master` folder
2. Install dependencies using the `npm install` command
3. Start server in terminal with `npm start local` command.  This app will be served on http://localhost:3000/
4. Go to http://localhost:3000/ in your browser.
5. Open vscode and inject the lighbnb data by using "\i ../seeds/02_seeds.sql" in your psql environment

## Site Features

The site has the ability to query our db for specific property based on fields in our psql server

![Search Query](https://github.com/heXagon-bcd/lightbnb/blob/main/LightBnB_WebApp-master/images/Search%20Query.png)

It also has the ability to add property to our site by inserting rows into our psql server
![Add Property Query](https://github.com/heXagon-bcd/lightbnb/blob/main/LightBnB_WebApp-master/images/Create%20Query.png)

## Project Structure

```
.
├── db
│   ├── json
│   └── database.js
├── public
│   ├── javascript
│   │   ├── components 
│   │   │   ├── header.js
│   │   │   ├── login_form.js
│   │   │   ├── new_property_form.js
│   │   │   ├── property_listing.js
│   │   │   ├── property_listings.js
│   │   │   ├── search_form.js
│   │   │   └── signup_form.js
│   │   ├── libraries
│   │   ├── index.js
│   │   ├── network.js
│   │   └── views_manager.js
│   ├── styles
│   │   ├── main.css
│   │   └── main.css.map
│   └── index.html
├── routes
│   ├── apiRoutes.js
│   └── userRoutes.js
├── styles  
│   ├── _forms.scss
│   ├── _header.scss
│   ├── _property-listings.scss
│   └── main.scss
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── server.js
```

* `db` contains all the database interaction code.
  * `json` is a directory that contains a bunch of dummy data in `.json` files.
  * `database.js` is responsible for all queries to the database. It doesn't currently connect to any database, all it does is return data from `.json` files.
* `public` contains all of the HTML, CSS, and client side JavaScript. 
  * `index.html` is the entry point to the application. It's the only html page because this is a single page application.
  * `javascript` contains all of the client side javascript files.
    * `index.js` starts up the application by rendering the listings.
    * `network.js` manages all ajax requests to the server.
    * `views_manager.js` manages which components appear on screen.
    * `components` contains all of the individual html components. They are all created using jQuery.
* `routes` contains the router files which are responsible for any HTTP requests to `/users/something` or `/api/something`. 
* `styles` contains all of the sass files. 
* `server.js` is the entry point to the application. This connects the routes to the database.
