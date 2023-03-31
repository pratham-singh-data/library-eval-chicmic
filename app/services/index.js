const userServices = require(`./userServices`);
const tokenServices = require(`./tokenServices`);

module.exports = {
    ...userServices,
    ...tokenServices,
};
