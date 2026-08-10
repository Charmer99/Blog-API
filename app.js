const express = require("express")
const jwt = require("jsonwebtoken")

const app = express();


// PUBLIC ROUTE
app.get("/api", (req, res) => {
    res.json({
        message: "Welcome to the api"
    })
});


// PROTECTED ROUTE
app.post("/api/posts", verifyToken, (req, res) => {

    jwt.verify(req.token, 'secretkey', (err, authData) => {

        if (err) {
            return res.sendStatus(403);
        }

        res.json({
            message: "Posts created",
            authData: authData
        });

    });

});


// LOGIN ROUTE
app.get("/api/login", (req, res) => {

    // mock user
    const user = {
        id: 1,
        username: 'brad',
        email: 'brad@gmail.com'
    }

    jwt.sign({ user }, 'secretkey', { expiresIn: '30s' }, (err, token) => {

        res.json({
            token
        })

    })

});


// VERIFY TOKEN MIDDLEWARE
function verifyToken(req, res, next) {

    // Get the Authorization header
    const bearerHeader = req.headers['authorization'];

    // Check if bearerHeader is undefined
    if (typeof bearerHeader !== 'undefined') {

        // Split the header at the space
        const bearer = bearerHeader.split(" ");

        // Get the token from the array
        const bearerToken = bearer[1];

        // Put the token on req
        req.token = bearerToken;

        // Continue to the next function
        next();

    } else {

        // No Authorization header
        res.sendStatus(403);

    }

}


app.listen(5000, () => {
    console.log("Server running on port 5000");
});