const express = require("express");
const router = express.Router();
const Disciplina = require("../models/Disciplina")
const slugfy = require("slugify")
const adminAuth = require("../middlewares/adminAuth")


router.get("/admin/disciplina", adminAuth, function(req,res) {
    Disciplina.findAll().then(disciplinas => {
        res.render("disciplina/index", {disciplinas: disciplinas})
    })
})

router.get("/admin/disciplina/new", adminAuth, function(req,res) {
    res.render("disciplina/new")
})

router.post("/disciplina/save", adminAuth, function(req,res) {
    var titulo = req.body.titulo;
    if(titulo != undefined) {
        Disciplina.create({
            titulo: titulo,
            slug: slugfy(titulo)
        }).then(() => {
            res.redirect("/admin/disciplina")
        }).catch(e => {
            res.redirect("/")
        })
    }
})

router.post("/disciplina/delete", adminAuth, function(req,res) {
    var id = req.body.id
    if(id != undefined) {
        Disciplina.destroy({
            where: {id:id}
        }).then(() => {
            res.redirect("/admin/disciplina")
        }).catch(e => {
            res.redirect("/")
        })
    }
})

router.get("/disciplina/edit/:id", adminAuth, function(req,res) {
    var id = req.params.id;
    if(isNaN(id)) {
        res.redirect("/admin/disciplina")
    }
    Disciplina.findByPk(id).then(disciplina => {
        if(disciplina != undefined) {
            res.render("disciplina/edit", {disciplina: disciplina});
        } else {
            res.redirect("/admin/disciplina");
        }
    }).catch(e => {
        res.redirect("/admin/disciplina")
    })
})

router.post("/disciplina/update", adminAuth, function(req,res) {
    var id = req.body.id;
    var titulo = req.body.titulo;

    Disciplina.update({
        titulo: titulo,
        slug: slugfy(titulo)
    }, {
        where: {id:id}
    }).then(() => {
        res.redirect("/admin/disciplina")
    }).catch((e) => {
        res.redirect("/")
    })
    
})


module.exports = router;