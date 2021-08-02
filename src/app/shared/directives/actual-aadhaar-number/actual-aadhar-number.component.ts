import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';

export interface modal {
  actualAadhaarNumber: string;
}
@Component({
  selector: 'app-actual-aadhaar-number',
  templateUrl: './actual-aadhar-number.component.html',
  styleUrls: ['./actual-aadhar-number.component.css']
})
export class ActualAadhaarNumberComponent extends SimpleModalComponent<modal, boolean> implements modal, OnInit {
  actualAadhaarNumber: string;

  constructor() {
    super();
  }


  ngOnInit(): void {
  }

  confirm() {
    this.close();
  }
}
