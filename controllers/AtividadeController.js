const express = require("express");
const router = express.Router();
const Disciplina = require("../models/Disciplina");
const Atividade = require("../models/Atividade");
const slugfy = require("slugify");
const adminAuth = require("../middlewares/adminAuth")


router.get("/admin/atividade", adminAuth, function (req, res) { // Tela Atividade
    Atividade.findAll({
        include: [{ model: Disciplina }]
    }).then(atividades => {
        res.render("atividade/index", { atividades: atividades })
    })
})
router.get("/admin/atividade/new", adminAuth, function (req, res) { // Tela de nova atividade 
    Disciplina.findAll().then(disciplinas => {
        res.render("atividade/new", { disciplinas: disciplinas })
    })
})

router.post("/atividade/save", function (req, res) { // Criar uma Atividade 
    var titulo = req.body.titulo;
    var texto = req.body.texto;
    var disciplina = req.body.disciplina

    Atividade.create({
        titulo: titulo,
        slug: slugfy(titulo),
        texto: texto,
        disciplinaId: disciplina
    }).then(() => {
        res.redirect("/admin/atividade")
    }).catch((e) => {
        res.redirect("/")
    })
})

router.post("/atividade/delete", adminAuth, function (req, res) { // Deletar Atividade
    var id = req.body.id;
    if (id != undefined) {
        Atividade.destroy({ where: { id: id } }).then(() => {
            res.redirect('/admin/atividade')
        })
    } else {
        res.redirect("/")
    }
})

router.get("/admin/atividade/edit/:id", adminAuth, function(req,res) { // Tela Edição
    var id = req.params.id
    if(isNaN(id)) {
        res.redirect("/admin/atividade");
    }
    Atividade.findByPk(id).then(atividades => {
        if(atividades != undefined) {
            Disciplina.findAll().then(disciplinas => {
                res.render("atividade/edit", {atividades: atividades, disciplinas: disciplinas})
            })
        } else {
            res.redirect("/admin/atividade")
        }
    }).catch(err => {
        res.redirect("/admin/atividade")
    })
})

router.post("/atividade/update", adminAuth, function(req,res) { // Atualizar uma Atividade
    var id = req.body.id;
    var titulo = req.body.titulo;
    var texto = req.body.texto;
    var disciplina = req.body.disciplina;

    Atividade.update({
        titulo: titulo, slug: slugfy(titulo), texto: texto, disciplinaId: disciplina
    }, {
        where: {id:id}
    }).then(() => {
        res.redirect("/admin/atividade")
    }).catch((e) => {
        res.redirect("/admin/atividade")
    })
})

router.get("/atividades/page/:num", adminAuth, function(req,res) { // Paginação 
    var pagina = req.params.num;
    var offset = 0;
    var limite = 4;

    if(!isNaN(pagina) && (parseInt(pagina) > 1)) {
        offset = (parseInt(pagina) - 1) * limite;
    }

    Atividade.findAndCountAll({
        limit: limite,
        offset: offset,
        order: [['id','DESC']]
    }).then(atividades => {
        var proximo;
        if(offset + 4 >= atividades.count) { // Se deslocamento + 4 for maior ou igual que atividades contadas então:
            proximo = false // não deixar ir para o próximo
        } else { // Se deslocamento for +4 for menor ou igual que atividades contadas então:
            proximo = true // pode ir para o próximo
        }

        var resultado = {
            pagina: parseInt(pagina),
            proximo: proximo,
            atividades: atividades
        }

        Disciplina.findAll().then(disciplinas => {
            res.render("atividade/pagina", {resultado: resultado, disciplinas: disciplinas})
        })
    }).catch(e => {
        res.redirect("/")
    }) 
})

router.get("/:slug", adminAuth, function(req,res) { // Ler Artigo por Slug
    var slug = req.params.slug;
    Atividade.findOne({
        where: {slug:slug}
    }).then(atividades => {
        if(atividades != undefined) {
            Disciplina.findAll().then(disciplinas => {
                res.render("atividade/atividades", {atividades: atividades, disciplinas: disciplinas})
            });
        } else {
            res.redirect("/")
        }
    }).catch((e) => {
        res.redirect("/")
    })
})

module.exports = router;