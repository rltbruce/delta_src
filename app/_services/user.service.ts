import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models/user';
import { ConstantService } from './constant.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient, private constantService: ConstantService) { }

  getAll() {
    return this.http.get<User[]>(`${this.constantService.apiUrl}utilisateurs?type_get=findAll`);
  }

  register(user: User) {
    return this.http.post(`${this.constantService.apiUrl}/utilisateurs/register`, user);
  }

  delete(id: number) {
    return this.http.delete(`${this.constantService.apiUrl}/utilisateurs/${id}`);
  }
}