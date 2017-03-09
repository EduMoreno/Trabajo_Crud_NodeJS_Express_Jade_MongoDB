var express = require('express');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var ObjectId = require('mongodb').ObjectId;
var app = express()

app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: true}));

var conexion = 'mongodb://127.0.0.1:27017/gestion'

// Listado de datos

app.get('/', function (req, res) {
 
   mongodb.connect(conexion, function(err, db){
    let datos = {};    

//Consulta
      db.collection('usuarios').find().toArray(function(err, docs) {
        datos.usuarios = docs;
        res.render('index', datos);
      });    
  });
});

app.get('/formulario', function (req, res) {
  res.render('formulario');
});

//Añadir
app.post('/alta', function (req, res) {
  mongodb.connect(conexion, function(err, db){
    datos = {};

    let usuario = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      edad: req.body.edad,
      pais: req.body.pais
    };

    datos.usuario = usuario;

    db.collection('usuarios').insert(usuario);

 res.redirect("/");  

 });
});

//Modificar
app.post('/modificar', function (req, res) {
   datos = {};

   if(req.body.pais == "undefined"){
     pais = "";
   }else{
     pais = req.body.pais;
   }

   if(req.body.apellido == "undefined"){
     apellido = "";
   }else{
     apellido = req.body.apellido;
   }

   if(req.body.nombre == "undefined"){
     nombre = "";
   }else{
     nombre = req.body.nombre;
   }
   

   let usuario = {
      _id : req.body._id,
      nombre: nombre,
      apellido: apellido,
      edad: req.body.edad,
      pais: pais
   };

   datos.usuario = usuario;

  res.render('modificar', datos);
});

//Modificar
app.post('/modificar2', function (req, res) {
  mongodb.connect(conexion, function(err, db){;

    datos = {};

    let usuario = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      edad: req.body.edad,
      pais: req.body.pais
    };

    datos.usuario = usuario;
     db.collection('usuarios').find({_id: ObjectId(req.body._id)}).toArray(function(err, p){
        p[0].nombre = req.body.nombre,
        p[0].apellido= req.body.apellido,
        p[0].edad= req.body.edad,
        p[0].pais= req.body.pais
        

        db.collection('usuarios').update({_id: ObjectId(req.body._id)},p[0]);
     });
    

 res.redirect("/"); 
  });
});

//Borrar
app.post('/borrar', function (req, res) {
  mongodb.connect(conexion, function(err, db){

    let borrar = {
      _id: new mongodb.ObjectID(req.body._id)
    };

    db.collection('usuarios').remove(borrar)

 res.redirect("/");

  });
});


app.listen(8080, function () {
  console.log('Servidor escuchando en el puerto 8080')
})
