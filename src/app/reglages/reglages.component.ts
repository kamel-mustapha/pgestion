import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ServerService } from '../services/server.service';

@Component({
  selector: 'app-reglages',
  templateUrl: './reglages.component.html',
  styleUrls: ['./reglages.component.css']
})
export class ReglagesComponent implements OnInit, OnDestroy {
  utilisateur : any = {};
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

  constructor(private server : ServerService) { }
  
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.subscribe = this.server.getUtilisateur().subscribe(
      (value) => {this.utilisateur = value}
    )
  }
  ngOnDestroy(){
    this.subscribe.unsubscribe()
  }
  onSubmit(form : NgForm){
    
    this.server.addUtilisateur(form.value).subscribe(
      (value) => {this.utilisateur = value}
    )
  }
}
