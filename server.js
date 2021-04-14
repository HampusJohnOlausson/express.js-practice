const cookieSession = require('cookie-session');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.post('/api/register', (req, res) => {});
app.post("/api/login", (req, res) => {});
app.get("/api/users", (req, res) => {});
app.delete("/api/logout", (req, res) => {});




app.listen(port, () => {
    console.log(`Server is running on port http://localHost:${port}`)
})





