import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-factures',
  templateUrl: './factures.component.html',
  styleUrls: ['./factures.component.css']
})
export class FacturesComponent implements OnInit {
  
  constructor() { }
  
  ngOnInit(): void {
    window.scrollTo(0, 0);
  }
  
}
