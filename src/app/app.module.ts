/* Imports */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

/* Routing */
import { AppRoutingModule } from './app-routing.module';

/* Components */
import { AppComponent } from './components/app.component';
import { StationList } from './components/search/stationList.component';
import { ConnectionQuery } from './components/search/connectionQuery.component';
import { TravelTime } from './components/search/travelTime.component';
import { TravelDate } from './components/search/travelDate.component';
import { Connections } from './components/connections/connections.component';

/* Services */
import { IRailService } from './services/iRail.service'

@NgModule({
  declarations: [
    AppComponent,
    StationList,
    ConnectionQuery,
    TravelTime,
    TravelDate,
    Connections
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [ IRailService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
