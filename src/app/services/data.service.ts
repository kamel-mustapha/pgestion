import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ServerService } from './server.service';
@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  constructor(private server : ServerService) { }
  
  //*********************************APC PART*************************/
  apcToFind = new Subject()
  getApcByNom(nom : string){
    
    this.server.getAPC().subscribe(
      value => {
        let apc : any = value.find((apc : any) => {
          return apc.Nom === nom
        })
        
        let obje = {
          Nom : apc.Nom,
          Articles : apc.Articles.split(","),
          Quantite : apc.Quantite.split(","),
          Reste : apc.Reste.split(","),
          Prix : apc.Prix.split(","),
          TVA : apc.TVA.split(","),
          Add_Date : apc.Add_Date
        } 
        this.apcToFind.next(obje)
      } )
    }
    
    
    
    
    
    
    //*****************************************************************/
    
    
    
    
    
    
    
    
    
    
    
  }
  