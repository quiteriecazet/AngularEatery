import { Rating } from './rating.model';

export class Restaurant {
    constructor(
    id: number,
    name: string,
    address: string,
    lat: number,
    long: number,
    type: string,
    description: string,
    ratings: Rating[]
    ) {}
}
