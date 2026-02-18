import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HorarioService, Horario } from './horario.service';
import { HorarioEmpleadoService, HorarioEmpleado, HorarioEmpleadoRequest } 
from './horario-empleado.service';

import { EmpleadosService, Empleado } 
from '../empleados/empleados.service';


@Component({
  selector: 'app-horarios',
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class HorariosComponent implements OnInit {

  // ================= HORARIOS =================
  horarios: Horario[] = [];
  nuevoHorario: Horario = { horaEntrada: '', horaSalida: '', toleranciaMinutos: 0, descripcion: '' };
  editarHorario: Horario | null = null;

  // ================= HORARIO EMPLEADO =================
  asignaciones: HorarioEmpleado[] = [];
  empleados: Empleado[] = [];
  asignacionRequest: HorarioEmpleadoRequest = { idEmpleado: 0, idHorario: 0 };

  // ================= TOAST =================
  mensajeToast: string = '';
  mostrarToast: boolean = false;

  // ================= MODAL CONFIRMACIÓN =================
  mostrarConfirmacion: boolean = false;
  mensajeConfirmacion: string = '';
  idHorarioAEliminar: number | null = null;

  constructor(
    private horarioService: HorarioService,
    private horarioEmpleadoService: HorarioEmpleadoService,
    private empleadosService: EmpleadosService
  ) {}

  ngOnInit(): void {
    this.cargarHorarios();
    this.cargarAsignaciones();
    this.cargarEmpleados(); 
  }

  // ================= HORARIOS =================
  cargarHorarios() {
    this.horarioService.listar().subscribe({
      next: data => this.horarios = data,
      error: () => this.mostrarMensaje("Error al cargar los horarios")
    });
  }

  crearHorario() {
    const horarioACrear: Horario = { ...this.nuevoHorario };
    this.horarioService.crear(horarioACrear).subscribe({
      next: data => {
        this.horarios.push(data);
        this.nuevoHorario = { horaEntrada: '', horaSalida: '', toleranciaMinutos: 0, descripcion: '' };
        this.mostrarMensaje("Horario creado correctamente");
      },
      error: err => {
        console.error(err);
        this.mostrarMensaje("Ocurrió un error al crear el horario");
      }
    });
  }

  prepararEditar(horario: Horario) {
    this.editarHorario = { ...horario };
  }

  actualizarHorario() {
    if (!this.editarHorario?.idHorario) return;

    this.horarioService.actualizar(this.editarHorario.idHorario, this.editarHorario).subscribe({
      next: data => {
        const index = this.horarios.findIndex(h => h.idHorario === data.idHorario);
        if (index >= 0) this.horarios[index] = data;
        this.editarHorario = null;
        this.mostrarMensaje("Horario actualizado correctamente");
      },
      error: err => {
        console.error(err);
        this.mostrarMensaje("Error al actualizar el horario");
      }
    });
  }

  // ================= ELIMINAR HORARIO CON MODAL =================
  abrirConfirmacion(id: number) {
    this.idHorarioAEliminar = id;
    this.mensajeConfirmacion = "¿Seguro que deseas eliminar este horario?";
    this.mostrarConfirmacion = true;
  }

  confirmarEliminar() {
    if (this.idHorarioAEliminar === null) return;
    const id = this.idHorarioAEliminar;

    this.horarioService.eliminar(id).subscribe({
      next: (mensaje: string) => {
        if (mensaje === "Horario eliminado correctamente") {
          this.horarios = this.horarios.filter(h => h.idHorario !== id);
        } else if (mensaje === "Horario desactivado porque está en uso") {
          const index = this.horarios.findIndex(h => h.idHorario === id);
          if (index >= 0) this.horarios[index].activo = false;
        }
        this.mostrarMensaje(mensaje);
        this.cancelarEliminar();
      },
      error: err => {
        console.error(err);
        const mensaje = err.error || "Ocurrió un error al eliminar el horario";
        this.mostrarMensaje(mensaje);
        this.cancelarEliminar();
      }
    });
  }

  cancelarEliminar() {
    this.mostrarConfirmacion = false;
    this.idHorarioAEliminar = null;
  }

  // ================= GETTERS Y SETTERS =================
  get horaEntrada() { return this.editarHorario?.horaEntrada ?? this.nuevoHorario.horaEntrada; }
  set horaEntrada(value: string) { if (this.editarHorario) this.editarHorario.horaEntrada = value; else this.nuevoHorario.horaEntrada = value; }

  get horaSalida() { return this.editarHorario?.horaSalida ?? this.nuevoHorario.horaSalida; }
  set horaSalida(value: string) { if (this.editarHorario) this.editarHorario.horaSalida = value; else this.nuevoHorario.horaSalida = value; }

  get toleranciaMinutos() { return this.editarHorario?.toleranciaMinutos ?? this.nuevoHorario.toleranciaMinutos; }
  set toleranciaMinutos(value: number) { if (this.editarHorario) this.editarHorario.toleranciaMinutos = value; else this.nuevoHorario.toleranciaMinutos = value; }

  get descripcion() { return this.editarHorario?.descripcion ?? this.nuevoHorario.descripcion; }
  set descripcion(value: string) { if (this.editarHorario) this.editarHorario.descripcion = value; else this.nuevoHorario.descripcion = value; }

  // ================= HORARIO EMPLEADO =================
  cargarAsignaciones() {
    this.horarioEmpleadoService.listar().subscribe({
      next: data => this.asignaciones = data,
      error: () => this.mostrarMensaje("Error al cargar asignaciones")
    });
  }

  asignarHorario() {
    if (!this.asignacionRequest.idEmpleado || !this.asignacionRequest.idHorario) {
      this.mostrarMensaje("Debe seleccionar empleado y horario");
      return;
    }

    this.horarioEmpleadoService
      .asignar(this.asignacionRequest)
      .subscribe({
        next: data => {
          this.asignaciones.push(data);
          this.asignacionRequest = { idEmpleado: 0, idHorario: 0 };
          this.mostrarMensaje("Horario asignado correctamente");
        },
        error: err => {
          console.error(err);
          this.mostrarMensaje(err.error?.message || "Error al asignar horario");
        }
      });
  }


  cerrarAsignacion(id: number) {
    this.horarioEmpleadoService.cerrar(id).subscribe({
      next: data => {
        const index = this.asignaciones.findIndex(a => a.idHorarioEmpleado === data.idHorarioEmpleado);
        if (index >= 0) this.asignaciones[index] = data;
        this.mostrarMensaje("Asignación cerrada correctamente");
      },
      error: err => {
        console.error(err);
        this.mostrarMensaje("Error al cerrar asignación");
      }
    });
  }

  eliminarAsignacion(id: number) {
    this.horarioEmpleadoService.eliminar(id).subscribe({
      next: response => {
        this.asignaciones = this.asignaciones.filter(a => a.idHorarioEmpleado !== id);
        this.mostrarMensaje(response.message);
      },
      error: err => {
        console.error(err);
        this.mostrarMensaje(err.error?.message || "Error al eliminar asignación");
      }
    });
  }


  // ================= TOAST =================
  mostrarMensaje(mensaje: string, duracion: number = 3000) {
    this.mensajeToast = mensaje;
    this.mostrarToast = true;
    setTimeout(() => this.mostrarToast = false, duracion);
  }

  cerrarToast() {
    this.mostrarToast = false;
  }

  cargarEmpleados() {
    this.empleadosService.listar().subscribe({
      next: data => {
        // Solo empleados activos
        this.empleados = data.filter(e => e.activo);
      },
      error: () => this.mostrarMensaje("Error al cargar empleados")
    });
  }

}
