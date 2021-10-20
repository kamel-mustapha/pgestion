const {app, BrowserWindow} = require('electron')
const path = require('path')

//*****************************************************************************/
const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const appE = express()
const sqlArticle = "SELECT id, Nom, Perem_Date, Ucomp , Add_Date  FROM Articles"
const sqlFournisseur = "SELECT Nom , Code , Telephone , Ville , Adresse, Naissance , Registre , Fiscal , Impot , Raison , Specialite , Banque, Add_Date FROM Fournisseurs"
const sqlUtilisateur = "SELECT id ,Nom , Ville, Commune , Adresse , Inspection, Recette , NIF , NIS, ART, Banque, Nbanque, Nregistre, Activite FROM Utilisateur"
const sqlClient = "SELECT APC , Cantine, Add_Date FROM Clients"
const sqlAPC = "SELECT Nom, Articles, Quantite, Reste, Prix, TVA, Add_Date FROM APC"
const sqlTransaction = "SELECT id , Articles, Client, APC, Add_Date FROM Transactions"
const cors = require('cors');
const server = appE.listen(5400)

// middleware
appE.use(express.json())
appE.use(cors())

//Connection or creation of DATABASE
let db = new sqlite3.Database('mydb.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  return console.log('Connected to the mydb database.');  
});

//Creation of table Article in DATABASE 
db.run('CREATE TABLE Articles(id INTEGER PRIMARY KEY, Nom TEXT, Perem_Date DATE, Ucomp TEXT, Add_Date DATE)', (err)=>{
  if(err){
    return true
  }
})


//Creation of table APC in DATABASE 


db.run('CREATE TABLE APC(Nom TEXT, Articles TEXT, Quantite TEXT, Reste TEXT, Prix TEXT, TVA TEXT, Add_Date DATE)', (err)=>{
  if(err){
    return true
  }
})
//Creation of table Clients in DATABASE 


db.run('CREATE TABLE Clients(APC TEXT, Cantine TEXT, Add_Date DATE)', (err)=>{
  if(err){
    return true
  }
})

//Creation of table Fournisseur in DATABASE 


db.run('CREATE TABLE Fournisseurs(Nom TEXT,Code INT, Telephone TEXT, Ville TEXT, Adresse TEXT , Naissance DATE, Registre TEXT, Fiscal TEXT, Impot TEXT, Raison TEXT, Specialite TEXT, Banque TEXT, Add_Date DATE)', (err)=>{
  if(err){
    return true
  }
})



db.serialize(() => {
  //Creation of table Utilisateur in DATABASE 
  db.run('CREATE TABLE Utilisateur(id, Nom TEXT, Ville TEXT, Commune TEXT, Adresse TEXT, Inspection TEXT, Recette TEXT, NIF INT, NIS INT, ART INT, Banque TEXT, Nbanque INT, Nregistre INT, Activite TEXT)', (err)=>{
    if(err){
      return true
    }
  })
  
  //Fill Utilisateur table
  
  db.all(sqlUtilisateur, [], (err, rows) => {
    if (err) {
      return console.log(err)
    }
    
    
    if(rows.length === 0){
      db.run(`INSERT INTO Utilisateur(id, Nom, Ville, Commune, Adresse, Inspection, Recette, NIF, NIS, ART, Banque, Nbanque, Nregistre, Activite) VALUES(1, "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/", "/")`, [], function(err) {
        if (err) {
          return console.log(err.message);
        }
        return true
      });
    } 
    
  });
  
  
});

//Creation of table Transactions in DATABASE 


db.run('CREATE TABLE Transactions(id INTEGER PRIMARY KEY, Articles TEXT, Client TEXT, APC TEXT, Add_Date DATE)', (err)=>{
  if(err){
    return true
  }
})


//Creation of table Factures in DATABASE 


db.run('CREATE TABLE Factures(id INTEGER PRIMARY KEY, Articles TEXT, Quantite TEXT, Prix TEXT, TVA TEXT, Client TEXT, APC TEXT, Add_Date DATE)', (err)=>{
  if(err){
    return true
  }
})
//Server Part

//GET ALL ARTICLES
appE.get('/articles', (req, res)=>{
  
  db.all(sqlArticle, [], (err, rows) => {
    if (err) {
      res.send("NOTOK") ;
    }
    return res.json(rows)
  });
  
});

//POST ONE ARTICLE
appE.post('/addArticle', (req,res) =>{
  let today = new Date();
  let time = today.getDate() + '-' + (today.getMonth()+1) + '-'  + today.getFullYear() + ' à ' + today.getHours() + ":" + today.getMinutes();
  let nom = req.body.nom.toLowerCase().trim()
  if(req.body.peremDate){
    perem = req.body.peremDate
  } else { perem = "-"}
  
  if(req.body.ucomp){
    ucomp = req.body.ucomp.toLowerCase().trim()
  } else { ucomp = "-"}
  
  
  
  db.run(`INSERT INTO Articles(Nom, Perem_Date, Ucomp, Add_Date ) VALUES(?, ? , ?, ?)`, [nom,perem,ucomp,time], function(err) {
    if (err) {
      return console.log(err.message);
    }
    return true
  });
  res.json("Ok")
})


//Modify article
appE.post('/modArticle', (req,res) =>{
  
  db.all(sqlArticle, [], (err, rows) => {
    if (err) {
      console.log("NOTOK") ;
    }
    let change = req.body.toModify.toLowerCase().trim();
    let article = rows.find(row=>{
      return row.Nom === req.body.toModify.toLowerCase().trim();
    })
    
    if(req.body.nom){
      nom = req.body.nom.toLowerCase().trim();
    } else { nom = article.Nom}
    if(req.body.peremDate){
      perem = req.body.peremDate
    } else { perem = article.Perem_Date}
    if(req.body.ucomp){
      ucomp = req.body.ucomp
    } else { ucomp = article.Ucomp}
    
    
    db.run(`UPDATE Articles SET Nom = ?, Perem_Date = ?, Ucomp = ?  WHERE Nom = ?`, [nom , perem, ucomp, change], function(err) {
      if (err) {
        return console.log(err.message);
      }
      
    });
  });
  
  return res.json("Ok")
})

//Delete article
appE.post('/delArticle', (req,res) =>{
  
  let nom = req.body.nom
  
  
  for(i in nom){
    db.run(`DELETE FROM Articles WHERE Nom = ?`, nom[i], function(err) {
      if (err) {
        return console.log(err.message);
      }
      return true
    });
  }
  return res.json("Ok")
})


//GET ALL Fournisseurs
appE.get('/fournisseurs', (req, res)=>{
  
  db.all(sqlFournisseur, [], (err, rows) => {
    if (err) {
      return res.send("NOTOK") ;
    }
    return res.json(rows)
  });
  
});

//Add fournisseur 

appE.post('/addFournisseur', (req,res) =>{
  let today = new Date();
  let time = today.getDate() + '-' + (today.getMonth()+1) + '-'  + today.getFullYear() + ' à ' + today.getHours() + ":" + today.getMinutes();
  let nom = req.body.nom.toLowerCase().trim();
  let code = req.body.code;
  let telephone = req.body.telephone;
  let ville = req.body.ville;
  let adresse = req.body.adresse.toLowerCase().trim();
  let naissance = req.body.naissance ;
  let registre = req.body.registre.toLowerCase().trim();
  let fiscal = req.body.fiscal.toLowerCase().trim();
  let impot = req.body.impot.toLowerCase().trim();
  let raison = req.body.raison.toLowerCase().trim();
  let specialite = req.body.specialite.toLowerCase().trim();
  let banque = req.body.banque.toLowerCase().trim();
  
  
  db.run(`INSERT INTO Fournisseurs(Nom ,Code , Telephone , Ville , Adresse, Naissance , Registre , Fiscal , Impot , Raison , Specialite , Banque, Add_Date ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [nom, code, telephone, ville, adresse, naissance, registre, fiscal, impot, raison, specialite, banque, time], function(err) {
    if (err) {
      return console.log(err.message);
    }
    
  });
  return res.json("Ok")
})

//Delete fournisseur
appE.post('/delFournisseur', (req,res) =>{
  
  let nom = req.body.nom.toLowerCase().trim()
  
  db.run(`DELETE FROM Fournisseurs WHERE Nom = ?`, [nom], function(err) {
    if (err) {
      return console.log(err.message);
    }
    
    
  });
  return res.json("Deleted")
})
//GET User 
appE.get('/utilisateur', (req, res)=>{
  
  db.all(sqlUtilisateur, [], (err, rows) => {
    if (err) {
      res.send("NOTOK") ;
      console.log(err)
    }
    return res.json(rows[0])
  });
  
});

//POST User

appE.post('/addUser', (req,res) =>{
  db.serialize(()=>{
    db.all(sqlUtilisateur, [], (err, rows) => {
      if (err) {
        res.send("NOTOK") ;
      }
      let user = rows.find(utilisateur => {
        return utilisateur.id === 1
      })
      if(req.body.nom){
        nom = req.body.nom.toLowerCase().trim()
      } else { nom = user.Nom}
      if(req.body.ville){
        ville = req.body.ville
      } else { ville = user.Ville}
      if(req.body.commune){
        commune = req.body.commune
      } else { commune = user.Commune}
      if(req.body.adresse){
        adresse = req.body.adresse
      } else { adresse = user.Adresse}
      if(req.body.inspection){
        inspection = req.body.inspection
      } else { inspection = user.Inspection}
      if(req.body.recette){
        recette = req.body.recette
      } else { recette = user.Recette}
      if(req.body.nif){
        nif = req.body.nif
      } else { nif = user.Nif}
      if(req.body.nis){
        nis = req.body.nis
      } else { nis = user.Nis}
      if(req.body.art){
        art = req.body.art
      } else { art = user.Art}
      if(req.body.banque){
        banque = req.body.banque
      } else { banque = user.Banque}
      if(req.body.nbanque){
        nbanque = req.body.nbanque
      } else { nbanque = user.Nbanque}
      if(req.body.nregistre){
        nregistre = req.body.nregistre
      } else { nregistre = user.Nregisre}
      if(req.body.activite){
        activite = req.body.activite
      } else { activite = user.Activite}
      
      db.run(`UPDATE Utilisateur SET Nom = ?, Ville = ?, Commune = ?, Adresse = ?, Inspection = ?, Recette = ?, NIF = ?, NIS = ?, ART = ?, Banque = ?, Nbanque = ?, Nregistre = ?, Activite = ?  WHERE ID = 1`, [nom,ville,commune,adresse,inspection,recette,nif,nis,art,banque,nbanque,nregistre,activite], function(err) {
        if (err) {
          return console.log(err.message);
        }
        
      });
      
      db.all(sqlUtilisateur, [], (err, rows) => {
        if (err) {
          res.send("NOTOK") ;
          console.log(err)
        }
        return res.json(rows[0])
      });
    })
    
  })})
  
  
  //GET ALL Clients
  appE.get('/clients', (req, res)=>{
    
    db.all(sqlClient, [], (err, rows) => {
      if (err) {
        return res.send("NOTOK") ;
      }
      return res.json(rows)
    });
  });
  //POST ONE Client
  appE.post('/addClient', (req,res) =>{
    let today = new Date();
    let time = today.getDate() + '-' + (today.getMonth()+1) + '-'  + today.getFullYear() + ' à ' + today.getHours() + ":" + today.getMinutes();
    let apc = req.body.apc.toLowerCase().trim()
    let cantine = req.body.cantine.toLowerCase().trim()
    db.run(`INSERT INTO Clients(APC, Cantine, Add_Date ) VALUES(?, ?, ?)`, [apc,cantine,time], function(err) {
      if (err) {
        return console.log(err.message);
      }
      
    });
    return res.json("Ok")
  })
  
  //Delete Client
  appE.post('/delClient', (req,res) =>{
    
    let cantine = req.body.cantine.toLowerCase().trim()
    
    db.run(`DELETE FROM Clients WHERE Cantine = ?`, [cantine], function(err) {
      if (err) {
        return console.log(err.message);
      }
      
      
    });
    return res.json("Deleted")
  })
  //GET ALL APC
  appE.get('/apc', (req, res)=>{
    
    db.all(sqlAPC, [], (err, rows) => {
      if (err) {
        res.send("NOTOK") ;
      }
      return res.json(rows)
    });
    
  });
  //POST ONE APC
  appE.post('/addAPC', (req,res) =>{
    let today = new Date();
    if(req.body.time){
      time = req.body.time
    } else {time = today.getDate() + '-' + (today.getMonth()+1) + '-'  + today.getFullYear() ;}
    let nom = req.body.nom.toLowerCase().trim()
    let articles = req.body.articles
    let quantite = req.body.quantite
    let reste = req.body.quantite
    let prix = req.body.prix
    let tva = req.body.tva
    db.run(`INSERT INTO APC(Nom, Articles, Quantite, Reste, Prix, Tva, Add_Date) VALUES(?, ?, ?, ?, ?, ?, ?)`, [nom,articles,quantite, reste, prix, tva, time], function(err) {
      if (err) {
        return console.log(err.message);
      }
      
    });
    return res.json("Ok")
  })
  
  //Modify APC
  appE.post('/modifyApc', (req,res) =>{
    db.serialize(()=>{
      db.all(sqlAPC, [], (err, rows) => {
        if (err) {
          res.send("NOTOK") ;
        }
        let article = req.body.article
        
        let apc = rows.find(apc => {
          return apc.Nom === req.body.apc
        })
        let index = apc.Articles.split(",").indexOf(article)
        let quantity = apc.Quantite.split(",")
        let reste = apc.Reste.split(",")
        let prix = apc.Prix.split(",")
        let tva = apc.TVA.split(",")
        reste = reste.map(reste => {
          return parseFloat(reste)
        })
        reste[index] += req.body.quantite - quantity[index]
        quantity[index] = req.body.quantite
        prix[index] = req.body.prix
        tva[index] = req.body.tva
        
        db.run(`UPDATE APC SET Quantite = ?, Reste = ?, Prix = ?, TVA = ? WHERE Nom = ?`, [quantity, reste, prix, tva, apc.Nom], function(err) {
          if (err) {
            return console.log(err.message);
          }
          
        });
        
      });
    })
    
    return res.json("OK")
  })
  
  //Add Article to APC 
  
  appE.post('/addArticleApc', (req,res) =>{
    db.serialize(()=>{
      db.all(sqlAPC, [], (err, rows) => {
        if (err) {
          res.send("NOTOK") ;
        }
        let apc = rows.find(apc => {
          return apc.Nom === req.body.apc
        })
        let articles = apc.Articles.split(",")
        let quantity = apc.Quantite.split(",")
        let reste = apc.Reste.split(",")
        let prix = apc.Prix.split(",")
        let tva = apc.TVA.split(",")
        articles.push(req.body.article)
        quantity.push(req.body.quantity)
        reste.push(req.body.quantity)
        prix.push(req.body.price)
        tva.push(req.body.tva)
        
        db.run(`UPDATE APC SET Articles = ?, Quantite = ?, Reste = ?, Prix = ?, TVA = ? WHERE Nom = ?`, [articles, quantity, reste, prix, tva, apc.Nom], function(err) {
          if (err) {
            return console.log(err.message);
          }
          
        });
        
      });
    })
    
    return res.json("OK")
  })
  
  //GET ALL Transactions
  appE.get('/transactions', (req, res)=>{
    
    db.all(sqlTransaction, [], (err, rows) => {
      if (err) {
        res.send("NOTOK") ;
      }
      return res.json(rows)
    });
    
  });
  
  //Add Transaction 
  
  appE.post('/addTransaction', (req,res) =>{
    
    let today = new Date();
    let time = today.getDate() + '-' + (today.getMonth()+1) + '-'  + today.getFullYear() ;
    let articles = req.body.toSell
    let client = req.body.client;
    let apc = req.body.apc;
    let quantite = req.body.quantite;
    db.serialize(() => {
      
      db.run(`INSERT INTO Transactions(Articles ,Client, APC , Add_Date) VALUES(?, ?, ?, ?)`, [articles, client, apc, time], function(err){
        if(err){
          return console.log(err)
        }
      }); 
      db.run(`UPDATE APC SET Reste = ? WHERE Nom = ?`, [quantite , apc], function(err){
        if(err){
          return console.log(err)
        }
      });
      return res.json("OK")
    });
    
    
  })
  
  //Modify DateTransaction
  appE.post('/modifyDate', (req,res) =>{
    
    let date = req.body.date
    let id = req.body.id
    
    
    db.run(`UPDATE Transactions SET Add_Date = ? WHERE id = ?`, [date , id], function(err) {
      if (err) {
        return console.log(err.message);
      }
      
    });
    return res.json("OK")
  })
  //Modify transaction
  appE.post('/modifyTransaction', (req,res) =>{
    db.serialize(()=>{
      let id = req.body.id
      let articles = req.body.articles
      
      db.all(sqlAPC, [], (err, rows) => {
        let apc = rows.find(apc =>{
          return apc.Nom == req.body.apc
        })
        
        let index = apc.Articles.split(",").indexOf(req.body.toModify)
        var quantity = apc.Reste.split(",").map(quantite => {
          return parseFloat(quantite)
        }) 
        quantity[index] += req.body.quantite
        db.run(`UPDATE APC SET Reste = ? WHERE Nom = ?`, [quantity , apc.Nom], function(err) {
          if (err) {
            return console.log(err.message);
          }
        });
      })
      db.run(`UPDATE Transactions SET Articles = ? WHERE id = ?`, [articles , id], function(err) {
        if (err) {
          return console.log(err.message);
        }
        
      });
    });
    return res.json("OK")
  })
  
  
  //Add article to transaction
  
  appE.post('/addArticleTransac', (req,res) =>{
    db.serialize(()=>{
      
      db.all(sqlTransaction, [], (err, rows) => {
        if (err) {
          res.send("NOTOK") ;
        }
        let transaction = rows.find(transaction =>{
          return transaction.id === req.body.id
        })
        let newArticles = transaction.Articles.split(",")
        newArticles.push(req.body.article)
        
        db.run(`UPDATE Transactions SET Articles = ? WHERE id = ?`, [newArticles , req.body.id], function(err) {
          if (err) {
            return console.log(err.message);
          }
        });
      });
      
      db.run(`UPDATE APC SET Reste = ? WHERE Nom = ?`, [req.body.newReste , req.body.apc], function(err) {
        if (err) {
          return console.log(err.message);
        }
      });
      
    });
    return res.json("OK")
  })
  
  
  
  //Delete Client
  
  appE.post('/delTransaction', (req,res) =>{
    
    db.serialize(()=>{
      let id = req.body.id
      let articles = req.body.articles
      let quantite = req.body.quantite
      
      db.all(sqlAPC, [], (err, apcs) => {
        if (err) {
          res.send("NOTOK") ;
        }
        let apc = apcs.find(apc => {
          return apc.Nom === req.body.apc
        })
        let articlesofAPC = apc.Articles.split(",")
        let quantiteofAPC = apc.Reste.split(",")
        quantiteofAPC = quantiteofAPC.map(quantite => {
          return parseFloat(quantite)
        })
        articlesofAPC.forEach((article) => {
          if(articles.includes(article)){
            let index = articles.indexOf(article)
            quantiteofAPC[index] += parseFloat(quantite[index] )
            
          }
        })
        db.run(`UPDATE APC SET Reste = ? WHERE Nom = ?`, [quantiteofAPC , apc.Nom], function(err) {
          if (err) {
            return console.log(err.message);
          }
        });
      });
      db.run(`DELETE FROM Transactions WHERE id = ?`, [id], function(err) {
        if (err) {
          return console.log(err.message);
        }
        
      });
    });
    return res.json("Deleted")
  })
  





//************************************************************************************/
function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 1000,
    minWidth : 1400,
    minHeight:1000
    
  })
  mainWindow.maximize()
  // mainWindow.webContents.openDevTools();
  mainWindow.removeMenu();
  // and load the index.html of the app.
  mainWindow.loadFile(__dirname + '/dist/frontend/index.html')
  
  
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}




// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  console.log("hello")
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin'){
    // db.close((err)=>{
    //   if(err){
    //     console.log(err)
    //   }
    // });
    server.close(()=>{
      console.log("Disconnected from server")
    });
    app.quit();
    
  } 
  
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.