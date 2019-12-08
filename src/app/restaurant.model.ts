import { Rating } from './rating.model';

export class Restaurant {
    constructor(
        public id: number,
        public name: string,
        public address: string,
        public lat: number,
        public long: number,
        public type: string,
        public description: string,
        public ratings: Rating[]
    ) { }
}
