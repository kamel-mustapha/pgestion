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
  articles : any = []
  transactions : any = {}
  totalHorsTaxe = 0
  totalTVA = 0
 
  liste : any 
  isModify : any = {}
  toModify : any 
  subscribe : any
  constructor(private server : ServerService, private route : ActivatedRoute, private router : Router) { }

  ngOnInit(): void {
   
    let id = this.route.snapshot.params['id']
    this.subscribe = this.server.getTransactions().subscribe(value => {
  
      this.transactions = value.find((transac:any) => {
        return transac.id == id
      })
    })

    setTimeout(()=>{
      let infos = this.transactions.Articles.split(",")
      let liste : any = []
      infos.forEach((element:any) => {
      let details = element.split(":")
      let obje : any = {
        article : details[0],
        quantite : details[1],
        prix : details[2],
        tva : details[3]
      }
      this.totalTVA += ((obje.tva*obje.prix)/100)*obje.quantite
      this.totalHorsTaxe += (obje.prix*obje.quantite)
     
      liste.push(obje)
    });
    this.liste = liste
    },50)
  }
  ngOnDestroy (){
    this.subscribe.unsubscribe()
  }

  showModify(article : any){

    this.isModify[article] = true
    this.toModify = article
  }

  onSubmit(form : NgForm, oldQuantite : any){

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
    this.router.navigate(["/transactions"])
    
 
  }

}
