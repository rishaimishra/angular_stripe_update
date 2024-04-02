import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchString'
})
export class SearchStringPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    // items=items.map((el)=>{
    //   return el.name;
    // });
    // console.log(items,'items');
   // console.log(searchText , 'searchText');
    if(!items) return [];
    if(!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter( it => {
        return it.name.toLowerCase().includes(searchText);
    });
  }

}
