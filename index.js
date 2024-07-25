//!: Modules et Middlewares
//C.Y.D
const express = require('express')
const app = express()
app.use(express.json())
//C.Y.D
const path = require('path')
app.use(express.static(path.join(__dirname, 'sources')))
//C.Y.D
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
//C.Y.D
const msql = require('mysql')
const connection = msql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'CalebYang59*mysql',
    database: 'atl'
})
connection.connect((err)=>{
    if(err){
        console.error('Erreur de connection à la base de données',err)
    }else{
        console.log('Connexion à la Base de Données établi !!!')
    }
})
//C.Y.D
//!: Variables et Constantes
//C.Y.D
const routes = {
    connexion: "/c",
    inscription: "/i",
    accueil: "/index"
}
const port = 1080
var id = 10000;
//C.Y.D
//!: Methode Get
//C.Y.D
app.get(routes.connexion, (req,res)=>{
    res.sendFile(path.join(__dirname, 'sources', 'connexion.html'))
})
app.get(routes.inscription, (req,res)=>{
    res.sendFile(path.join(__dirname, 'sources', 'inscription.html'))
})
//C.Y.D
app.get(routes.accueil, (req,res)=>{
    console.log(`User active is ${id}`)
    const query2 = `select * from task where idU = "${id}" and state = 0;`
    const query3 = `select * from task where idU = "${id}" and state = 1;`

    connection.query(query2, (err, reslt) => {
    if (err) {
            console.error('Erreur lors de l\'exécution de la requête SQL :', err);
            console.log('ERRORRRRR');
            res.status(500).send('Erreur du serveur');
            return;
        }
        // Rendre la page HTML avec les tâches récupérées de la base de données
        connection.query(query3, (err, rsl) => {
            if (err) {
                console.error('Erreur lors de l\'exécution de la requête SQL :', err);
                console.log('ERRORRRRR');
                res.status(500).send('Erreur du serveur');
                return;
            }
            // Rendre la page HTML avec les tâches récupérées de la base de données
                res.render('index', { tasks: reslt, tasks2: rsl });
            });
    });

    // res.sendFile(path.join(__dirname, 'sources', 'index.html'))
})
//C.Y.D
//!: Methode Post
//C.Y.D
app.post('/ajouter-tache', (req, res) => {
    const taskName = req.body.task;
    const query = `insert into task (name,state,idU) values ("${taskName}","${0}","${id}");`
    const query2 = `select * from task where idU = "${id}" and state = 0;`
    const query3 = `select * from task where idU = "${id}" and state = 1;`
//C.Y.D    
    connection.query(query, (err, results)=>{
        if(err){
            console.error('Erreur lors de l\'execution de la requete sql', err)
            res.status(500).send('Erreur du serveur')
        }else{
            console.log('Data Saved !')
            console.log('Nom de la tâche ajoutée:', taskName);
            connection.query(query2, (err, reslt) => {
                if (err) {
                        console.error('Erreur lors de l\'exécution de la requête SQL :', err);
                        console.log('ERRORRRRR');
                        res.status(500).send('Erreur du serveur');
                        return;
                    }
                    // Rendre la page HTML avec les tâches récupérées de la base de données
                    connection.query(query3, (err, rsl) => {
                        if (err) {
                            console.error('Erreur lors de l\'exécution de la requête SQL :', err);
                            console.log('ERRORRRRR');
                            res.status(500).send('Erreur du serveur');
                            return;
                        }
                        // Rendre la page HTML avec les tâches récupérées de la base de données
                            res.render('index', { tasks: reslt, tasks2: rsl });
                        });
                });
        }
    })
});
//C.Y.D
app.post('/supprimer-tache/:idT', (req, res) => {
    const taskId = req.params.idT; // Récupère l'identifiant de la tâche à supprimer
    const query = `delete from task where idT = "${taskId}";`;

    // Exécute une requête SQL pour supprimer la tâche de la base de données
    connection.query(query,(err, result) => {
        if (err) {
            console.error('Erreur lors de la suppression de la tâche :', err);
            res.status(500).send('Erreur du serveur');
            return;
        }
        console.log('Tâche supprimée avec succès');
        // Redirige l'utilisateur vers la page d'accueil après la suppression
        res.redirect('/index');
    });
});
//C.Y.D
app.post('/statu-tache/:idT', (req, res) => {
    const taskId = req.params.idT; // Récupère l'identifiant de la tâche à supprimer
    const query = `update task set state = 1 where idT = "${taskId}";`;

    // Exécute une requête SQL pour supprimer la tâche de la base de données
    connection.query(query,(err, result) => {
        if (err) {
            console.error('Erreur lors de la suppression de la tâche :', err);
            res.status(500).send('Erreur du serveur');
            return;
        }
        console.log('Tâche supprimée avec succès');
        // Redirige l'utilisateur vers la page d'accueil après la suppression
        res.redirect('/index');
    });
});
//C.Y.D
app.post('/inscription', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const query = `insert into user (name,email,password) values ("${username}","${email}","${password}");`
//C.Y.D    
    connection.query(query, (err, results)=>{
        if(err){
            console.error('Erreur lors de l\'execution de la requete sql', err)
            res.status(500).send('Erreur du serveur')
        }else{
            console.log('Data Saved !')
            res.sendFile(path.join(__dirname, 'sources', 'connexion.html'))
        }
    })
});
//C.Y.D
app.post('/connexion', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const query = `select idU from user where email = "${email}" and password = "${password}";`;
//C.Y.D
    connection.query(query,(err, results) => {
        if (err) {
            console.error('Erreur lors de la vérification des informations d\'identification:', err);
            res.status(500).send('Une erreur s\'est produite lors de la connexion');
        } else {
            if (results.length > 0) {
                // Utilisateur authentifié, rediriger ou répondre en conséquence
                // res.send('Connexion réussie !');
                const userIdFromDB = results[0].idU;
                id = userIdFromDB;
                console.log(userIdFromDB)
                res.redirect('/index')
                // app._router.handle({ method: 'get', url: '/index'})
            } else {
                res.send('Identifiants incorrects. Veuillez réessayer.');
            }
        }
    })
});
//C.Y.D
app.set('view engine','ejs');
//!: Ouverture du Serveur
//C.Y.D
app.listen(port, console.log(`Server is open on port ${port}...`))
//C.Y.D
//!: TAF:
//C.Y.D
    //todo1: Faire l'affichage des taches d'un utilisateur
    //todo2: Faire la modification et la suppression des taches d'un utilisateur
    //todo3: Améliorer le front-end et l'ergonomie de l'application
    //todo4: Maintenance évolutive de l'application
    //todo5: Sauvegarder l'application