const express = require('express');
const router = express.Router()
const User = require("../models/User");
const bcrypt = require("bcryptjs");

router.get("/admin/users", function(req,res) {
    User.findAll().then(users => {
        res.render("user/index", {users: users})
    })
});

router.get("/admin/users/create", (req,res) => {
    res.render("user/create")
})

router.post("/users/create", function(req,res) {
    var email = req.body.email;
    var senha = req.body.senha;

    User.findOne({ where: {email: email }}).then(user => {
        if(user == undefined) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(senha, salt)

        User.create({
            email: email,
            senha: hash
        }).then(() => {
            res.redirect("/admin/disciplina")
        }).catch((err) => {
            res.redirect("/")
        })
        } else {
            res.redirect("/")
        }
    })
})

router.get("/admin/login", (req,res) => {
    res.render("user/login");
})

router.post("/authenticate", (req, res) => {
    var email = req.body.email;
    var senha = req.body.senha;

    User.findOne({where: {email: email}}).then(user => {
        if(user != undefined) {
        // Validar senha
        var correct = bcrypt.compareSync(senha, user.senha)

        if(correct) {
            req.session.user = {
                id: user.id,
                email: user.email
            }
            res.redirect("/admin/disciplina")
        } else {
            res.redirect("/admin/login")
        }

        } else {
            res.redirect("/admin/login")
        }
    })
});


router.get("/logout", (req,res) => {
    req.session.user = undefined;
    res.redirect("/")
})

module.exports = router