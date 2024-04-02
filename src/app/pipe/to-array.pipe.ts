import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'toArray'})

export class toArray implements PipeTransform {

    transform(input_value:number=0){

        if(!input_value) return;

        var array = [];
        
        for (var i = 1; i <= input_value ; i++) {
            array.push(i);
        }

        return array;
    }
}