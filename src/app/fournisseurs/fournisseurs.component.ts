import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ServerService } from '../services/server.service';
import Swal from 'sweetalert2'
@Component({
  selector: 'app-fournisseurs',
  templateUrl: './fournisseurs.component.html',
  styleUrls: ['./fournisseurs.component.css']
})
export class FournisseursComponent implements OnInit, OnDestroy {
  
  constructor(private server : ServerService) { }
  isModify : boolean = false;
  isDuplicate : boolean = false;
  isAdd : boolean = false;
  compteur = 0;
  fournisseurs : any[] = [];
  subscribe : any
  villes = [
    {ville : "..."},
    {ville : "1. Adrar"},
    {ville : "2. Chlef"},
    {ville : "3. Lagouat"},
    {ville : "4. Oum El Bouaghi"},
    {ville : "5. Batna"},
    {ville : "6. Béjaïa"},
    {ville : "7. Biskra"},
    {ville : "8. Béchar"},
    {ville : "9. Blida"},
    {ville : "10. Bouira"},
    {ville : "11. Tamanrasset"},
    {ville : "12. Tébessa"},
    {ville : "13. Tlemcen"},
    {ville : "14. Tiaret"},
    {ville : "15. Tizi Ouzou"},
    {ville : "16. Alger"},
    {ville : "17. Djelfa"},
    {ville : "18. Jijel"},
    {ville : "19. Sétif"},
    {ville : "20. Saïda"},
    {ville : "21. Skikda"},
    {ville : "22. Sidi Bel Abbès"},
    {ville : "23. Annaba"},
    {ville : "24. Guelma"},
    {ville : "25. Constantine"},
    {ville : "26. Médéa"},
    {ville : "27. Mostaganem"},
    {ville : "28. M'Sila"},
    {ville : "29. Mascara"},
    {ville : "30. Ouargla"},
    {ville : "31. Oran"},
    {ville : "32. El Bayadh"},
    {ville : "33. Illizi"},
    {ville : "34. Bordj Bou Arreridj"},
    {ville : "35. Boumerdès"},
    {ville : "36. El Tarf"},
    {ville : "37. Tindouf"},
    {ville : "38. Tissemsilt"},
    {ville : "39. El Oued *"},
    {ville : "40. Khenchela"},
    {ville : "41. Souk Ahras"},
    {ville : "42. Tipaza"},
    {ville : "43. Mila"},
    {ville : "44. Aïn Defla"},
    {ville : "45. Naâma"},
    {ville : "46. Aïn Témouchent"},
    {ville : "47. Ghardaïa"},
    {ville : "48. Relizane"},
    {ville : "49. Timimoun"},
    {ville : "50. Bordj Badji Mokhtar"},
    {ville : "51. Ouled Djellal"},
    {ville : "52. Béni Abbès"},
    {ville : "53. In Salah"},
    {ville : "54. In Guezzam"},
    {ville : "55. Touggourt"},
    {ville : "56. Djanet"},
    {ville : "57. El M'Ghair"},
    {ville : "58. El Meniaa"}    
  ]
  
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.subscribe = this.server.getFournisseurs().subscribe(
      values => {this.fournisseurs = values}
      )
    }
  ngOnDestroy(){
    this.subscribe.unsubscribe()
  }
    showAdd(){
      this.compteur++;
      if(this.compteur === 1){
        this.isAdd = true;
      } else {
        this.hideAdd()
      }
    }
    hideAdd(){
      this.isAdd = false
      this.compteur = 0
    }
    onModify(){
    }
    
    
    onSubmit(form : NgForm){
      this.fournisseurs.forEach((fournisseur)=>{
        if(form.value.nom.toLowerCase().trim() === fournisseur.Nom.toLowerCase().trim()){
          this.isDuplicate = true;
        } else {
          this.isDuplicate = false;
        }
      })
      if(!this.isDuplicate){
        this.server.addFournisseur(form.value).subscribe(
          value => {console.log(value)}
          )
          this.hideAdd()
          setTimeout(()=>{
            // location.reload();
            this.ngOnInit()
          },5)
        }
      };
      
      onDelete(nom : any){
        
        let nomObj = {
          nom : nom
        }
        let nomJson = JSON.stringify(nomObj); 
        
        Swal.fire({
          title: 'Confirmation',
          text: 'Etes vous sûr de vouloir supprmier ce fournisseur ?',
          confirmButtonColor: "#227f98",
          confirmButtonText: 'Oui',
          cancelButtonText : 'Non',
          showCancelButton : true ,
          
        }).then(value=>{
          if(value['isConfirmed']){
            this.server.deleteFournisseur(nomJson).subscribe()
            setTimeout(()=>{
              this.ngOnInit()
            },10)
          }
        })
      }
    }