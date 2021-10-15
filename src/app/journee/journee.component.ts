import { Component, OnDestroy, OnInit } from '@angular/core';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { NgForm } from '@angular/forms';
import { ServerService } from '../services/server.service';

@Component({
  selector: 'app-journee',
  templateUrl: './journee.component.html',
  styleUrls: ['./journee.component.css']
})
export class JourneeComponent implements OnInit, OnDestroy {
  date = new Date().toLocaleDateString("fr-FR",{weekday: "short", year: "numeric", month: "short", day: "2-digit"})
  articles : any[] = [];
  clients : any = [];
  client : any;
  apcs : any = [];
  apc : any
  isAPC : boolean = false ; 
  articlesAPC : any ;
  isOver : boolean = false;
  subscribe1 : any
  subscribe2 : any 
  subscribe3 : any
  constructor(private server : ServerService) { 
    
  }
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.subscribe1 = this.server.getArticles().subscribe(
      values => {this.articles = values}
      )
      this.subscribe2 = this.server.getClients().subscribe(
        value => {this.clients = value}
        )
        this.subscribe3 = this.server.getAPC().subscribe(
          value => {this.apcs = value}
          )
          
        }
  ngOnDestroy(){
          this.subscribe1.unsubscribe()
          this.subscribe2.unsubscribe()
          this.subscribe3.unsubscribe()
        }
        onSubmit(form : NgForm){
          
          this.isOver = false
          let toSell : any = [] 
          this.apcs.forEach((element:any) => {
            if(element.Nom === this.client.APC){
              this.apc = element
            }
          })
          console.log(this.apc)
          let articlesofAPC = this.apc.Articles.split(",")
          let quantiteofAPC = this.apc.Reste.split(",")
          
          let prixofAPC = this.apc.Prix.split(",")
          let tvaofAPC = this.apc.TVA.split(",")
          this.articles.forEach((article)=>{
            if(form.value[article.Nom] && form.value[article.Nom] != null){
              let index = articlesofAPC.indexOf(article.Nom)
              quantiteofAPC[index] -= form.value[article.Nom]
              toSell.push(article.Nom + ":" + form.value[article.Nom] + ":" + prixofAPC[index] + ":" + tvaofAPC[index] + ":" + article.Ucomp) 
            }
          })
          quantiteofAPC.forEach((quantite:any)=>{
            if(quantite < 0){
              this.isOver = true
            }
          })
          
          if(this.isOver === false){
            let obje1 = {
              toSell : toSell,
              client : this.client.Cantine,
              apc : this.client.APC,
              quantite : quantiteofAPC
            }
       
            this.server.addTransaction(obje1).subscribe()
            
            setTimeout(()=>{
              
              this.isAPC = false;
              this.ngOnInit()
            },50)
            
          } 
          
        } 
        
        onSubmitAPC(form : NgForm){
         
          this.isAPC = true;
          let liste : any = [];
          let client = this.clients.find((clien:any) =>{
            return clien.Cantine == form.value.client.toLowerCase().trim()
          })
          this.client = client
          this.apcs.forEach((apc : any) =>{
            if(apc.Nom === client.APC){
              let articles = apc.Articles.split(",")
              let quantite = apc.Quantite.split(",")
              let reste = apc.Reste.split(",")
              
              articles.forEach((element:any) => {
                let index = articles.indexOf(element)
                let obj = {
                  nom : element,
                  quantite : quantite[index],
                  reste : reste[index]
                };
                liste.push(obj)
              });
            }
          })
          this.articlesAPC = liste
       
        }
       
      }
      