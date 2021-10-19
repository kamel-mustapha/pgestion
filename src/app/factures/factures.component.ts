import { Component, OnInit } from '@angular/core';
import { FonctionsService } from '../services/fonctions.service';
import { ServerService } from '../services/server.service';
import { HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-factures',
  templateUrl: './factures.component.html',
  styleUrls: ['./factures.component.css']
})
export class FacturesComponent implements OnInit {
  liste : any 
  transactions : any = []
  constructor(private fonction : FonctionsService, private server : ServerService) { }
  
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.server.getTransactions().subscribe(
      value => {this.transactions = value}
      )
    }
    // @HostListener('document:keydown.escape') hideALl(){
    //   this.hideCreer()
    // }
    
    //Créer la facture 
    isCreer : boolean = false
    showCreer(){
      this.isCreer = true
    }
    @HostListener('document:keydown.escape') hideCreer(){
      this.isCreer = false
    }
    onCreer(form : NgForm){
      let du = new Date(form.value.datedu).getTime()
      let au = new Date(form.value.dateau).getTime()
      let liste : any = []
      this.transactions.forEach((transaction : any) => {
        let date = transaction.Add_Date.split("-").reverse().join("-")
        let transacDate = new Date(date).getTime()
        if(transacDate >= du && transacDate <= au && transaction.Client === form.value.client){
          liste.push(transaction)
        }
      });
      console.log(liste)
      this.liste = liste
      
    }
    
  }
  