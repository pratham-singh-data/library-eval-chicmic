require(`dotenv`).config();
const express = require(`express`);
const { expressStartup, } = require('./app/startup/expressStartup');
const { mongoConnect, } = require('./app/startup/mongoStartup');
const { PORT, } = require('./config');

const app = express();

/** Performs all startup operations */
async function startup() {
    await mongoConnect();
    expressStartup(app);
}

startup().then(() => {
    app.listen(PORT, () => {
        console.log(`Server started on port ${PORT}`);
    });
});
