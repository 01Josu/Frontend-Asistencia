import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JustificacionesService } from './justificaciones.service';

@Component({
  selector: 'app-justificaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './justificaciones.component.html',
  styleUrls: ['./justificaciones.component.css']
})
export class JustificacionesComponent implements OnInit {

  justificaciones: any[] = [];

  // 🔹 Paginación
  totalPages = 0;
  totalElements = 0;
  currentPage = 0;
  pageSize = 15;

  // 🔹 Estados
  cargando = false;
  error = '';

  constructor(private justificacionesService: JustificacionesService) {}

  ngOnInit(): void {
    this.cargarJustificaciones();
  }

  cargarJustificaciones(): void {
    this.cargando = true;
    this.error = '';

    this.justificacionesService
      .listar(this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          this.justificaciones = response.content; // 👈 ahora usamos content
          this.totalPages = response.totalPages;
          this.totalElements = response.totalElements;
          this.cargando = false;
        },
        error: (err) => {
          console.error(err);
          this.error = 'Error al cargar las justificaciones';
          this.cargando = false;
        }
      });
  }

  cambiarPagina(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.cargarJustificaciones();
    }
  }

  cambiarEstado(j: any, estado: boolean): void {
    this.justificacionesService.aprobar(j.id, estado).subscribe({
      next: () => {
        // Actualiza solo el estado sin recargar todo
        j.aprobado = estado;
      },
      error: (err) => {
        console.error(err);
        alert('Error al actualizar la justificación');
      }
    });
  }
}