import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {

 apiUrl = 'http://localhost/2020/delta/api/index.php/api/' ;
  constructor() { }
}
