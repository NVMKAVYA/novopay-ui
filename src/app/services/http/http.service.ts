import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginCredentials } from 'src/app/models/LoginCredentials';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  public baseUrl = environment.endpoint + '/novobank-core/api/v1';

  constructor( private _http : HttpClient ) { }

  public cryptoResource(task : string):any {
    let response = this._http.get( `${this.baseUrl}/crypt/${task}`);
    return response;
  }

  public authentication(loginCredentials : LoginCredentials):any {
    let response = this._http.post( `${this.baseUrl}/authentication`, loginCredentials);
    return response;
  }

  public officeResource(officeId?: Number,associations?):any {
    let params = new HttpParams();
    params = associations ? params.append('associations',associations) : params;
    let response = this._http.get( `${this.baseUrl}/offices/${officeId}`, { params: params });
    return response;
  }

  public configurationResource(id?: String):any {
    let response = this._http.get( `${this.baseUrl}/configurations/${id ? id : ''}`);
    return response;
  }

  public logoutResource():any{
    let response = this._http.post( `${this.baseUrl}/authentication/logout`, '');
    return response;
  }

  public getTaskResource(type?: any ,name? :any ,taskId?: number, status?: any,
                        isSubsidiary?: boolean,officeId?: number,userId?:number,
                        verticalId?:number, limit?:number):any{
    let params = new HttpParams();
    params = status[0] ? params.append('status', status[0] ) : params;
    params = status[1] ? params.append('status', status[1] ) : params;
    params = isSubsidiary != null ? params.append('isSubsidiary', isSubsidiary.toString() ) : params;
    params = officeId ? params.append('officeId', officeId.toString() ) : params;
    params = userId ? params.append('userId', userId.toString() ) : params;
    params = verticalId != null ? params.append('verticalId', verticalId.toString()) : params;
    params = limit != null ? params.append('limit', limit.toString()) : params;
    
    let response = this._http.get( `${this.baseUrl}/tasks${type ? `/${type}` : ''}` +
                                   `${name ? `/${name}` : ''}${taskId ? `/${taskId}` : ''}`,
                                   { params: params });
    return response;
  }

  public postTaskResource(type?: any ,name? :any ,taskId?: number,command?: string,
                         data?:any):any{
    let params = new HttpParams();
    params = command ? params.append('command', command ) : params;

    let response = this._http.post( `${this.baseUrl}/tasks${type ? `/${type}` : ''}${name ? `/${name}` : ''}${taskId ? `/${taskId}` : ''}`, 
                                  data, { params: params });
    return response;
  }

  public codeValuesResource(codeName ?: string,context ?:string):any {
    let params = new HttpParams();
    params = context ? params.append('context', context ) : params;

    let response = this._http.get( `${this.baseUrl}/codes/codevalues/${codeName ? codeName : ''}`, { params: params });
    return response;
  }

  public clientTemplateResource():any {
    let params = new HttpParams();
    params = params.append('staffInSelectedOfficeOnly', 'true' );
    params = params.append('loanOfficersOnly', 'true');
    params = params.append('roleName','Loan Officer');
    let response = this._http.get( `${this.baseUrl}/clients/template`,{ params: params });
    return response;
  }

  public getSalutationMatrix():any {
    let response = this._http.get( `${this.baseUrl}/salutationmatrix`);
    return response;
  }

  public getcountryDetailResource():any {
    let params = new HttpParams();
    params = params.append('limit', '-1' );
    let response = this._http.get( `${this.baseUrl}/countrydetail`,{ params: params });
    return response;
  }

  public getstateDetailResource(countryId):any {
    let params = new HttpParams();
    params = params.append('countryId', countryId );
    params = params.append('limit', '-1' );
    let response = this._http.get( `${this.baseUrl}/statedetail`,{ params: params });
    return response;
  }

  public getdistrictDetailResource(stateId, countryId):any {
    let params = new HttpParams();
    params = params.append('countryId', countryId );
    params = params.append('stateId', stateId );
    params = params.append('limit', '-1' );
    let response = this._http.get( `${this.baseUrl}/districtdetail`,{ params: params });
    return response;
  }

  public getvillageTownCityDetailResource(districtId):any {
    let params = new HttpParams();
    params = params.append('districtId', districtId );
    params = params.append('limit', '-1' );
    let response = this._http.get( `${this.baseUrl}/villagetowncitydetail`,{ params: params });
    return response;
  }

  public employeeResource(staffId?):any {
    let response = this._http.get( `${this.baseUrl}/staff${staffId ? `/${staffId}` : ''}`);
    return response;
  }
}
