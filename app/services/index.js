const userServices = require(`./userServices`);
const tokenServices = require(`./tokenServices`);
const bookServices = require(`./bookServices`);
const friendServices = require(`./friendServices`);

module.exports = {
    ...userServices,
    ...tokenServices,
    ...bookServices,
    ...friendServices,
};
