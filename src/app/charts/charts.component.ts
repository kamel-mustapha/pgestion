import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  user : any = {}
  constructor(private server : ServerService) { }
  barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  barChartLabels = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet','Août','Septembre', 'Octobre', 'Novembre', 'Décembre'];
  barChartLegend = true;
  barChartData = [
    {data: [65, 59, 80, 81, 56, 55, 40, 28 , 19 ,10 ,55 ,88], label: 'Entrées'},
    {data: [28, 48, 40, 19, 86, 27, 120,65, 59, 80, 81, 56], label: 'Sorties'}
  ];
  pieChartData = [1800, 1000, 500, 850];
  pieChartLabels = ['Pain', 'Carotte', 'Tomate', 'Oignon'];
  
  
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.server.getUtilisateur().subscribe(
      value => {this.user = value}
    )
    setTimeout(()=>{
     
    },100)
  }
  
}
