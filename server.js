const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwtSecret = "secretPassword";
const jwt = require('jsonwebtoken');
const pool = require('./db.js');
const app = express();
const path = require('path');
var nodemailer = require('nodemailer');
const PORT = process.env.PORT || 5000;

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'linxtechco@gmail.com',
      pass: 'Jakob9797!'
    }
});

app.use(express.json());
app.use(cors());

app.use(express.static('./client/build'));

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, 'client/build')));
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
});

//Get folders for user with id
app.get('/folders/:id', async (req, res) => {
    const query = `SELECT * FROM folders WHERE u_id = ${req.params.id};`;
    const result = await pool.query(query);
    res.json(result.rows);
});

//Get Links for folder of id
app.get('/links/:id', async (req, res) => {
    const query = `SELECT * FROM links WHERE f_id = ${req.params.id};`;
    const result = await pool.query(query);
    res.json(result.rows);
});

//Add Folder
app.post('/', async (req, res) => {
    const {name, description, u_id} = req.body;
    const query = `INSERT INTO folders (name, description, u_id) values ('${name}', '${description}', ${u_id});`;
    const result = await pool.query(query);
    res.json(result.rows);
});

//Add Link
app.post('/folders/:id', async (req, res) => {
    const {name, url, description} = req.body;
    const query = `INSERT INTO links (name, url, description, f_id) VALUES ('${name}', '${url}', '${description}', ${req.params.id});`;
    const result = await pool.query(query);
    res.json(result.rows);
});

//Delete Folders
app.delete('/folders/:id', async (req, res) => {
    //Delete Links
    const query2 = `DELETE FROM links WHERE f_id = ${req.params.id};`;
    await pool.query(query2);

    //Delete Folder
    const query1 = `DELETE FROM folders WHERE f_id = ${req.params.id};`;
    await pool.query(query1);
});

//Signup
app.post('/signup', async (req, res) => {
    const {first_name, last_name, email, password} = req.body;

    //Check if user already exists
    const query = `SELECT * FROM users WHERE email = '${email}';`;
    const user = await pool.query(query);
    
    //If user already exists with that email
    if (user.rowCount > 0) {
        res.status(401).send({ message: "This username is not available." });
    } else {
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            //Insert user into database
            const query = `INSERT INTO users (first_name, last_name, email, password) values ('${first_name}', '${last_name}', '${email}', '${hash}');`;
            const result = await pool.query(query);
            if (result.rows) {
                res.json({ message: "Registration was successful!" });
                //Sends welcome email to user
                var mailOptions = {
                    from: 'linxtechco@gmail.com',
                    to: email,
                    subject: 'Welcome to Linx',
                    html: `<p>Hey ${first_name},<br><br>Thank you for joining the Linx family! Your life might be a mess, but your linx just got a whole lot more organized. Don't foget to linx up with us on social media.<br><br><a href="https://linxtech.herokuapp.com">Linx</a></p>`,
                };
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            } else {
                res.status(401).json({ message: "Registration failed." });
            }
        });
    }
});

//Signin
app.post('/signin', async (req, res) => {
    const {email, password} = req.body;

    //Get hashPassword from database
    const query = `SELECT password FROM users WHERE email = '${email}';`;
    const result = await pool.query(query);
    const hashPassword = result ? result.rows[0].password : null;

    if (hashPassword) {
        bcrypt.compare(password, hashPassword, async function(err, result) {
            if (result) {
                //Get user info and return it with a jwt
                const query2 = `SELECT * FROM users WHERE email = '${email}';`;
                const result2 = await pool.query(query2);
                const userInfo = result2.rows[0];
                const { u_id, first_name, last_name} = userInfo;
                const token = jwt.sign({ u_id, first_name, last_name, email}, jwtSecret);
                res.json( {user: {u_id, first_name, last_name, email}, token: token });
            } else {
                res.status(401).json({ message: "Wrong password" });
            }
        });
    } else {
        res.status(401).json({ message: "No user exists with that email." })
    }
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build/index.html"));
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
});