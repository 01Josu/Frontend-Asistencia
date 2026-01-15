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

export interface Asistencia {
  idAsistencia: number;
  fecha: string;
  horaEntradaReal: string | null;
  horaSalidaReal: string | null;
  estadoAsistencia: string;
}

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {

  private baseUrl = `${environment.apiUrl}/asistencias`;

  constructor(private http: HttpClient) {}


  marcarEntrada(idUsuario: number): Observable<MarcarAsistenciaResponse> {
    return this.http.post<MarcarAsistenciaResponse>(
      `${this.baseUrl}/entrada`,
      { idUsuario }
    );
  }

  marcarSalida(idUsuario: number): Observable<MarcarAsistenciaResponse> {
    return this.http.post<MarcarAsistenciaResponse>(
      `${this.baseUrl}/salida`,
      { idUsuario }
    );
  }

  listarPorEmpleado(idEmpleado: number): Observable<Asistencia[]> {
    return this.http.get<Asistencia[]>(
      `${this.baseUrl}/empleado/${idEmpleado}`
    );
  }
}
