import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChartsComponent } from './charts/charts.component';
import { ChartsModule } from 'ng2-charts';

import { SidebarComponent } from './sidebar/sidebar.component';
import { ArticlesComponent } from './articles/articles.component';
import { JourneeComponent } from './journee/journee.component';
import { FournisseursComponent } from './fournisseurs/fournisseurs.component';
import { FacturesComponent } from './factures/factures.component';
import { FormsModule } from '@angular/forms';


import { ServerService } from './services/server.service';
import { HttpClientModule } from '@angular/common/http';
import { ReglagesComponent } from './reglages/reglages.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { ClientsComponent } from './clients/clients.component';
import { DetailComponent } from './transactions/detail/detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FonctionsService } from './services/fonctions.service';
import { DataService } from './services/data.service';
@NgModule({
  declarations: [
    AppComponent,
    ChartsComponent,
    SidebarComponent,
    ArticlesComponent,
    JourneeComponent,
    FournisseursComponent,
    FacturesComponent,
    ReglagesComponent,
    TransactionsComponent,
    ClientsComponent,
    DetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule
    
  ],
  providers: [ServerService, FonctionsService, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
