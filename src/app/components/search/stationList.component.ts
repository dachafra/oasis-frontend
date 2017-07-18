import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { IRailService } from '../../services/iRail.service';


@Component({
    selector: 'stationlist',
    templateUrl: './templates/stationList.component.html',
    styleUrls: ['./styles/stationList.component.scss']
})

export class StationList implements OnInit {
    selectedStation = null;
    stationCtrl: FormControl;
    filteredStations: any;
    stations: any;

    constructor(iRailService: IRailService) {
        iRailService.getAllStations().then((data) => {
            this.stations = (data as any).station;
        }).catch(e => console.log(e));
        this.stationCtrl = new FormControl();
        this.filteredStations = this.stationCtrl.valueChanges
            .startWith(null)
            .map(station => this.filterStations(station));
        // this.stationCtrl.valueChanges.toPromise().then(val => console.log(val)).catch(e => console.log(e))
    }

    ngOnInit() {
        // Component initialised
    }

    filterStations(val: string) {
        if (val) {
            const filtered = this.stations.filter(s => s.standardname.toLowerCase().indexOf(val.toLowerCase()) === 0);
            if (filtered.length > 0 &&
                    filtered[0].standardname.toLowerCase().indexOf(val.toLowerCase()) === 0) {
                this.selectedStation = filtered[0];
                // console.log(this.selectedStation);
            }
            return filtered;
        }
        return this.stations;
    }
}
