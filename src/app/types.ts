const db = require('../assets/data/db.json');

export interface Type {
    name: string;
}

export const typesList: Type[] = db.types;

