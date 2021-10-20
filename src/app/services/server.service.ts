import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  
  private httpOptions: any;
  constructor(private http : HttpClient) { 
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };
  }
  
  
  //Articles
  getArticles(){
    return this.http.get<[]>("http://localhost:5400/articles")
  }
  addArticle(form : {}){
    return this.http.post("http://localhost:5400/addArticle", form, this.httpOptions)
  }
  updateArticle(nom : {}){
    return this.http.post("http://localhost:5400/modArticle", nom, this.httpOptions)
  }
  deleteArticle(nom : {}){
    return this.http.post("http://localhost:5400/delArticle", nom, this.httpOptions)
  }
  updateStock(stock : {}){
    return this.http.post("http://localhost:5400/uppStock", stock, this.httpOptions)
  }
  //Fournisseurs
  getFournisseurs(){
    return this.http.get<[]>("http://localhost:5400/fournisseurs")
  }
  addFournisseur(form : {}){
    return this.http.post("http://localhost:5400/addFournisseur", form, this.httpOptions)
  }
  deleteFournisseur(nom : {}){
    return this.http.post("http://localhost:5400/delFournisseur", nom, this.httpOptions)
  }
  //Clients
  getClients(){
    return this.http.get<[]>("http://localhost:5400/clients")
  }
  addClient(form : {}){
    return this.http.post("http://localhost:5400/addClient", form, this.httpOptions)
  }
  deleteClient(nom : {}){
    return this.http.post("http://localhost:5400/delClient", nom, this.httpOptions)
  }
  //ApC
  getAPC(){
    return this.http.get<[]>("http://localhost:5400/apc")
  }
  addAPC(form : {}){
    return this.http.post("http://localhost:5400/addAPC", form, this.httpOptions)
  }

  modifyApc(form : {}){
    return this.http.post("http://localhost:5400/modifyApc", form, this.httpOptions)
  }
  addArticleApc(form : {}){
    return this.http.post("http://localhost:5400/addArticleApc", form, this.httpOptions)
  }
  //Utilisateur
  getUtilisateur(){
    return this.http.get<{}>("http://localhost:5400/utilisateur")
  }
  addUtilisateur(form : {}){
    return this.http.post("http://localhost:5400/addUser", form, this.httpOptions)
  }
  //Transactions
  getTransactions(){
    return this.http.get<[]>("http://localhost:5400/transactions")
  }
  addTransaction(form : {}){
    
    return this.http.post("http://localhost:5400/addTransaction", form, this.httpOptions)
  }
  modifyDateTransaction(form : {}){
    return this.http.post("http://localhost:5400/modifyDate", form, this.httpOptions)
  }
  modifyTransaction(form : {}){
    return this.http.post("http://localhost:5400/modifyTransaction", form, this.httpOptions)
  }
  addArticleTransac(form : {}){
    return this.http.post("http://localhost:5400/addArticleTransac", form, this.httpOptions)
  }
  deleteTransaction(form : {}){
    return this.http.post("http://localhost:5400/delTransaction", form, this.httpOptions)
  }
}
