const express = require("express");
const responseTime = require("response-time");
const axios = require("axios");
const redis = require("redis");

import React from "react";
import { renderToString } from "react-dom/server";
import App from "./app";
import template from "./template";

const PORT = process.env.port || 3000;

const app = express();
const client = redis.createClient();

// Print redis errors to the console
client.on("error", err => {
  console.log("Error " + err);
});

// use response-time as a middleware
app.use(responseTime());
app.use('/assets', express.static('assets'));

// create an api/search route
app.get("/search", (req, res) => {
  if (!req.query.query) {
    const title = "";
    const initialState = { categoriesAmount: 0, imagesAmount: 0, title: "", pageId: "" };

    const appString = renderToString(<App {...initialState}/>);
  
    return res.send(template({
      body: appString,
      title: `Result for ${title}`,
      initialState: JSON.stringify(initialState)
    }));
  }

  const query = req.query.query.trim();

  callWiki(query, (result) => {
    let initialState = {};
    let title = ""

    try {
      const categoriesAmount = result.parse.categories.length || 0;
      const imagesAmount = result.parse.images.length || 0;
      title = result.parse.title || "";
      const pageId = result.parse.pageid || "";
  
      initialState = { categoriesAmount, imagesAmount, title, pageId };
    } catch (err) {
      initialState = { categoriesAmount: 0, imagesAmount: 0, title: "", pageId: "" };
    }
    
    // res.status(200).json({status: "success", categoriesAmount, imagesAmount, title, pageId});

    const appString = renderToString(<App {...initialState}/>);
  
    res.send(template({
      body: appString,
      title: `Result for ${title}`,
      initialState: JSON.stringify(initialState)
    }));
  })
});

app.get('/', (req, res) => {
  return res.render('404', { url: req.url });
});


app.listen(PORT, () => {
  console.log("Server listening on port: ", PORT);
});


function callWiki(query, callback) {
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=parse&format=json&section=0&page=${query}`;

  // Try fetching the result from Redis first in case we have it cached
  return client.get(`wikipedia:${query}`, (err, result) => {
    if (result) return callback(JSON.parse(result));

    // Key does not exist in Redis store
    // Fetch directly from Wikipedia API
    return axios.get(searchUrl)
      .then(response => {
        const responseJSON = response.data;
        
        client.setex(
          `wikipedia:${query}`,
          3600,
          JSON.stringify({ source: "Redis Cache", ...responseJSON })
        );

        return callback({ source: "Wikipedia API", ...responseJSON });
      })
      .catch(err => {
        return callback(err);
      });
  });
}