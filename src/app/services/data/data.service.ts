import { Injectable } from '@angular/core';

import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private local: LocalStorageService) { }

  public getConfiguration(config):any{
      let globalData = { globalConfiguration : Array };
      return globalData.globalConfiguration = this.local.retrieve('configurations').globalConfiguration.filter(function(element){
                return element.name == config;
        })
  }

  // public sort(array:any, field: string){
  //   array.sort((a: any, b: any) => {
  //       if (a[field] < b[field]) {
  //         return 1;
  //       } else if (a[field] > b[field]) {
  //         return -1;
  //       } else {
  //         return 0;
  //       }
  //   });
  //   return array;
  // }

}
