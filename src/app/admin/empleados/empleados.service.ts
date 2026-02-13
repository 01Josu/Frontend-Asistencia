import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Empleado {
  id: number;
  codigoEmpleado: string;
  nombres: string;
  apellidos: string;
  fechaIngreso: string;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  private baseUrl = `${environment.apiUrl}/admin/empleados`;

  constructor(private http: HttpClient) {}

  private headers() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`
      })
    };
  }

  listar(): Observable<Empleado[]> {
    return this.http.get<any[]>(this.baseUrl, this.headers()).pipe(
      map(data =>
        data.map(e => ({
          id: e.idEmpleado,
          codigoEmpleado: e.codigoEmpleado,
          nombres: e.nombres,
          apellidos: e.apellidos,
          fechaIngreso: e.fechaIngreso,
          activo: e.activo
        }))
      )
    );
  }

  obtener(id: number): Observable<Empleado> {
    return this.http.get<any>(`${this.baseUrl}/${id}`, this.headers()).pipe(
      map(e => ({
        id: e.idEmpleado,
        codigoEmpleado: e.codigoEmpleado,
        nombres: e.nombres,
        apellidos: e.apellidos,
        fechaIngreso: e.fechaIngreso,
        activo: e.activo
      }))
    );
  }

  crear(data: {
    codigoEmpleado: string;
    nombres: string;
    apellidos: string;
    fechaIngreso: string;
  }): Observable<Empleado> {
    return this.http.post<any>(this.baseUrl, data, this.headers()).pipe(
      map(e => ({
        id: e.idEmpleado,
        codigoEmpleado: e.codigoEmpleado,
        nombres: e.nombres,
        apellidos: e.apellidos,
        fechaIngreso: e.fechaIngreso,
        activo: e.activo
      }))
    );
  }

  actualizar(
    id: number,
    data: {
      codigoEmpleado: string;
      nombres: string;
      apellidos: string;
      fechaIngreso: string;
      activo: boolean;
    }
  ): Observable<Empleado> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, data, this.headers()).pipe(
      map(e => ({
        id: e.idEmpleado,
        codigoEmpleado: e.codigoEmpleado,
        nombres: e.nombres,
        apellidos: e.apellidos,
        fechaIngreso: e.fechaIngreso,
        activo: e.activo
      }))
    );
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, this.headers());
  }

  // 🔍 Buscar empleados por nombre
  buscarPorNombre(nombre: string): Observable<Empleado[]> {
    return this.http
      .get<any[]>(`${this.baseUrl}/buscar-por-nombre?nombre=${encodeURIComponent(nombre)}`, this.headers())
      .pipe(
        map(data =>
          data.map(e => ({
            id: e.idEmpleado,
            codigoEmpleado: e.codigoEmpleado,
            nombres: e.nombres,
            apellidos: e.apellidos,
            fechaIngreso: e.fechaIngreso,
            activo: e.activo
          }))
        )
      );
  }

}
