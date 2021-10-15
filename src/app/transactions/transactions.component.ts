import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ServerService } from '../services/server.service';
import { HostListener } from '@angular/core';




@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit, OnDestroy {
  

  utilisateur : any = {};
  transactions : any ;
  articles : [] ;
  articleInBl : any ;
  isBl : boolean = false;
  transac : any 
  totalHorsTaxe = 0;
  tva9 = 0;
  tva19= 0;
  trimestre : any;
  isModify : any = {};
  subscribe1 : any
  subscribe2 : any 
  subscribe3 : any
  constructor(private server : ServerService) { }
  
  ngOnInit(): void {
    
    
    this.subscribe1 = this.server.getUtilisateur().subscribe(
      (value) => {this.utilisateur = value}
      )
      this.subscribe2 = this.server.getTransactions().subscribe(
        value => {this.transactions = value;this.transactions = this.transactions.reverse()}
        )
        this.subscribe3 = this.server.getArticles().subscribe(
          value => {this.articles = value}
          )
        }
  ngOnDestroy(){
    this.subscribe1.unsubscribe()
    this.subscribe2.unsubscribe()
    this.subscribe3.unsubscribe()
  }
        onCreer(transaction : any){
          this.totalHorsTaxe = 0;
          this.tva9 = 0;
          this.tva19= 0;
          this.transac = transaction
          let date = transaction.Add_Date.split("-")
          if((date[1]) < 4){
            this.trimestre = "1 er trimestre " + date[2]
          } else if (date[1] < 7 && date[1] > 3){
            this.trimestre = "2 éme trimestre " + date[2]
          } else if(date[1] < 10 && date[1] > 6){
            this.trimestre = "3 éme trimestre " + date[2]
          } else if(date[1] < 13 && date[1] > 9){
            this.trimestre = "4 éme trimestre " + date[2]
          }
          
          let liste : any = []
          let articlesQuantite = transaction.Articles.split(",")
        
          articlesQuantite.forEach((element : any) => {
            let artic = element.split(":")
            let obje : any = {
              Nom : artic[0],
              quantite : artic[1],
              Prix : artic[2],
              TVA : artic[3],
              Ucomp : artic[4]
            }
            obje.TTC = ((obje.TVA*obje.Prix)/100) + obje.Prix
            this.totalHorsTaxe += (obje.Prix*obje.quantite)
            if(obje.TVA == 9){
              this.tva9 += ((obje.Prix * 9)/100)*obje.quantite
            } else if (obje.TVA == 19){
              this.tva19 += ((obje.Prix * 19)/100)*obje.quantite
            }
            liste.push(obje)
          });
          
          this.articleInBl = liste
          setTimeout(()=>{
            this.isBl = true ; 
          },10)
        }
        @HostListener('document:keydown.escape') hideBl(){
          this.isBl = false;
        }
        onPrint(){
          this.isBl = false;
          window.print()
          
        }
        onModify(id : any){
          this.isModify[id] = true
        
        }
        
        onSubmitDate(form : NgForm, id : any){
          let date = form.value.date.split("-").reverse().join("-")
          let obje = {
            id : id ,
            date : date
          }
          this.isModify = false;
          this.server.modifyDateTransaction(obje).subscribe()
          setTimeout(()=>{
            this.isModify = {}
            this.ngOnInit()
          },10)
        }
      }
      