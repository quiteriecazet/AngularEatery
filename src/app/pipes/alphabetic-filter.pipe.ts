import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'alphabeticFilter'})

export class AlphabeticFilterPipe implements PipeTransform {
    transform(data: string[]): string[] {
       data = data.filter(function(elem, index, self) {
           return index === self.indexOf(elem);
       });
       return data;
    }
}
