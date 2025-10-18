import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../../constantes';
import { firstValueFrom, Observable } from 'rxjs';
import { createHeaders, validateToken } from '../../../utilidades';

@Injectable({
  providedIn: 'root'
})
export class EquipoService {
  private httpClient = inject(HttpClient);
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_URL;
  }

  getToken() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('utoken');
    }
    return null;
  }


  getTeams(): Observable<any[]> {
    if (typeof window === 'undefined') {
      // SSR: devuelve observable vacío
      return new Observable(observer => {
        observer.next([]);
        observer.complete();
      });
    }
    return this.httpClient.get<any[]>(`${this.baseUrl}/equipos`, createHeaders());
  }


  addTeam(equipoData: any): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/addequipo`, equipoData, createHeaders());
  }

  editTeam(id: number, equipoData: any) {
    return this.httpClient.put<any>(
      `${this.baseUrl}/actequipo/${id}`,
      equipoData,
      createHeaders()
    );
  }
}
