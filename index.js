const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fs = require("fs");
const routes = require("./routes/index.route");
const googleapi = require("./config/googlesheets.config");
const session = require("express-session");

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 's3Cur3',
    name: 'sessionId'
}));

// Error middleware
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));

app.get("/", isAuthenticated, (req, res) => {
    res.render("fileupload");
});
 
app.get("/login", (req, res) => { 
    res.render("login", { authUrl: googleapi.getAuthUrl() });
});

app.get("/oauthcallback", async (req, res) => {
    const code = req.query.code;
    await new Promise(res => googleapi.setCredentials(code, () => res()));
    req.session.isAuthenticated = true;
    res.redirect("/");
});

app.use("/", isAuthenticated, routes);

function isAuthenticated(req, res, next) {
    if (req.session.isAuthenticated) {
        return next();
    }
    res.redirect("/login");
}

// app.use("/api", routes);
const port = process.env.PORT || 4040;
app.listen(port, () => console.log("Express listening on port " + port));
module.exports = app;
