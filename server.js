const express=require("express");
const mysql=require('mysql2');
const app=express();
const bodyParser=require('body-parser');

const db= new mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'cnc'
})





db.connect((err)=>{
    if (err) return console.error(err.message)

    console.log('db connected')
})

//functions
function showClient(callback){
    db.query('SELECT  code,raison_social, adresse, ville, email, tel, compte_comptable,delai  FROM client',(err,rows)=>{
        if(err){
            callback(err,null)
        }else{
            callback(null,rows)
        }
    })
}
function showPersonnel(callback){
    db.query('select  id,nom,date_naissance,date_embauche,service,fonction,salaire,prime from personnel',(err,rows)=>{
        if(err) {
            callback(err,null);
        }else{
            callback(null,rows)
        }
    })
}

//login
app.post('/login/submit',(req,res)=>{
    const {username,password}=req.body;
    const query='select * from user where username = ? and password = ? '
    db.query(query,[username,password],(err,results)=>{
        if(err) {
            console.error(err.message);
            return;
        }
        if (results.length>0){
            console.log('login succesfuly')
            res.render('dashboard');
        }else{
            console.log("wrong password");
            res.send('wrong password')
        }
    })
})

//sign up
app.post('/signup/submit',(req,res)=>{
    const {name,username,password}=req.body;

    db.query('INSERT INTO user(name,username,password) VALUES (?,?,?)',[name,username,password],(err)=>{
        if (err) return console.error(err.message);
        console.log("user saved!!")
        
    })
})

//fiche_client 
app.get('/fiche_client',(req,res)=>{
    showClient((err,data)=>{
        if (err){
            console.error(err.message)
        }else{
            res.send({users :data})//send jason
        }
    })
})
app.post('/fiche_client/insert',(req,res)=>{
    const {raison_social,adresse,ville,email,tel,compte_comptable,delai}=req.body;
    db.query('insert into client (raison_social,adresse,ville,email,tel,compte_comptable,delai)values(?,?,?,?,?,?,?)',[raison_social,adresse,ville,email,tel,compte_comptable,delai],(err)=>{
        if(err)return console.error(err.message)
        console.log('client saved');
        //send jason
    })
})
app.post('/fiche_client/update',(req,res)=>{
    const {code,raison_social,adresse,ville,email,tel,compte_comptable,delai}=req.body;
    db.query('UPDATE client SET raison_social=?,adresse=?,ville=?,email=?,tel=?,compte_comptable=?,delai=? WHERE code=?;',[raison_social,adresse,ville,email,tel,compte_comptable,delai,code],(err)=>{
        if (err) return console.error(err.message)
        console.log("client modifier")
        res.redirect('/fiche_client')//send jason
    })
})
app.post('/fiche_client/delete',(req,res)=>{
    const {code}=req.body;
    db.query('delete from client where code=?',[code],(err)=>{
        if (err) return console.error(err.message)

        console.log('client supprimer')
        res.redirect('/fiche_client')//send jason
    })
})

//fiche_personnel
app.get('/fiche_personnel',(req,res)=>{
    showPersonnel((err,data)=>{
        if (err) {console.error(err.message)}
        else{res.send({users :data})}// send jason
    })
})
app.post('/fiche_personnel/insert', (req, res) => {
    const { nom ,date_naissance ,date_embauche ,service ,fonction ,salaire ,prime  } = req.body;
   
    
    db.query('INSERT INTO personnel (nom ,date_naissance ,date_embauche ,service ,fonction ,salaire ,prime ) VALUES (?, ?, ?, ?, ?, ?, ?)', [nom ,date_naissance ,date_embauche ,service ,fonction ,salaire ,prime ], (err, results) => {
        if (err) {
            console.error('Erreur lors de l\'insertion des données du produit: ' + err);
            res.status(500).send('Erreur lors de la sauvegarde des données.');
            return;
        }
        res.redirect('/fiche_personnel')//send jason
    });
});
app.post('/fiche_personnel/update', (req, res) => {
    const { id, nom, date_naissance, date_embauche, service, fonction, salaire, prime } = req.body;
    db.query(
        'UPDATE personnel SET nom = ?, date_naissance = ?, date_embauche = ?, service = ?, fonction = ?, salaire = ?, prime = ? WHERE id = ? ',
        [nom, date_naissance, date_embauche, service, fonction, salaire, prime, id],
        (err) => {
            if (err) {
                console.error(err.message);
                return;
            } else {
                console.log("Personnel modifié");
                res.redirect('/fiche_personnel');//send jason
            }
        }
    );
});

app.post('/fiche_personnel/delete', (req, res) => {
    const { id } = req.body; 
    db.query('DELETE FROM personnel WHERE id = ?', [id], (err) => {
        if (err) return console.error(err.message);
        res.redirect('/fiche_personnel');//send jason
    });
});





app.listen(2000,()=>{
    console.log("server started")
})