// Custom modules
import { Recent } from './recent';

export class Options {
    language = 'en_GB';
    qoeParameters = {
        avgDelay: 90,
        avgChangesAmount: 85,
        avgChangeTime: 85,
        delayConsistency: 90,
        avgTravelTime: 65,
        numberOfRoutesWithinHour: 70,
        numberOfMissedConnections: 85,
        price: 78
    };
    recents: Recent[] = [];

    /**
     * Saves the options and some userData
     */
    public save(): boolean {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('Options', JSON.stringify(this));
            // console.log(JSON.stringify(this));
            return true;
        }
        return false;
    }

    /**
     * Loads the options and some userData
     */
    public load(): boolean {
        if (typeof localStorage !== 'undefined') {
            const options: Options = JSON.parse(localStorage.getItem('Options'));
            if (options) {
                this.language = options.language;
                if (options.qoeParameters) {
                    this.qoeParameters = options.qoeParameters;
                }
                if (options.recents) {
                    for (const recent of options.recents) {
                        this.recents.push(Recent.fromJson(recent));
                    }
                    console.log(this.recents);
                }
            }
            // console.log(JSON.stringify(this));
            return true;
        }
        return false;
    }

    /**
     * Adds a recent search query
     * @param val the value of the recent searchQuery
     */
    public addRecent(val: Recent) {
        this.recents.push(val);
        if (this.recents.length > 4) {
            this.recents.shift();
        }
    }
}