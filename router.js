//App routes
module.exports = function(app){

    var Usuario = require('./user');

    
    //GET leer todos los usuario de la aplicación
    list = function(req, res){
        Usuario.find(function(error, usuarios) {
            if (!error) {
                res.json(usuarios);
            } else {
                console.log(error);
            }        
        });
    };

    //GET leer usuario por email
    find = function(req, res) {  
        Usuario.find({email: req.params.email}, function(error, usuario) {        
            if (!error) {
              res.json(usuario);
            } else {
              console.log(error);
            }            
        })
    };

    //POST crear usuario
    createUser = function(req, res){
        var usuario = new Usuario({
            usuario: req.body.usuario, 
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            email: req.body.email,
            empresa: req.body.empresa,
            telefono: req.body.telefono,
            latitud: req.body.latitud,
            longitud: req.body.longitud
        });
        usuario.save(function (error) {
            if (!error) {
              res.json({"success":"Created OK"});
            } else {
              console.log(error);
            }
        });
        
    };

    //PUT - actualizar usuario
    updateUser = function(req, res) {
        Usuario.update({email: req.params.email}, req.body, {multi: false}, function (error, count) {
            if(!error) {
                res.json({"success":"Updated OK"});
            } else {
                console.log(error);
            } 
        });
    };

    //DELETE - Eliminar usuario
    deleteUser = function(req, res) {         
        Usuario.remove({email: req.params.email}, function (error, count) {
            if(!error) {
                res.json({"success":"Deleted OK"});
            } else {
                console.log(error);
            }
        });
    }
   //Link routes and functions
    app.get('/usuarios', list);
    app.get('/usuarios/:email', find);
    app.post('/usuario', createUser);   
    app.put('/usuarios/:email', updateUser);
    app.delete('/usuarios/:email', deleteUser);
}
