import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Usuario {
  id: number;
  usuario: string;
  rol: string;
  activo: boolean;
  idEmpleado?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl = `${environment.apiUrl}/admin/usuarios`;

  constructor(private http: HttpClient) {}

  private headers() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`
      })
    };
  }

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl, this.headers());
  }

  obtener(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`, this.headers());
  }

  crear(data: {
    idEmpleado?: number;
    usuario: string;
    password: string;
    rol: string;
  }): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl, data, this.headers());
  }

  actualizar(id: number, data: {
    usuario?: string;
    password?: string;
    rol?: string;
    activo?: boolean;
  }): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/${id}`, data, this.headers());
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, this.headers());
  }

  buscarPorNombre(nombre: string): Observable<Usuario[]> {
    return this.http
      .get<Usuario[]>(`${this.baseUrl}/buscar-por-nombre?nombre=${encodeURIComponent(nombre)}`, this.headers());
  }
}
