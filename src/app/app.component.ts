import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderState } from 'src/app/models/Loader';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/app/services/loader/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  loading : boolean = false;
  private loaderSubscription : Subscription;

  constructor(private loader : LoaderService, private router: Router) { }

  ngOnInit(): void {
    // this.router.navigate(['']);
    this.loaderSubscription = this.loader.loaderState.subscribe((state: LoaderState) => {
          this.loading = state.show;
    });
  }

  ngOnDestroy() {
    this.loaderSubscription.unsubscribe();
  }

}
