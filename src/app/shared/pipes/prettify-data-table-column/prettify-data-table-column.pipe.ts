import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'prettifyDataTableColumn'
})
export class PrettifyDataTableColumnPipe implements PipeTransform {

  transform(input: string): string {
    let retVal;
    let prettifyColumnName = (input, split) => {
      var temp = input.split(split);
      if (temp[1] && temp[1] != "") {
        return temp[1];
      } else {
        return temp[0];
      }
    }

    if (input.indexOf("_cd_") > 0) {
      retVal = prettifyColumnName(input, "_cd_");
    } else if (input.indexOf("_cv_") > 0) {
      retVal = prettifyColumnName(input, "_cv_");
    } else if (input.indexOf("_cd") > 0) {
      retVal = prettifyColumnName(input, "_cd");
    } else if (input.indexOf("_cv") > 0) {
      retVal = prettifyColumnName(input, "_cv");
    } else {
      retVal = input;
    }
    retVal = retVal.split('_').join(' ');
    retVal = retVal.match(/[A-Z][a-z]+/g) ? retVal.match(/[A-Z][a-z]+/g).join(' ') : retVal
    return retVal;
  }

}
