// Node modules
import { Component, EventEmitter, OnInit, Output, ViewChild, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MdInputContainer } from '@angular/material';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

// Custom modules
import { TripscoreService } from '../../services/tripscore.service';

@Component ({
    selector: 'companylist',
    templateUrl: './templates/companyList.component.html',
    styleUrls: ['./styles/companyList.component.scss']
})

/**
 * A form input field with autocomplete for stations
 */
export class CompanyList implements OnInit {
    selectedCompany = null;
    companyCtrl: FormControl;
    inputValue: string;
    tripscoreService: TripscoreService;
    qresults: any[];
    companies: any[];
    lastQuery: string;
    flag: boolean;
    imgstart = 'assets/img/';

    @ViewChild(MdInputContainer) mdInput: MdInputContainer;
    @Output() notifyParent: EventEmitter<any> = new EventEmitter();
    @Output() valueChange: EventEmitter<any> = new EventEmitter();

    /**
     * Constructor, load in all stations
     * @param http iRail service instance
     */
    constructor(tripscoreService: TripscoreService) {
        this.tripscoreService = tripscoreService;
        this.companyCtrl = new FormControl();
        this.flag=true;
        this.companyCtrl.valueChanges.subscribe((val) => {
            this.querycompanies(val);
        });
    }

    /**
     * Component initialised
     */
    ngOnInit() { }

    /**
     * filter stations on value change
     * @param val the value to filter on
     */
    filterCompanies(val: string) {
        this.inputValue = val;
        if (val) {
            const filtered = this.companies.filter(s => s.name.toLowerCase().indexOf(val.toLowerCase()) >= 0);
            if (filtered.length > 0 && filtered[0].name.toLowerCase()===val.toLowerCase()) {
                this.selectedCompany = filtered[0];
            }
            else {
                this.selectedCompany=null;
            }
            this.valueChange.emit(this.selectedCompany);
            this.qresults = filtered;
            return filtered;
        }
        return this.qresults;
    }

    /**
     * This function queries the tripscore API for stations
     * @param val the search query (station name)
     */
    querycompanies(val: string) {
        this.inputValue = val;

        if(this.selectedCompany){
            this.selectedCompany=null;
            this.valueChange.emit(this.selectedCompany);
        }

        if (this.qresults) {
            this.qresults.forEach(res => {
                if (res.name === val) {
                    this.lastQuery = val;
                }
            });
        }
        if (this.lastQuery && val.toLowerCase().indexOf(this.lastQuery.toLowerCase()) === 0) {
            // We already queried using this filter
            // Filter this locally.
            return this.filterCompanies(val);
        }

        this.tripscoreService.queryCompanies(val).then((res) => {
            this.qresults = res.companies;
            this.companies = this.qresults;
            // If there is a next page keep getting results from server
            if (!res.nextPage) {
                this.lastQuery = val;
            }
        });
    }

    /**
     * Grabs focus
     */
    focus() {
        this.mdInput._focusInput();
    }

    /**
     * Requests parent to focus the next field
     */
    requestFocusNext() {
        this.notifyParent.emit(null);
    }
}
