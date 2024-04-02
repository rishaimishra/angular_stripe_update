import {Pipe} from '@angular/core';
import {PipeTransform} from '@angular/core';

@Pipe({name: 'CapitalizePipe'})
export class CapitalizePipe implements PipeTransform {

    transform(value:string) {
        
        if (!value) return value;
        
        return value[0].toUpperCase() + value.substr(1).toLowerCase();
    }
}