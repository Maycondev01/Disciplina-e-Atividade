const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require('express-session')
const connection = require("./database/database");

// Models
const Disciplina = require("./models/Disciplina")
const Atividade = require("./models/Atividade")
const User = require("./models/User")

// Controllers
const DisciplinaController = require("./controllers/DisciplinaController")
const AtividadeController = require("./controllers/AtividadeController");
const UserController = require("./controllers/UserController");



//DataBase
connection
.authenticate().then(() => {
    console.log("Conectado ao Banco de Dados")
}).catch((e) => {
    console.log(e)
})

// View Engine
app.set("view engine", "ejs")

// Session
app.use(session({
    secret: 'qwruqwuasfaskfa', cookie: {maxAge: 3000000}
}))

// Analisador de Corpo 
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

// Arquivos Estáticos
app.use(express.static("public"));

app.get("/leitura", function(req,res) {
    res.json({
        email: req.session.email,
        user: req.session.user,
    })
})


app.get("/", function(req,res) {
    res.render("index")
})

app.use("/", DisciplinaController);
app.use("/", AtividadeController);
app.use("/", UserController)

app.listen(3000, function(err) {
    if(err) {
        console.log(err)
    } else {
        console.log("Servidor Online!")
    }
})