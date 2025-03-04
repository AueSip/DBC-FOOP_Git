const express = require('express');

const passport = require('passport');

const session = require('express-session');

const LocalStrategy = require('passport-local').Strategy;

const bodyParser = require('body-parser');

const mysql = require('mysql');

const bcrypt = require('bcrypt');


const app = express();

const saltRounds = 10;


// MySQL Database Connection

const db = mysql.createConnection({

    host: '127.0.0.1',

    port:'3306',

    user: 'root',

    password: 'root',

    database: 'portfoliosite'

});


db.connect(err => {

    if (err) throw err;

    console.log('Connected to MySQL database');

});


// Middleware

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));

app.use(passport.initialize());

app.use(passport.session());


// Passport config

passport.use('local-login', new LocalStrategy((username, password, done) => {

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {

        if (err) return done(err);

        if (results.length === 0) return done(null, false, { message: 'Invalid credentials' });

        

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {

            if (err) return done(err);

            if (!isMatch) return done(null, false, { message: 'Invalid credentials' });

            return done(null, user);

        });

    });

}));


passport.use('local-signup', new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {

        if (err) return done(err);

        if (results.length > 0) return done(null, false, { message: 'Username already taken' });

        

        bcrypt.hash(password, saltRounds, (err, hash) => {

            if (err) return done(err);

            

            const newUser = { username, password: hash, email: req.body.email };

            db.query('INSERT INTO users SET ?', newUser, (err, result) => {

                if (err) return done(err);

                newUser.Id = result.insertId;

                return done(null, newUser);

            });

        });

    });

}));


passport.serializeUser((user, done) => done(null, user.Id));

passport.deserializeUser((Id, done) => {

    db.query('SELECT * FROM users WHERE Id = ?', [Id], (err, results) => {

        if (err) return done(err);

        done(null, results[0]);

    });

});


// Routes

app.get('/', (req, res) => res.send(req.isAuthenticated() ? 'Logged in' : 'Logged out'));

app.get('/login', (req, res) => res.send('<form method="post"><input name="username"><input name="password" type="password"><button type="submit">Login</button></form>'));

app.post('/login', passport.authenticate('local-login', { successRedirect: '/', failureRedirect: '/login' }));

app.get('/register', (req, res) => res.send('<form method="post"><input name="username"><input name="password" type="password"><input name="email"><button type="submit">Register</button></form>'));

app.post('/register', passport.authenticate('local-signup', { successRedirect: '/', failureRedirect: '/register' }));

app.get('/logout', (req, res) => {

    req.logout(err => {

        if (err) return next(err);

        res.redirect('/');

    });

});


// Start server

app.listen(3000, () => console.log('Server running on port 3000'));