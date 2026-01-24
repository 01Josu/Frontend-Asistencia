import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  usuario: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  mensaje: string;
  token?: string;
  idUsuario?: number;
  idEmpleado?: number;
  nombres?: string;
  apellidos?: string;
  rol?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl = `${environment.apiUrl}/login`;

  constructor(private http: HttpClient) {}

  login(usuario: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.baseUrl, { usuario, password });
  }
}
