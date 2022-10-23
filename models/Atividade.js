const Sequelize = require("sequelize");
const connection = require("../database/database")
const Disciplina = require("./Disciplina")

const Atividade = connection.define("atividades", {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    texto: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

Disciplina.hasMany(Atividade)
Atividade.belongsTo(Disciplina)


module.exports = Atividade

