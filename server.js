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
    maxAge: 1000 * 60,
    httpOnly: true
}));


app.post('/api/register', async (req, res) => {
    const { name, password} = req.body;

    //check if ths user already exists
    const existingUser = users.find(u => u.name === name);
    if(existingUser) {
        return res.status(400).json('username already exists');
    }

    //hash the password and save the user
    const hashedPassword = await bcrypt.hash(password, 10);
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
        return 
    }

    //Create session
    req.session.username = user.name;
    req.session.role = 'admin';
    
    //send response
    res.status(204).json(null);
});

app.get("/api/users", secureWithRole('admin'),  (req, res) => {
    res.json(users);
    
});

app.delete("/api/logout", (req, res) => {

    if(!req.session.username) {
         return res.status(400).json("you are already logged out")  
    }
    req.session = null;
    res.status(200).json('User is logged out');
});


//Helper middleware for secure endpoints
function secure(req, res, next) {
    if(req.session.username){
        next();
    } else {
        res.status(401).json('you must login first');
    }
}


function secureWithRole(role){
    return [secure, (req, res, next) => {
         if(req.session.role === role) {
             next();
         } else {
             res.status(403).json('You dont have the specific rights to access this route');
         }
    }]
}



app.listen(port, () => {
    console.log(`Server is running on port http://localHost:${port}`)
})





