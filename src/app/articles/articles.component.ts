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
  articles : any[] = [];
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
      //Ajouter un article
      if(this.isAjouter){
        
        let artic = this.articles.find((article)=>{
          
          return form.value.nom.toLowerCase().trim() === article.Nom.toLowerCase().trim()
          
        })
        
        if(artic === undefined){
          this.isDuplicate = false ; 
          this.server.addArticle(form.value).subscribe()
          setTimeout(()=>{
            this.isMultiple = false;
            form.reset()
            this.ngOnInit()
          },5)
        } else {
          this.isDuplicate = true ; 
          this.ngOnInit();
        }
        
        
        // Supprimer un article
      } else if (this.isSupprimer){
        let toDelete :any = [] ;
        this.articles.forEach(article => {
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
          confirmButtonColor: "#227f98",
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
        this.articles.forEach(article =>{
          if(form.value[article.Nom] && form.value[article.Nom] != null ){
            compteur++
          } else if ((form.value.nom ).toLowerCase().trim() === article.Nom){
            duplicate++
          }
        })
        
        if(compteur === 1 && duplicate === 0){
          let obje : any 
          this.isMultiple = false
         
          this.articles.forEach(article =>{
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
  