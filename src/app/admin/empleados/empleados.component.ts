import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmpleadosService, Empleado } from './empleados.service';

declare var bootstrap: any;

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {

  empleados: Empleado[] = [];
  cargando = false;
  guardando = false;
  
  buscarId?: number;
  buscando = false;

  buscarTexto?: string;

  editando = false;

  mensajeError = '';
  mensajeOk = '';

  form: {
    id?: number;
    codigoEmpleado?: string;
    nombres?: string;
    apellidos?: string;
    fechaIngreso?: string;
    activo?: boolean;
  } = {};

  // 🔒 Regex de validaciones
  private soloLetrasRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;

  constructor(private empleadosService: EmpleadosService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.cargando = true;
    this.empleadosService.listar().subscribe({
      next: data => {
        this.empleados = data;
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  nuevo() {
    this.editando = false;
    this.form = {
      codigoEmpleado: '',
      nombres: '',
      apellidos: '',
      fechaIngreso: ''
    };
    this.mensajeError = '';
    this.mensajeOk = '';
    this.abrirModal();
  }

  editar(emp: Empleado) {
    this.editando = true;
    this.form = {
      id: emp.id,
      codigoEmpleado: emp.codigoEmpleado,
      nombres: emp.nombres,
      apellidos: emp.apellidos,
      fechaIngreso: emp.fechaIngreso,
      activo: emp.activo
    };
    this.mensajeError = '';
    this.mensajeOk = '';
    this.abrirModal();
  }

  guardar() {
    this.mensajeError = '';
    this.mensajeOk = '';

    if (!this.form.codigoEmpleado || !this.form.nombres || !this.form.apellidos || !this.form.fechaIngreso) {
      this.mensajeError = 'Todos los campos son obligatorios';
      return;
    }

    if (!this.form.codigoEmpleado.startsWith('EMP')) {
      this.mensajeError = 'El código del empleado debe iniciar con EMP';
      return;
    }

    if (!this.soloLetrasRegex.test(this.form.nombres)) {
      this.mensajeError = 'Los nombres solo pueden contener letras';
      return;
    }

    if (!this.soloLetrasRegex.test(this.form.apellidos)) {
      this.mensajeError = 'Los apellidos solo pueden contener letras';
      return;
    }

    this.guardando = true;

    if (this.editando && this.form.id != null) {
      this.empleadosService.actualizar(this.form.id, {
        codigoEmpleado: this.form.codigoEmpleado,
        nombres: this.form.nombres,
        apellidos: this.form.apellidos,
        fechaIngreso: this.form.fechaIngreso,
        activo: this.form.activo ?? true
      }).subscribe({
        next: () => {
          this.guardando = false;
          this.mensajeOk = 'Empleado actualizado correctamente';
          this.listar();
          setTimeout(() => this.cerrarModal(), 800);
        },
        error: err => {
          this.guardando = false;
          this.mensajeError = err.error?.message || 'Error al actualizar empleado';
        }
      });

    } 

    else {
      this.empleadosService.crear({
        codigoEmpleado: this.form.codigoEmpleado,
        nombres: this.form.nombres,
        apellidos: this.form.apellidos,
        fechaIngreso: this.form.fechaIngreso
      }).subscribe({
        next: () => {
          this.guardando = false;
          this.mensajeOk = 'Empleado creado correctamente';
          this.listar();
          setTimeout(() => this.cerrarModal(), 800);
        },
        error: err => {
          this.guardando = false;
          this.mensajeError = err.error?.message || 'Error al crear empleado';
        }
      });
    }
  }

  eliminar(emp: Empleado) {
    if (!confirm(`¿Eliminar al empleado ${emp.nombres} ${emp.apellidos}?`)) return;

    this.empleadosService.eliminar(emp.id).subscribe({
      next: () => {
        this.mensajeOk = 'Empleado desactivado correctamente';
        this.listar();
      },
      error: err => {
        this.mensajeError = err.error?.message || 'Error al eliminar empleado';
      }
    });
  }

  abrirModal() {
    new bootstrap.Modal(document.getElementById('empleadoModal')).show();
  }

  cerrarModal() {
    bootstrap.Modal.getInstance(
      document.getElementById('empleadoModal')
    )?.hide();
  }

  buscarEmpleado() {
    this.mensajeError = '';
    this.mensajeOk = '';
    this.buscando = true;

    // Buscar por ID si se ingresó un número válido
    if (this.buscarId && this.buscarId > 0) {
      this.empleadosService.obtener(this.buscarId).subscribe({
        next: emp => {
          this.empleados = [emp]; // Mostrar solo el resultado
          this.buscando = false;
          this.mensajeOk = 'Empleado encontrado';
        },
        error: err => {
          this.buscando = false;
          this.empleados = [];
          this.mensajeError =
            err.status === 404
              ? 'Empleado no encontrado'
              : 'Error al buscar empleado';
        }
      });
    } 
    // Buscar por nombre si se ingresó texto
    else if (this.buscarTexto && this.buscarTexto.trim().length > 0) {
      this.empleadosService.buscarPorNombre(this.buscarTexto.trim()).subscribe({
        next: data => {
          this.empleados = data;
          this.buscando = false;
          this.mensajeOk = data.length > 0 ? 'Empleados encontrados' : 'No se encontraron empleados';
        },
        error: err => {
          this.buscando = false;
          this.empleados = [];
          this.mensajeError = 'Error al buscar empleados';
        }
      });
    } 
    else {
      this.buscando = false;
      this.mensajeError = 'Ingrese un ID o un nombre para buscar';
    }
  }


  limpiarBusqueda() {
    this.buscarId = undefined;
    this.buscarTexto = '';
    this.mensajeError = '';
    this.mensajeOk = '';
    this.listar();
  }

  buscarPorNombreLive() {
    // si está vacío, listamos todos
    if (!this.buscarTexto || this.buscarTexto.trim() === '') {
      this.listar();
      return;
    }

    this.buscando = true;
    this.mensajeError = '';
    this.mensajeOk = '';

    this.empleadosService.buscarPorNombre(this.buscarTexto.trim()).subscribe({
      next: data => {
        this.empleados = data;
        this.buscando = false;
        this.mensajeOk = data.length > 0 ? '' : 'No se encontraron empleados';
      },
      error: err => {
        this.buscando = false;
        this.empleados = [];
        this.mensajeError = 'Error al buscar empleados';
      }
    });
  }

}
