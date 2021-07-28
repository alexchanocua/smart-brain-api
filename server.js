// import express pacakage
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
// controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL, // heroku PSQL
      ssl: {
        rejectUnauthorized: false
      }
    }
  });

db.select('*').from('users').then(data => {
    console.log(data);
});

//create the app
const app = express();





// middle-ware for parsing JSON data from front-end
app.use(express.json());
app.use(cors());

/* 
================================
ROUTES
================================
w/ (dependency injection: passing dependencies to the function)

*/
// ROOT 
app.get('/', (req, res) => {
    res.send("it's working");
});

//SIGN-IN 
app.post('/signin', signin.handleSignin( db, bcrypt) );

// RESIGSTER 
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });


// PROFILE
app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db, bcrypt)} );

// IMAGE 
app.put('/image', image.handleImage(db));
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)});
app.listen(process.env.PORT || 3000, () => {
    console.log('app is running on port 3000...');
});



/*
 /signin --> POST = sucess/fail
 /register --> POST = user
 /profile/:userId --> GET = user
 /image --> PUT = user
*/