import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2'
import { ServerService } from '../services/server.service';
@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit, OnDestroy {
  articles : any = [];
  isDuplicate : boolean = false;
  isAjouter : boolean = false;
  isModifier : boolean = false;
  isSupprimer: boolean = false;
  isMultiple : boolean = false;
  subscribe : any
  constructor(private server : ServerService) { }
  
  ngOnInit(): void {
    window.scrollTo(0, 0);
    
    this.subscribe = this.server.getArticles().subscribe( 
      values => {this.articles = values}
      )
    }
    ngOnDestroy(){
      this.subscribe.unsubscribe()
    }

    onSubmit(form : NgForm){
      this.isDuplicate = false 
      this.isMultiple = false
      this.isMultiple = false
      //Ajouter un article
      if(this.isAjouter){
        
        let artic = this.articles.find((article:any)=>{
          
          return form.value.nom.toLowerCase().trim() === article.Nom
          
        })
        
        if(artic === undefined){
          this.server.addArticle(form.value).subscribe(
            value => {this.articles = value}
          )
          form.reset()
          
        } else {
          this.isDuplicate = true ; 
        }
        
        
        // Supprimer un article
      } else if (this.isSupprimer){
        let toDelete :any = [] ;
        this.articles.forEach((article:any) => {
          if(form.value[article.Nom]){
            toDelete.push(article.Nom)
          }
        });
        let toDrop = {
          nom : toDelete
        }
        Swal.fire({
          title: 'Confirmation',
          text: 'Etes vous sûr de vouloir supprmier les articles séléctionnés ?',
          confirmButtonColor: "#bc0000",
          confirmButtonText: 'Oui',
          cancelButtonText : 'Non',
          showCancelButton : true ,
          
          
        }).then(value=>{
          if(value['isConfirmed']){
            this.server.deleteArticle(toDrop).subscribe();
            setTimeout(()=>{
              this.ngOnInit();
            },10)
          }
        });

        //Modification d'un article 
      } else if(this.isModifier){
        let compteur = 0
        let duplicate = 0
        this.articles.forEach((article:any) =>{
          if(form.value[article.Nom] && form.value[article.Nom] != null ){
            compteur++
          } else if ((form.value.nom ).toLowerCase().trim() === article.Nom){
            duplicate++
          }
        })
        
        if(compteur === 1 && duplicate === 0){
          let obje : any 
          this.articles.forEach((article:any) =>{
            if(form.value[article.Nom] && form.value[article.Nom] != null ){
              obje = {
                toModify : article.Nom,
                nom : form.value.nom,
                peremDate : form.value.peremDate,
                prix : form.value.prix,
                tva : form.value.tva,
                ucomp : form.value.ucomp
              }
            }
          })
          this.server.updateArticle(obje).subscribe()
          setTimeout(()=>{
            this.ngOnInit()
          },10)
        } else if (compteur > 1){
          this.isMultiple = true
        }
      }
    };
    


    ajouter(){
      this.isAjouter = true ;
      this.isSupprimer = false;
      this.isModifier = false;
    };
    modifier(){
      this.isAjouter = false ;
      this.isSupprimer = false;
      this.isModifier = true;
    };
    supprimer(){
      this.isAjouter = false ;
      this.isSupprimer = true;
      this.isModifier = false;
    }
    
    
    
  }
  