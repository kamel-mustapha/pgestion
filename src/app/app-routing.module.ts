import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartsComponent } from './charts/charts.component';
import { ArticlesComponent } from './articles/articles.component';
import { JourneeComponent } from './journee/journee.component';
import { FournisseursComponent } from './fournisseurs/fournisseurs.component';
import { FacturesComponent } from './factures/factures.component';
import { ReglagesComponent } from './reglages/reglages.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { ClientsComponent } from './clients/clients.component';
import { DetailComponent } from './transactions/detail/detail.component';


const routes: Routes = [
  {path : '' , component : ChartsComponent},
  {path : 'charts', component : ChartsComponent},
  {path : 'articles', component : ArticlesComponent},
  {path : 'journee', component : JourneeComponent},
  {path : 'fournisseurs', component : FournisseursComponent},
  {path : 'factures', component : FacturesComponent},
  {path : 'reglages', component : ReglagesComponent},
  {path : 'transactions', component : TransactionsComponent},
  {path : 'transactions/:id', component : DetailComponent},
  {path : 'clients', component : ClientsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
