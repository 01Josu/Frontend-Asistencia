import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MarcarAsistenciaResponse {
  success: boolean;
  mensaje: string;
  fecha?: string;
  hora?: string;
  tipo?: 'ENTRADA' | 'SALIDA';
}

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  private baseUrl = `${environment.apiUrl}/asistencias`;

  constructor(private http: HttpClient) {}

  marcarEntrada(payload: {
    idUsuario: number;
    latitud: number;
    longitud: number;
  }): Observable<MarcarAsistenciaResponse> {
    return this.http.post<MarcarAsistenciaResponse>(
      `${this.baseUrl}/entrada`,
      payload
    );
  }

  marcarSalida(payload: {
    idUsuario: number;
    latitud: number;
    longitud: number;
  }): Observable<MarcarAsistenciaResponse> {
    return this.http.post<MarcarAsistenciaResponse>(
      `${this.baseUrl}/salida`,
      payload
    );
  }
}
