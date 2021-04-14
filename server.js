const express = require('express');
const cookieSession = require("cookie-session");
const bcrypt = require('bcrypt')
const app = express();
const port = process.env.PORT || 5000;

const users = [];

//Make sure body is populated with josn data
app.use(express.json());

//setup our secure and tamper
app.use(cookieSession({
    name: 'session',
    secret: 'aVeryS3cr3tK3y',
    secure: false,
    maxAge: 1000 * 10,
    httpOnly: true
}));


app.post('/api/register', async (req, res) => {
    const { name, password} = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword)
    const user = {
        name, 
        password: hashedPassword
    }
    users.push(user);
    res.status(201).json();
});

app.post("/api/login", async (req, res) => {
    const {name, password} = req.body;
    const user = users.find(u => u.name === name);

    //Check if username or password is correct
    if(!user || !await bcrypt.compare(password, user.password)) {
        res.status(401).json('incorrect passwors or username');
    }

    //Create session
    req.session.username = user.name;
    
    //send response
    res.status(204).json(null);
});

app.get("/api/users", (req, res) => {
    res.json(users);
});

app.delete("/api/logout", (req, res) => {

});




app.listen(port, () => {
    console.log(`Server is running on port http://localHost:${port}`)
})





