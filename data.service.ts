import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {}
  async GetGlobalMessages() {
    return await fetch('http://localhost:8080/api/user/global/messages');
  }
}
