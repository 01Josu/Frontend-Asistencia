import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Horario {
  idHorario?: number;
  horaEntrada: string; // se maneja como "HH:mm"
  horaSalida: string;  // se maneja como "HH:mm"
  toleranciaMinutos: number;
  descripcion: string;
  activo?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  private baseUrl = `${environment.apiUrl}/admin/horarios`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Horario[]> {
    return this.http.get<Horario[]>(this.baseUrl);
  }

  crear(horario: Horario): Observable<Horario> {
    return this.http.post<Horario>(this.baseUrl, horario);
  }

  actualizar(id: number, horario: Horario): Observable<Horario> {
    return this.http.put<Horario>(`${this.baseUrl}/${id}`, horario);
  }

  eliminar(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }
}
