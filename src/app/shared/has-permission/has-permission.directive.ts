import { Directive, TemplateRef, ViewContainerRef, Input } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";

@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private auth: AuthService
  ) { }

  @Input("hasPermission") set checkPermission(permission: any) {
    if (this.auth.hasPermission(permission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

}
