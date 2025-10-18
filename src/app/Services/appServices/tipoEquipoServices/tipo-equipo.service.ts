import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../constantes';
import { HttpClient } from '@angular/common/http';
import { createHeaders} from '../../../utilidades';

@Injectable({
  providedIn: 'root'
})
export class TipoEquipoService {

  private httpClient = inject(HttpClient);
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
   }

   getToken(){
    return localStorage.getItem('utoken');
   }

   getTiposEquipo(): Observable<any []>{    
    return this.httpClient.get<any[]>(`${this.baseUrl}/tiposequipo`, createHeaders());
  }
}
