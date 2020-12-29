const Sequelize = require("sequelize");
const connection = new Sequelize("questionguide", "root", "root", {
    host: "localhost",
    dialect: "mysql"
});

module.exports = connection;