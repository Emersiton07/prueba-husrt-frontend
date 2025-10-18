import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../constantes';
import { Observable } from 'rxjs';
import { createHeaders, validateToken } from '../../../utilidades';

@Injectable({
  providedIn: 'root'
})
export class SedeService {

  private httpClient = inject(HttpClient);
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
   }

   getToken(){
    return localStorage.getItem('utoken');
   }

   getSedes(): Observable<any []>{    
    return this.httpClient.get<any[]>(`${this.baseUrl}/sedes`, createHeaders());
  }

}
