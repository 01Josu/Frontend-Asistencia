import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface JustificacionPendiente {
  idAsistencia: number;
  fecha: string;
  horaSalidaReal: string;
  horaSalidaEsperada: string;
}

export interface JustificacionRequest {
  idAsistencia: number;
  motivo: string;
}

@Injectable({
  providedIn: 'root'
})
export class JustificacionService {

  private baseUrl = `${environment.apiUrl}/justificacion`;

  constructor(private http: HttpClient) {}

  registrarJustificacion(
    payload: JustificacionRequest
  ): Observable<string> {
    return this.http.post(
      this.baseUrl,
      payload,
      { responseType: 'text' }
    );
  }

  obtenerPendientes(idUsuario: number): Observable<JustificacionPendiente[]> {
    return this.http.get<JustificacionPendiente[]>(
      `${this.baseUrl}/pendientes/${idUsuario}`
    );
  }
}
