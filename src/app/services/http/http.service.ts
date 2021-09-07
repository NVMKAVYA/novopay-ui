import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginCredentials } from 'src/app/models/LoginCredentials';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  public baseUrl = environment.endpoint + '/novobank-core/api/v1';

  constructor(private _http: HttpClient) { }

  public cryptoResource(task: string): any {
    return this._http.get(`${this.baseUrl}/crypt/${task}`);
  }

  public authentication(loginCredentials: LoginCredentials): any {
    return this._http.post(`${this.baseUrl}/authentication`, loginCredentials);
  }

  public officeResource(officeId?: Number, associations?): any {
    let params = new HttpParams();
    params = associations ? params.append('associations', associations) : params;
    return this._http.get(`${this.baseUrl}/offices/${officeId}`, { params: params });
  }

  public configurationResource(id?: String): any {
    return this._http.get(`${this.baseUrl}/configurations/${id ? id : ''}`);
  }

  public logoutResource(): any {
    return this._http.post(`${this.baseUrl}/authentication/logout`, '');
  }

  public getTaskResource(type?: any, name?: any, taskId?: number, status?: any,
    isSubsidiary?: boolean, officeId?: number, userId?: number,
    verticalId?: number, limit?: number): any {
    let params = new HttpParams();
    params = status[0] ? params.append('status', status[0]) : params;
    params = status[1] ? params.append('status', status[1]) : params;
    params = isSubsidiary != null ? params.append('isSubsidiary', isSubsidiary.toString()) : params;
    params = officeId ? params.append('officeId', officeId.toString()) : params;
    params = userId ? params.append('userId', userId.toString()) : params;
    params = verticalId != null ? params.append('verticalId', verticalId.toString()) : params;
    params = limit != null ? params.append('limit', limit.toString()) : params;

    return this._http.get(`${this.baseUrl}/tasks${type ? `/${type}` : ''}` +
      `${name ? `/${name}` : ''}${taskId ? `/${taskId}` : ''}`,
      { params: params });
  }

  public postTaskResource(type?: any, name?: any, taskId?: number, command?: string, data?: any): any {
    let params = new HttpParams();
    params = command ? params.append('command', command) : params;

    return this._http.post(`${this.baseUrl}/tasks${type ? `/${type}` : ''}${name ? `/${name}` : ''}${taskId ? `/${taskId}` : ''}`,
      data, { params: params });
  }

  public codeValuesResource(codeName?: string, context?: string): any {
    let params = new HttpParams();
    params = context ? params.append('context', context) : params;

    return this._http.get(`${this.baseUrl}/codes/codevalues/${codeName ? codeName : ''}`, { params: params });
  }

  public clientTemplateResource(): any {
    let params = new HttpParams();
    params = params.append('staffInSelectedOfficeOnly', 'true');
    params = params.append('loanOfficersOnly', 'true');
    params = params.append('roleName', 'Loan Officer');

    return this._http.get(`${this.baseUrl}/clients/template`, { params: params });
  }

  public getSalutationMatrix(): any {
    return this._http.get(`${this.baseUrl}/salutationmatrix`);
  }

  public getcountryDetailResource(): any {
    let params = new HttpParams();
    params = params.append('limit', '-1');
    return this._http.get(`${this.baseUrl}/countrydetail`, { params: params });
  }

  public getstateDetailResource(countryId?): any {
    let params = new HttpParams();
    params = countryId ? params.append('countryId', countryId) : params;
    params = params.append('limit', '-1');
    return this._http.get(`${this.baseUrl}/statedetail`, { params: params });
  }

  public getdistrictDetailResource(stateId, countryId): any {
    let params = new HttpParams();
    params = params.append('countryId', countryId);
    params = params.append('stateId', stateId);
    params = params.append('limit', '-1');
    return this._http.get(`${this.baseUrl}/districtdetail`, { params: params });
  }

  public getvillageTownCityDetailResource(districtId): any {
    let params = new HttpParams();
    params = params.append('districtId', districtId);
    params = params.append('limit', '-1');
    return this._http.get(`${this.baseUrl}/villagetowncitydetail`, { params: params });
  }

  public employeeResource(staffId?): any {
    return this._http.get(`${this.baseUrl}/staff${staffId ? `/${staffId}` : ''}`);
  }

  public loanProductResource(loanProductId?, resourceType?): any {
    return this._http.get(`${this.baseUrl}/loanproducts${loanProductId ? `/${loanProductId}` : ''}${resourceType ? `/${resourceType}` : ''}`);
  }

  public insuranceProductListResource(): any {
    return this._http.get(`${this.baseUrl}/insuranceproducts`);
  }

  public getclientResource(clientId?, resource?, resourceId?, getDemographicsStatus?): any {
    let params = new HttpParams();
    params = getDemographicsStatus ? params.append('getDemographicsStatus', getDemographicsStatus) : params;
    return this._http.get(`${this.baseUrl}/clients${clientId ? `/${clientId}` : ''}${resource ? `/${resource}` : ''}${resourceId ? `/${resourceId}` : ''}`, { params: params });
  }

  public getClientImage(clientId, size): any {
    return this._http.get(`${this.baseUrl}/clients/${clientId}/images?${size}`, { responseType: 'text' });
  }

  public postClientImage(clientId, data): any {
    return this._http.post(`${this.baseUrl}/clients/${clientId}/images`, data);
  }

  public getDocuments(entityType, entityId): any {
    return this._http.get(`${this.baseUrl}/${entityType}/${entityId}/documents`);
  }

  public postDocuments(entityType, entityId, data): any {
    return this._http.post(`${this.baseUrl}/${entityType}/${entityId}/documents`, data);
  }

  public getUrl(entityType, entityId, documentId, otp, userId): any {
    return `${this.baseUrl}/${entityType}/${entityId}/documents/${documentId}/attachment?tenantIdentifier=${environment.tenantIdentifier}&authKey=${encodeURIComponent(otp)}&userId=${userId}`;
  }

  public getPdf(entityType, entityId, documentId, otp, userId): any {
    return this._http.get(`${this.baseUrl}/${entityType}/${entityId}/documents/${documentId}/attachment?raw=true&base64=true&tenantIdentifier=${environment.tenantIdentifier}&authKey=${encodeURIComponent(otp)}&userId=${userId}`, { responseType: 'text' });
  }

  public runReportsResource(reportSource, genericResultSet?, R_clientId?): any {
    let params = new HttpParams();
    params = genericResultSet ? params.append('genericResultSet', genericResultSet) : params;
    params = R_clientId ? params.append('R_clientId', R_clientId) : params;
    return this._http.get(`${this.baseUrl}/runreports/${reportSource}`, { params: params });
  }

  public globalSearch(query, resource, exactMatch): any {
    let params = new HttpParams();
    params = params.append('query', query);
    params = params.append('resource', resource);
    params = params.append('exactMatch', exactMatch);
    return this._http.get(`${this.baseUrl}/search`, { params: params });
  }

  public clientAccountResource(clientId): any {
    return this._http.get(`${this.baseUrl}/clients/${clientId}/accounts`);
  }

  public addressResource(entityType, entityId, addressId?): any {
    return this._http.get(`${this.baseUrl}/${entityType}/${entityId}/address${addressId ? `/${addressId}` : ''}`)
  }

  public loanAppRefStatusResource(clientId): any {
    return this._http.get(`${this.baseUrl}/loanapplicationreference/${clientId}/appRefStatus`)
  }

  public getProcessResource(processId?, anotherresource?, clientId?, isActive?: string): any {
    let params = new HttpParams();
    params = clientId ? params.append('clientId', clientId) : params;
    params = isActive ? params.append('isActive', isActive) : params;
    return this._http.get(`${this.baseUrl}/processes${processId ? `/${processId}` : ''}${anotherresource ? `/${anotherresource}` : ''}`, { params: params })
  }

  public getloanDisbursementPhaseResource(clientId): any {
    return this._http.get(`${this.baseUrl}/loanapplicationreference/${clientId}/disbursementPhase`)
  }

  public demoAuthConfigDetailResource(officeId): any {
    return this._http.get(`${this.baseUrl}/statedetail/${officeId}/demoauth`)
  }

  public checkerInboxResource(templateResource?, actionName?, entityName?, resourceId?): any {
    let params = new HttpParams();
    params = actionName ? params.append('actionName', actionName) : params;
    params = entityName ? params.append('entityName', entityName) : params;
    params = resourceId ? params.append('resourceId', resourceId) : params;
    return this._http.get(`${this.baseUrl}/makercheckers${templateResource ? `/${templateResource}` : ''}`, { params: params })
  }

  public clientApiResource(clientId): any {
    return this._http.get(`${this.baseUrl}/clients/bcEditDeathContext/${clientId}`)
  }

  public nonWorkflowLoanAccounts(anotherresource?, clientId?): any {
    let params = new HttpParams();
    params = clientId ? params.append('clientId', clientId) : params;
    return this._http.get(`${this.baseUrl}/loanApplications${clientId ? `/${clientId}` : ''}${anotherresource ? `/${anotherresource}` : ''}`, { params: params })
  }

  public clientIdentifierResource(clientIdentityId): any {
    return this._http.get(`${this.baseUrl}/client_identifiers/${clientIdentityId}/documents`);
  }

  public clientIdenfierTemplateResource(clientId): any {
    return this._http.get(`${this.baseUrl}/clients/${clientId}/identifiers/template`);
  }

  public aadharVaultGetApiResource(clientId, aadharRefNum): any {
    let params = new HttpParams();
    params = params.append('clientId', clientId);
    params = params.append('aadharRefNum', aadharRefNum);
    return this._http.get(`${this.baseUrl}/aadharVault/getAadhar`, { params: params });
  }

  public getclientNotesResource(clientId): any {
    return this._http.get(`${this.baseUrl}/clients/${clientId}/notes`);
  }

  public saveClientResource(clientId, resource, data): any {
    return this._http.post(`${this.baseUrl}/clients/${clientId}/${resource}`, data);
  }

  public updateClientResource(clientId, resource, data, resourceId?): any {
    return this._http.put(`${this.baseUrl}/clients/${clientId}/${resource}${resourceId ? `/${resourceId}` : ''}`, data);
  }

  public getGSTResource(requestType, entityType, entityId): any {
    return this._http.get(`${this.baseUrl}/gst/${requestType}/${entityType}/${entityId}`);
  }

  public LoanAccountResource(loanId, associations?): any {
    let params = new HttpParams();
    params = associations ? params.append('associations', associations) : params;
    return this._http.get(`${this.baseUrl}/loans/${loanId}`, { params: params });
  }

  public getRSDAccountResource(appRefId): any {
    return this._http.get(`${this.baseUrl}/rsdaccounts/${appRefId}`);
  }

  public loanAppRefResource(appRefId): any {
    return this._http.get(`${this.baseUrl}/loanapplicationreference/${appRefId}`);
  }

  public getStatusOfMoratorium(loanId): any {
    return this._http.get(`${this.baseUrl}/loans/moratorium/${loanId}`);
  }

  public getRSDTransactionResource(loanId): any {
    let params = new HttpParams();
    params = params.append('loanId', loanId);
    return this._http.get(`${this.baseUrl}/rsdtransaction`, { params: params });
  }

  public guarantorResource(loanId, guarantorId): any {
    return this._http.get(`${this.baseUrl}/loans/${loanId}/guarantors/${guarantorId}`);
  }

  public dataTablesResource(apptable?, datatablename?, entityId?, genericResultSet?): any {
    let params = new HttpParams();
    params = apptable ? params.append('apptable', apptable) : params;
    params = genericResultSet ? params.append('genericResultSet', genericResultSet) : params;
    return this._http.get(`${this.baseUrl}/datatables${datatablename ? `/${datatablename}` : ''}${entityId ? `/${entityId}` : ''}`, { params: params });
  }

  public religionIdForLoanResource(loanId): any {
    return this._http.get(`${this.baseUrl}/loans/${loanId}/religion`);
  }

  public readDataTableByType(type, apprefId?, clientId?): any {
    let params = new HttpParams();
    params = apprefId ? params.append('applicationRefId', apprefId) : params;
    params = clientId ? params.append('clientId', clientId) : params;
    return this._http.get(`${this.baseUrl}/readdatatable/${type}`, { params: params });
  }

  public LoanEndUseCheckResource(loanId): any {
    let params = new HttpParams();
    params = params.append('loanId', loanId);
    return this._http.get(`${this.baseUrl}/endusecheck/${loanId}`, { params: params });
  }

}
