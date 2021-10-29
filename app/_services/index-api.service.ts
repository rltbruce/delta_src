import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantService } from './constant.service';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class IndexApiService {

  constructor(private http: HttpClient, private constantService: ConstantService) { }

  add(controller, data, config) {
    return this.http.post(this.constantService.apiUrl + controller, data, config);
  }

  getAll(controller) {
    return this.http.get<any>(this.constantService.apiUrl + controller + '?type_get=findAll').pipe(map(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
     
      return user;
    }));
  }

  getAllByClient(controller,idcl,parametre) {//DP
    return this.http.get<any>(this.constantService.apiUrl+controller+"?idcl="+idcl+"&?parametre="+parametre);
  }
  getgeneralise(controller,filtre) {
    return this.http.get<any>(this.constantService.apiUrl+controller+filtre);
  }

  get_user(email, pwd) {
    return this.http.get<any>(this.constantService.apiUrl + 'utilisateurs?email=' + email + '&pwd=' + pwd);
  }
}
