const userServices = require(`./userServices`);
const tokenServices = require(`./tokenServices`);
const bookServices = require(`./bookServices`);

module.exports = {
    ...userServices,
    ...tokenServices,
    ...bookServices,
};
