const functions = require("firebase-functions");
// // // Create and Deploy Your First Cloud Functions
// // // https://firebase.google.com/docs/functions/write-firebase-functions
// //

require('dotenv').config()
const express = require( 'express' )
const app  = express()
app.use(express.json()); //Used to parse JSON bodies
// const cors = require('cors');
// Automatically allow cross-origin requests
// app.use(cors());

// Enable CORS for all methods
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "*")
    next()
  });


const axios = require('axios').default;

//create an instance of an axios client
const axiosUnsplash = axios.create({
  baseURL: `${process.env.UNSPLASH_BASE_URL}`,   //create an instance of an axios client
  headers: {
    Authorization:
      `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
  }
});


app.get('/:query/:page', async(req, res) => {
    const query = req.params.query
    const page = req.params.page
    console.log(query)
    console.log(page)
    
    const response = await axiosUnsplash.get(`search/photos`, {
        params: {
            query: query,
            page: page,
            per_page: 50,
            order_by: 'popular'
        }
    });
    console.dir(response)

    // Check if API limit has been reached: 50 request/hr
    if (response.data == 'Rate Limit Exceeded') {
        console.log('Error: API rate limit exceeded');
        res.json({error: 'Rate limit exceeded'})
    }

    const urlList = [];
    response.data.results.forEach((item,index) => {
        if (item.urls.regular) {
            urlList.push({
                id: index,
                src: item.urls.regular
            })
        } else {
            console.log('Error with returned api data')
            res.json({error: 'Rate limit exceeded'})
        }
    })
    // console.log(urlList)
    
  res.json({ urls: urlList})
});



// Expose Express API as a single Cloud Function:
exports.widgets = functions.https.onRequest(app);