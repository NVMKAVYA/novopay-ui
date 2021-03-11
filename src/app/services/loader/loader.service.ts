import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderState } from '../../models/Loader';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loaderSubject = new Subject<LoaderState>();
  loaderState = this.loaderSubject.asObservable();
  scrollbarState: any;

  constructor() { }
  
  show() {
    this.loaderSubject.next(<LoaderState>{ show: true });
  }
  hide() {
    this.loaderSubject.next(<LoaderState>{ show: false });
  }

  addScrollbarState(data) {
    this.scrollbarState =  data;
  }

  scrollToTop() {
    this.scrollbarState.directiveRef.scrollTo(0,0);;
  }
 
}
