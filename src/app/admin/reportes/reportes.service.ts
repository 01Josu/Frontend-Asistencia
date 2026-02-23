import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface DashboardResumen {
  totalAsistencias: number;
  totalTardanzas: number;
  totalFaltas: number;
  totalJustificadas: number;
}

export interface EstadoResumen {
  estado: string;
  total: number;
}

export interface TardanzaPorMes {
  mes: string;
  total: number;
}

export interface AsistenciaEmpleado {
  idEmpleado: number;
  nombres: string;
  apellidos: string;
  total: number;
  puntuales: number;
  tardanzas: number;
  faltas: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private apiUrl = `${environment.apiUrl}/admin/reportes`;

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    console.error('Error en reporte:', error);
    return throwError(() => new Error('Error en servicio de reportes'));
  }

  dashboard(inicio: string, fin: string): Observable<DashboardResumen> {
    const params = new HttpParams()
      .set('inicio', inicio)
      .set('fin', fin);

    return this.http.get<DashboardResumen>(`${this.apiUrl}/dashboard`, { params })
      .pipe(catchError(this.handleError));
  }

  resumenPorEstado(inicio: string, fin: string): Observable<EstadoResumen[]> {
    const params = new HttpParams()
      .set('inicio', inicio)
      .set('fin', fin);

    return this.http.get<EstadoResumen[]>(`${this.apiUrl}/dashboard/estado`, { params })
      .pipe(catchError(this.handleError));
  }

  tardanzasPorMes(): Observable<TardanzaPorMes[]> {
    return this.http.get<TardanzaPorMes[]>(`${this.apiUrl}/tardanzas/mes`)
      .pipe(catchError(this.handleError));
  }

  asistenciaPorEmpleado(inicio: string, fin: string): Observable<AsistenciaEmpleado[]> {
    const params = new HttpParams()
      .set('inicio', inicio)
      .set('fin', fin);

    return this.http.get<AsistenciaEmpleado[]>(`${this.apiUrl}/empleados`, { params })
      .pipe(catchError(this.handleError));
  }
  
  descargarExcel(inicio: string, fin: string) {
      const params = new HttpParams()
        .set('inicio', inicio)
        .set('fin', fin);

      return this.http.get(`${this.apiUrl}/excel`, {
        params,
        responseType: 'blob'  // MUY IMPORTANTE
      });
  }
}