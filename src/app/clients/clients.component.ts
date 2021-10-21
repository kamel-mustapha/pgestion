import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ServerService } from '../services/server.service';
import Swal from 'sweetalert2'
import { HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FonctionsService } from '../services/fonctions.service';
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent implements OnInit, OnDestroy {
  articles : any[] = [];
  date : any ;
  subscribe1 : any
  subscribe2 : any 
  subscribe3 : any
  @HostListener('document:keydown.escape') hideALl(){
    this.hideAdd()
    this.hideAddApc()
    this.hideCC()
  }
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.subscribe1 = this.server.getClients().subscribe(
      value => {this.clients = value}
      )
      this.subscribe2 = this.server.getArticles().subscribe(
        value => {this.articles = value}
        )
        this.subscribe3 = this.server.getAPC().subscribe(
          value => {this.APCs = value}
          )
        }
        onDelete(cantine : any){
          
          let cantineObj = {
            cantine : cantine
          }
          let cantineJson = JSON.stringify(cantineObj); 
          
          Swal.fire({
            title: 'Confirmation',
            text: 'Etes vous sûr de vouloir supprmier ce client ?',
            confirmButtonColor: "#bc0000",
            confirmButtonText: 'Oui',
            cancelButtonText : 'Non',
            showCancelButton : true ,
            
          }).then(value=>{
            if(value['isConfirmed']){
              this.server.deleteClient(cantineJson).subscribe()
              setTimeout(()=>{
                this.ngOnInit()
              },10)
            }
          })
        }
        ngOnDestroy(){
          this.subscribe1.unsubscribe()
          this.subscribe2.unsubscribe()
          this.subscribe3.unsubscribe()
        }
        constructor(private server : ServerService, private router : Router, private fonction : FonctionsService) { }
        
        // Ajouter client
        isDuplicate : boolean = false;
        clients : any[] = [];
        isAdd : boolean = false;
        showAdd(){
          this.isAdd = true;
          this.hideAddApc()
          this.hideCC()
        }
        hideAdd(){
          this.isAdd = false
        }
        onSubmit(form : NgForm){
          let client = this.clients.find((client)=>{
            
            return form.value.cantine.toLowerCase().trim() === client.Cantine.toLowerCase().trim()
            
          })
          
          if(client === undefined){
            this.isDuplicate = false;
            this.server.addClient(form.value).subscribe()
              this.hideAdd()
              setTimeout(()=>{
                // location.reload();
                this.ngOnInit()
              },5)
            } else {
              this.isDuplicate = true ; 
              this.ngOnInit();
            }
            
            if(!this.isDuplicate){
              
            }
          };
          
          
          // Ajouter APC
          isAddApc : boolean = false;
          isDuplicateAPC : boolean = false;
          showAddApc(){
            this.isAddApc = true;
            this.hideAdd()
            this.hideCC()
            
          }
          hideAddApc(){
            this.isAddApc = false
          }
          onSubmitAPC(form : NgForm){
            
            let liste : any = []
            let quantite : any = []
            let prix : any = []
            let tva : any = []
            let apc = this.APCs.find((apc)=>{
              
              return form.value.nom.toLowerCase().trim() === apc.Nom.toLowerCase().trim()
              
            })
            this.articles.forEach(article => {
              if(form.value[article.Nom] && form.value[article.Nom] != null){
                liste.push(article.Nom)
                quantite.push(form.value[article.Nom])
                prix.push(form.value["prix"+article.Nom])
                tva.push(form.value["tva"+article.Nom])
              }
            })
            
            let obje = {
              nom  : form.value.nom,
              articles : liste,
              quantite : quantite,
              prix : prix,
              tva : tva, 
              time : (form.value.time).split("-").reverse().join("-")
            }
            if(apc === undefined){
              this.isDuplicateAPC = false ; 
              this.server.addAPC(obje).subscribe()
              this.isAddApc = false;
              setTimeout(()=>{
                this.ngOnInit()
              },10)
            } else {
              this.isDuplicateAPC = true ; 
              this.ngOnInit();
            }
          }
          
          
          // Afficher Modifier les APC
          modifyPosition : any = {}
          addArticle : boolean = false
          alreadyExists : boolean = false
          modifyArticle : boolean = false
          isAPC : boolean = false;
          apcToModify : any
          isApcModify : any = {}
          articleToModify : any
          totalHT : any
          totalTVA : any
          isCC : boolean = false;
          APCs : any[] = [];
          articlesAPC : any ;
          showCC(){
            this.isCC = true;
            this.hideAdd()
            this.hideAddApc()
          }
          hideCC(){
            this.isCC = false;
          }
          onSubmitAP(form : NgForm){
            this.totalHT = 0
            this.totalTVA = 0
            this.isAPC = true;
            let liste : any = [];
            let apc = this.APCs.find((apc:any) =>{
              return apc.Nom == form.value.apc.toLowerCase().trim()
            })
            
            this.apcToModify = apc
            let articles = apc.Articles.split(",")
            let quantite = apc.Quantite.split(",")
            let reste = apc.Reste.split(",")
            let prix = apc.Prix.split(",")
            let tva = apc.TVA.split(",")
            this.date = apc.Add_Date
            articles.forEach((element:any) => {
              let index = articles.indexOf(element)
              let obj = {
                nom : element,
                quantite : quantite[index],
                reste : reste[index],
                prix : prix[index],
                tva : tva[index]
              };
              
              this.totalHT += obj.prix*obj.quantite
              this.totalTVA += ((obj.tva*obj.prix)/100)*obj.quantite
              liste.push(obj)
            });
            
            this.articlesAPC = liste
          }
          submitApc(form : NgForm){
            if(this.modifyArticle){
              this.isApcModify = {}
              form.value.article = this.articleToModify
              form.value.apc = this.apcToModify.Nom
              this.isAPC = false
              this.addArticle = false
              this.modifyArticle = false
              this.hideCC()
              this.server.modifyApc(form.value).subscribe()
              setTimeout(()=>{
                this.ngOnInit()
              },100)
            }
            else if (this.addArticle){
              this.alreadyExists = false
              if((this.apcToModify.Articles.split(",")).includes(form.value.article)){
                this.alreadyExists = true
              } else {
                form.value.apc = this.apcToModify.Nom
                this.isAPC = false
                this.addArticle = false
                this.modifyArticle = false
                this.hideCC()
                this.server.addArticleApc(form.value).subscribe()
                setTimeout(()=>{
                  this.ngOnInit()
                },100)
              }
            }
            
          }
          onModifyApc(nom : any){
            this.modifyArticle = true
            this.addArticle = false
            this.isApcModify[nom] = true
            this.articleToModify = nom
          }
          onAddArticle(){
            this.modifyArticle = false
            this.addArticle = true
          } 
          onPosition(article : any){
            this.modifyPosition[article] = true
          }
        }
        