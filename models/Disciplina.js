const Sequelize = require("sequelize");
const connection = require("../database/database")

const Disciplina = connection.define("disciplinas", {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    }, slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
})



module.exports = Disciplina;