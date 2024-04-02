import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'strLimit'})

export class StringLimit implements PipeTransform {

    transform(input_value:string,limit:number,more:string='...'){

        if(!input_value) return;

        if(input_value.length >= limit){
            var result = input_value.slice(0,limit);
            return `${result} ${more}`;
        }else{
            return input_value;
        }
        
    }
}