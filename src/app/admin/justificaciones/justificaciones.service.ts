import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class JustificacionesService {

  private apiUrl = `${environment.apiUrl}/admin/justificaciones`;

  constructor(private http: HttpClient) {}

  listar(page: number, size: number): Observable<PageResponse<any>> {
    return this.http.get<PageResponse<any>>(
      `${this.apiUrl}?page=${page}&size=${size}`
    );
  }

  aprobar(id: number, aprobado: boolean): Observable<string> {
    return this.http.put(
      `${this.apiUrl}/${id}/aprobar?aprobado=${aprobado}`,
      {},
      { responseType: 'text' }
    );
  }
}