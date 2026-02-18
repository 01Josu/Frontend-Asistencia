import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


export interface Empleado {
  idEmpleado?: number;
  codigoEmpleado?: string;
  nombres?: string;     // <-- antes 'nombre'
  apellidos?: string;   // <-- antes 'apellido'
  activo?: boolean;
  fechaIngreso?: string;
}

export interface HorarioEmpleado {
  idHorarioEmpleado?: number;
  empleado: Empleado;
  horario: {
    idHorario: number;
    horaEntrada: string;
    horaSalida: string;
    descripcion: string;
    toleranciaMinutos: number;
    activo?: boolean;
  };
  fechaInicio: string; // "YYYY-MM-DD"
  fechaFin?: string;   // "YYYY-MM-DD"
}

export interface HorarioEmpleadoRequest {
  idEmpleado: number;
  idHorario: number;
}

@Injectable({
  providedIn: 'root'
})
export class HorarioEmpleadoService {

  private baseUrl = `${environment.apiUrl}/admin/horario-empleado`;

  constructor(private http: HttpClient) {}

  listar(): Observable<HorarioEmpleado[]> {
    return this.http.get<HorarioEmpleado[]>(this.baseUrl);
  }

  asignar(data: any): Observable<HorarioEmpleado> {
    return this.http.post<HorarioEmpleado>(this.baseUrl, data);
  }

  cerrar(id: number): Observable<HorarioEmpleado> {
    return this.http.put<HorarioEmpleado>(`${this.baseUrl}/${id}/cerrar`, {});
  }

  eliminar(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

}
