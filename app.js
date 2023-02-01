//NPM imports:
const express = require('express');
const bodyParser = require('body-parser');
//NPM imports:

//Internal File Imports:
const userRoutes = require('./Routes/userRoutes');
const db = require('./Util/database');
//Internal File Imports:


const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(userRoutes);

app.listen(2000, () => {
    console.log('Server running at port 2000');
});