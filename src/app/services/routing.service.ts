import 'rxjs/add/operator/toPromise';

import {SearchData} from '../classes/searchData';

import { SimpleEventDispatcher, ISimpleEvent } from 'strongly-typed-events';

const Client = require('lc-client');

export interface IRouteService {
    onQueryResult: ISimpleEvent<any>;
    query(searchData: SearchData): Promise<any>;
    queryPeriod(searchDataList: SearchData[]): ISimpleEvent<any>;
}

export class RouteService implements IRouteService {
    private planner;
    private _onQueryResult;
    private _onDataUpdate;
    private _onHttpRequest;
    private _onHttpResponse;
    private _onComplete;

    // example: ['http://belgianrail.linkedconnections.org/']
    constructor(entryPoints: [string]) {
        this.planner = new Client({'entrypoints': entryPoints});
        this._onQueryResult = new SimpleEventDispatcher<any>();
        this._onDataUpdate = new SimpleEventDispatcher<any>();
        this._onHttpRequest = new SimpleEventDispatcher<any>();
        this._onHttpResponse = new SimpleEventDispatcher<any>();
        this._onComplete = new SimpleEventDispatcher<any>();
    }

    private continuousQuery(searchData: SearchData, cb, paths = [], dataCount = 0, httpRequests = 0, httpResponses = 0) {
        const self = this;

        if (!searchData.latestDepartTime) {
            // reject('Invalid latestDepartTime!');
            return console.log('Invalid latestDepartTime!');
        }

        if (searchData.departureTime.valueOf() + 60000 > searchData.latestDepartTime.valueOf()) {
            console.log('Total connections processed ', dataCount);

            return cb(paths);
        }

        this.planner.query(searchData, (resultStream, source) => {
            resultStream.on('result',  (path) => {
                searchData.departureTime = new Date(new Date(path[0].departureTime).getTime() + 60000);
                paths.push(path);
                self.continuousQuery(searchData, cb, paths, dataCount, httpRequests, httpResponses);
                this._onQueryResult.dispatch(path);
            });

            resultStream.on('data', function (connection) {
                // Processed connections
                dataCount++;
                self._onDataUpdate.dispatch(dataCount);
            });

            source.on('request', function (url) {
                // HTTP Request
                httpRequests++;
                self._onHttpRequest.dispatch(httpRequests);
            });

            source.on('response', function (url) {
                // HTTP Respons
                httpResponses++;
                self._onHttpResponse.dispatch(httpResponses);
            });
        });
    }

    query(searchData: SearchData): Promise<any> {
        searchData = searchData.toJSON();
        return new Promise((resolve, reject) => {
            // console.log(searchData);

            this.continuousQuery(searchData, resolve);
        });
    }

    /**
     * Does a query for each of the SearchData objects in searchDataList. promise resolves when all queries resolve.
     * @param searchDataList list of SearchData objects
     */
    public queryPeriod(searchDataList: SearchData[]): ISimpleEvent<any>  {
        const promiselist = [];
        searchDataList.forEach(searchData => {
             promiselist.push(this.query(searchData));
        });
            Promise.all(promiselist).then((res) => {
                this._onComplete.dispatch(res);
            });
        return this._onQueryResult;

        // Test event handlers
        /*this.onDataUpdate.subscribe(dataCount => console.log(`Connections processed: ${dataCount}`));
        this.onHttpRequest.subscribe(httpRequests => console.log(`HTTP Requests: ${httpRequests}`));
        this.onHttpResponse.subscribe(httpResponses => console.log(`HTTP Responses: ${httpResponses}`));
        this.onQueryResult.subscribe(queryResult => console.log(`HTTP Responses: ${queryResult}`));*/
    }

    // This is already handled in a promise
    // might be a nice to have adition for the queryPeriod function.
    public get onQueryResult(): ISimpleEvent<any> {
        return this._onQueryResult.asEvent();
    }

    public get onComplete(): ISimpleEvent<any> {
        return this._onComplete.asEvent();
    }

    public get onDataUpdate(): ISimpleEvent<number> {
        return this._onDataUpdate.asEvent();
    }

    public get onHttpRequest(): ISimpleEvent<number> {
        return this._onHttpRequest.asEvent();
    }

    public get onHttpResponse(): ISimpleEvent<number> {
        return this._onHttpResponse.asEvent();
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}
