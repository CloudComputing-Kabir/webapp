//NPM imports:
const express = require('express');
const bodyParser = require('body-parser');
// const db = require('./Util/databaseSequelize');
const sequelize = require('./Util/databaseSequelize');
const product = require('./Models/product');
const user = require('./Models/user');
//NPM imports:

//Internal File Imports:
const userRoutes = require('./Routes/userRoutes');
//Internal File Imports:

const app = express();

app.use(bodyParser.json());

app.get('/healthy', (req, res, next) => {
    res.send('Healthy Connection from Health checkpoint');
});

app.get('/healthz', (req, res, next) => {
    res.send("Healthy Connection from Healthz checkpoint");
});

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(userRoutes);

sequelize.sync({ force: false }).then((req) => {
    app.listen(2000, () => {
        console.log('Server running at port 2000');
    });
})
    .catch((err) => console.log(err));




