import { Component, OnInit } from '@angular/core';

import { HttpService } from 'src/app/services/http/http.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Constants } from 'src/app/models/Constants';
import { ToastrService } from 'ngx-toastr';
import { SearchPipe } from 'src/app/pipes/search/search.pipe';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [ SearchPipe, OrderPipe ]
})
export class DashboardComponent implements OnInit {

  taskDataOfStaff :any;
  pulledMytasks : boolean = false;
  unAssignTasksForStaff : any = [];
  dateFormat : any = Constants.dateFormat1;
  showColumn : boolean = false;
  p: number = 1;
  q: number = 1;
  selectAllStaffTasks : boolean = false;
  filterMytasks : string;
  taskDataOfOthers : any;
  pulledOthertasks : boolean = false;
  selectAllOtherTasks : boolean = false;
  filterOthertasks : string;
  assignTasksForStaff : any = [];
  pulledAdvSearch : boolean = false;

  constructor(private http: HttpService,private auth : AuthService, private toastr: ToastrService,
    private search: SearchPipe, private order : OrderPipe) { }

  ngOnInit(): void {
    this.showColumn = this.auth.userData.roles[0].name.indexOf("Central Ops") > -1 ? true : false;
  }

  getTasksforStaff(reload: boolean, bulk: boolean,showMessage : boolean) :any{
    if(!this.taskDataOfStaff || reload){
     this.http.getTaskResource('staff',this.auth.userData.staffId,null,["assigned","suspended"]).subscribe( data =>{
          this.taskDataOfStaff = data;
          if(this.showColumn) {
            this.taskDataOfStaff.forEach(element => {
              let splitTaskDesc = element.taskDescription.split("->");
              element.groupName = splitTaskDesc.length > 0 ? splitTaskDesc[1] : ' ';
              element.vertical = element.isSubsidiary ? 'IBL' : 'IDFC'
            }); 
            this.taskDataOfStaff = this.order.transform(this.taskDataOfStaff, ['etaDate','groupName', 'id'], true);
          }else{
            this.taskDataOfStaff = this.order.transform(this.taskDataOfStaff, 'etaDate', true);
          }
          if(reload){
            if(showMessage){
              this.unAssignTasksForStaff = [];
              this.selectAllStaffTasks = false;
              this.filterMytasks = null;
              this.toastr.success( bulk ? 'Tasks have been unassigned' : 'Task has been unassigned', 'Success');
            }
          }else{
            this.pulledMytasks = !this.pulledMytasks;
          }
      });
    }else{
      this.pulledMytasks = !this.pulledMytasks;
    }
  }

  getOtherTasks(reload: boolean, bulk: boolean, showMessage : boolean) :any{
    if(!this.taskDataOfOthers || reload){
     this.http.getTaskResource('role',this.auth.userData.roles[0].name,null,
                  ["unassigned","suspended"],this.showColumn,this.auth.userData.officeId, 
                  this.auth.userData.userId, this.auth.isSubsidiary,25).subscribe( data =>{
          this.taskDataOfOthers = data.pageItems;
          if(this.showColumn) {
            this.taskDataOfOthers.forEach(element => {
              let splitTaskDesc = element.taskDescription.split("->");
              element.groupName = splitTaskDesc.length > 0 ? splitTaskDesc[1] : ' ';
            }); 
            this.taskDataOfOthers = this.order.transform(this.taskDataOfOthers, ['etaDate','groupName', 'id'], true);
          }else{
            this.taskDataOfOthers = this.order.transform(this.taskDataOfOthers, 'etaDate', true);
          }
          if(reload){
            if(showMessage){
              this.assignTasksForStaff = [];
              this.selectAllOtherTasks = false;
              this.filterOthertasks = null;
              this.toastr.success( bulk ? 'Tasks have been assigned' : 'Task has been assigned', 'Success');
            }
          }else{
            this.pulledOthertasks = !this.pulledOthertasks;
          }
     });
    }else{
      this.pulledOthertasks = !this.pulledOthertasks;
    }
  }

  toggleSelection(taskId : Number, assign : boolean){
    if(assign){
      let index = this.assignTasksForStaff.indexOf(taskId);
      if (index > -1) {
        this.assignTasksForStaff.splice(index , 1);
      }else{
        this.assignTasksForStaff.push(taskId);
      }
    }else{
      let index = this.unAssignTasksForStaff.indexOf(taskId);
      if (index > -1) {
        this.unAssignTasksForStaff.splice(index , 1);
      }else{
        this.unAssignTasksForStaff.push(taskId);
      }
    }
  }

  unAssign(taskId) {
    this.http.postTaskResource( null, null,taskId,'unassign',{}).subscribe( data=>{
      this.getTasksforStaff(true,false,true);
      this.getOtherTasks(true,false,false);
    });
  };

  assign(taskId) {
    this.http.postTaskResource( null, null,taskId,'reassign',{staffId : this.auth.userData.staffId}).subscribe( data=>{
      this.getOtherTasks(true,false, true);
      this.getTasksforStaff(true,false, false);
    });
  };

  bulkTaskUnAssign(){
    let bulkTasksUnAssign = [];
    this.unAssignTasksForStaff.forEach(element => {
      bulkTasksUnAssign.push({taskId: element, staffId: this.auth.userData.staffId })
    });
    this.http.postTaskResource("bulkunassign",null,null,null,bulkTasksUnAssign).subscribe(data =>{
      this.getTasksforStaff(true,bulkTasksUnAssign.length > 1 ? true : false,true);
      this.getOtherTasks(true,false,false)
    });
  }

  bulkTaskAssign(){
    let bulkTasksAssign = [];
    this.assignTasksForStaff.forEach(element => {
      bulkTasksAssign.push({taskId: element, staffId: this.auth.userData.staffId })
    });
    this.http.postTaskResource("bulkreassign",null,null,null,bulkTasksAssign).subscribe(data =>{
      this.getOtherTasks(true,bulkTasksAssign.length > 1 ? true : false,true);
      this.getTasksforStaff(true,false,false)
    });
  }

  bulkSelection (assign: boolean) {
    if(assign){
      if(this.selectAllOtherTasks) {
        let filteredTasks = this.search.transform(this.taskDataOfOthers, this.filterOthertasks);
        filteredTasks.forEach(element => {
          this.assignTasksForStaff.push(element.id);
        });
      }else{
        this.assignTasksForStaff = [];
      } 
    }else{
      if( this.selectAllStaffTasks ) {
        let filteredTasks = this.search.transform(this.taskDataOfStaff, this.filterMytasks);
        filteredTasks.forEach(element => {
          this.unAssignTasksForStaff.push(element.id);
        });
      }else{
        this.unAssignTasksForStaff = [];
      }
    }
  };

}
