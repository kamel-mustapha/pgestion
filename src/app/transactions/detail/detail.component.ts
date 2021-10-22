import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable} from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Router } from '@angular/router';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, OnDestroy {
  articlesOfTransac : any = []
  articlesOfApc : any = []
  allArticles : any = []
  transactions : any = {}
  apc : any = []
  totalHorsTaxe = 0
  totalTVA = 0
  liste : any 
  isModify : any = {}
  toModify : any 
  subscribe : any
  subscribe1 : any
  alreadyExists : boolean = false
  outOfStock : boolean = false
  isAddArticle : boolean = false
  constructor(private server : ServerService, private route : ActivatedRoute, private router : Router) { }
  
  ngOnInit(): void {
    
    let id = this.route.snapshot.params['id']
    this.subscribe = this.server.getTransactions().subscribe(value => {
      
      this.transactions = value.find((transac:any) => {
        return transac.id == id
      })
    })
    
    
    
    this.subscribe1 = this.server.getAPC().subscribe(
      value => {
        this.apc = value.find((apc:any)=>{
          return apc.Nom === this.transactions.APC
        })
      }
      )
      setTimeout(()=>{
        let infos = this.transactions.Articles.split(",")
        let liste : any = []
        let articlesOfTransac : any = []
        infos.forEach((element:any) => {
          let details = element.split(":")
          let obje : any = {
            article : details[0],
            quantite : details[1],
            prix : details[2],
            tva : details[3]
          }
          articlesOfTransac.push(details[0])
          this.totalTVA += ((obje.tva*obje.prix)/100)*obje.quantite
          this.totalHorsTaxe += (obje.prix*obje.quantite)
          liste.push(obje)
        });
        this.articlesOfTransac = articlesOfTransac
        this.articlesOfApc = this.apc.Articles.split(",")
        this.liste = liste
      },50)
      
      this.server.getArticles().subscribe(
        value => {this.allArticles = value}
        )
      }
      
      ngOnDestroy (){
        this.subscribe.unsubscribe()
        this.subscribe1.unsubscribe()
      }
      
      showModify(article : any){
        
        this.isModify[article] = true
        this.toModify = article
      }
      
      onSubmit(form : NgForm, oldQuantite : any, article : any){
        
        this.isModify = {}
        this.totalHorsTaxe = 0
        this.totalTVA = 0
        let articles = this.transactions.Articles.split(",")
        articles.find((article:any,index:number) =>{
          if(article.includes(this.toModify)){
            let details = article.split(":")
            articles[index] = details[0] + ":" + form.value.newQuantite + ":" + details[2] + ":" + details[3] + ":" + details[4]
          }
        })
        
        let value = oldQuantite - form.value.newQuantite
        
        let obje = {
          id : this.transactions.id,
          articles : articles,
          apc : this.transactions.APC,
          toModify : this.toModify,
          quantite : value
          
        }
      
        this.server.modifyTransaction(obje).subscribe()
        setTimeout(()=>{
          this.router.navigate(["/transactions"])
        },50)
      }
      
      addArticle(form : NgForm){
        this.alreadyExists = false
        this.outOfStock = false
        if(this.articlesOfTransac.includes(form.value.article)){
          this.alreadyExists = true
          
        } else {
          this.isAddArticle = false
          let article = this.allArticles.find((artic:any)=>{
            return artic.Nom === form.value.article
          })
          let prixOfApc = this.apc.Prix.split(",")
          let resteOfApc = this.apc.Reste.split(",")
          let tvaOfApc = this.apc.TVA.split(",")
          let index = this.articlesOfApc.indexOf(form.value.article)
          if((resteOfApc[index] -= form.value.quantity) >= 0){
            
            let obje = {
              id : this.transactions.id,
              article : form.value.article+":"+form.value.quantity+":"+prixOfApc[index]+":"+tvaOfApc[index]+":"+article.Ucomp, 
              newReste : resteOfApc,
              apc : this.transactions.APC
            }
            this.server.addArticleTransac(obje).subscribe()
            setTimeout(()=>{
              this.router.navigate(["/transactions"])
            },50)
            
          } else {
            this.outOfStock = true
          }
        }
      }
      showAdd(){
        this.isAddArticle = true
      }
      hideAdd(){
        this.isAddArticle = false
      }
    }