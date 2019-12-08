import { Rating } from './rating.model';
const db = require('../assets/data/db.json');

export interface Restaurant {
    id: number;
    name: string;
    address: string;
    lat: number;
    long: number;
    type: string;
    description: string;
    ratings: Rating[];
}

export const restaurantsList: Restaurant[] = db.restaurants;

