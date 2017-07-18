import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';

import { AppComponent } from '../app.component';
import { SearchData } from '../../classes/searchData';
import { Language } from '../../classes/language';

import { Manager } from '../../classes/manager';
import { QoE } from '../../classes/qoe';
import { Route } from '../../classes/route';

@Component({
    selector: 'connections',
    templateUrl: './templates/connections.component.html',
    styleUrls: ['./styles/connections.component.scss']
})

export class Connections implements OnInit {
    loading: any = true;
    searchData: SearchData[];
    error: string;
    language: Language = new Language();
    qoeResults: QoE;
    foundRoutes: any[];
    qualityOfExperienceStyle;
    manager: Manager;
    qoeList: QoE[];

    /* Interactive loading */
    dataCount = 0;
    httpRequests = 0;
    httpResponses = 0;

    constructor(private ref: ChangeDetectorRef) {
        this.manager = new Manager();
        this.qoeList = this.manager.qoeList;
        this.dataCount = this.manager.dataCount;
        this.httpRequests = this.manager.httpRequests;
        this.httpResponses = this.manager.httpResponses;
    }

    ngOnInit(): void {
        // this.searchData = JSON.parse(this.route.params['_value']);
        if (AppComponent.searchData) {
            this.searchData = AppComponent.searchData;
            const onQueryResult = this.manager.getQoE(this.searchData);
            onQueryResult.subscribe(result => {
                this.loading = false;
            });
            this.manager.onDataUpdate.subscribe(e => {
                this.dataCount = this.manager.dataCount;
                this.ref.detectChanges()
            });
            this.manager.onHttpRequest.subscribe(e => {
                this.httpRequests = this.manager.httpRequests;
                this.ref.detectChanges()
            });
            this.manager.onHttpResponse.subscribe(e => {
                this.httpResponses = this.manager.httpResponses;
                this.ref.detectChanges()
            });
        } else {
            AppComponent.setPage(0);
        }
    }

    goBack() {
        AppComponent.goBack();
    }

}
