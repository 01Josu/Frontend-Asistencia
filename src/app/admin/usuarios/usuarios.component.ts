import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService, Usuario } from './usuarios.service';
import { EmpleadosService, Empleado } from '../empleados/empleados.service';


declare var bootstrap: any;

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  empleados: Empleado[] = []; 
  cargando = false;
  guardando = false;

  buscarId?: number;
  buscarTexto?: string;
  buscando = false;

  editando = false;

  mensajeError = '';
  mensajeOk = '';

  form: {
    id?: number;
    idEmpleado?: number;
    usuario?: string;
    password?: string;
    rol?: string;
    activo?: boolean;
  } = {};

  roles = ['USER', 'ADMIN'];

  constructor(
    private usuarioService: UsuarioService,
    private empleadosService: EmpleadosService
  ) {}

  ngOnInit(): void {
    this.listar();
  }

  cargarEmpleados() {
    this.empleadosService.listar().subscribe({
      next: data => {
        // Solo empleados activos
        this.empleados = data.filter(e => e.activo);
      },
      error: () => {
        this.empleados = [];
      }
    });
  }

  listar() {
    this.cargando = true;
    console.time('listarUsuarios');

    this.usuarioService.listar().subscribe({
      next: data => {
        this.usuarios = data;
        this.cargando = false;
        console.timeEnd('listarUsuarios');
      },
      error: () => {
        this.cargando = false;
        console.timeEnd('listarUsuarios');
      }
    });
  }


  nuevo() {
    this.editando = false;
    this.form = {
      idEmpleado: undefined,
      usuario: '',
      password: '',
      rol: 'USER',
      activo: true
    };
    this.mensajeError = '';
    this.mensajeOk = '';
    this.abrirModal();
  }

  editar(u: any) {
    this.editando = true;
    this.form = {
      id: u.idUsuario,
      idEmpleado: u.idEmpleado,
      usuario: u.usuario,
      password: '',
      rol: u.rol,
      activo: u.activo
    };
    this.mensajeError = '';
    this.mensajeOk = '';
    this.abrirModal();
    console.log('Usuario recibido:', u);
  }

  guardar() {
    console.log("Editando:", this.editando);
    console.log("ID actual:", this.form.id);
    this.mensajeError = '';
    this.mensajeOk = '';

    if (!this.form.usuario || (!this.editando && !this.form.password)) {
      this.mensajeError = 'Usuario y contraseña son obligatorios';
      return;
    }

    if (!this.form.rol) {
      this.mensajeError = 'Seleccione un rol';
      return;
    }

    this.guardando = true;

    if (this.editando && this.form.id) {

      const payload: any = {
        usuario: this.form.usuario,
        rol: this.form.rol,
        activo: this.form.activo
      };

      if (this.form.password && this.form.password.trim() !== '') {
        payload.password = this.form.password;
      }

      this.usuarioService.actualizar(this.form.id, payload)
        .subscribe({
          next: () => {
            this.guardando = false;
            this.mensajeOk = 'Usuario actualizado correctamente';
            this.listar();
            setTimeout(() => this.cerrarModal(), 800);
          },
          error: err => {
            this.guardando = false;
            this.mensajeError = err.error?.message || 'Error al actualizar usuario';
          }
        });
    }else {
      this.usuarioService.crear({
        idEmpleado: this.form.idEmpleado,
        usuario: this.form.usuario!,
        password: this.form.password!,
        rol: this.form.rol!
      }).subscribe({
        next: () => {
          this.guardando = false;
          this.mensajeOk = 'Usuario creado correctamente';
          this.listar();
          setTimeout(() => this.cerrarModal(), 800);
        },
        error: err => {
          this.guardando = false;
          this.mensajeError = err.error?.message || 'Error al crear usuario';
        }
      });
    }
  }

  eliminar(u: Usuario) {
    if (!confirm(`¿Eliminar al usuario ${u.usuario}?`)) return;

    this.usuarioService.eliminar(u.idUsuario).subscribe({
      next: (res: any) => {
        // res.message contiene el mensaje del backend
        this.mensajeOk = res?.message || 'Usuario eliminado correctamente';
        this.listar();
      },
      error: (err: any) => {
        this.mensajeError = err.error?.message || 'Error al eliminar usuario';
      }
    });
  }

  abrirModal() {
    if (!this.editando && this.empleados.length === 0) {
      this.cargarEmpleados();
    }

    new bootstrap.Modal(document.getElementById('usuarioModal')).show();
  }

  cerrarModal() {
    bootstrap.Modal.getInstance(document.getElementById('usuarioModal'))?.hide();
  }

  buscarPorNombreLive() {
    if (!this.buscarTexto || this.buscarTexto.trim() === '') {
      this.listar();
      return;
    }

    this.buscando = true;
    this.mensajeError = '';
    this.mensajeOk = '';

    this.usuarioService.buscarPorNombre(this.buscarTexto.trim()).subscribe({
      next: data => {
        this.usuarios = data;
        this.buscando = false;
        this.mensajeOk = data.length > 0 ? '' : 'No se encontraron usuarios';
      },
      error: err => {
        this.buscando = false;
        this.usuarios = [];
        this.mensajeError = err.status === 404 ? 'No se encontraron usuarios' : 'Error al buscar usuarios';
      }
    });
  }


  buscarUsuario() {
    if (this.buscarId && this.buscarId > 0) {
      this.buscando = true;
      this.usuarioService.obtener(this.buscarId).subscribe({
        next: data => {
          this.usuarios = [data];
          this.buscando = false;
          this.mensajeOk = 'Usuario encontrado';
        },
        error: err => {
          this.buscando = false;
          this.usuarios = [];
          this.mensajeError = err.status === 404 ? 'Usuario no encontrado' : 'Error al buscar usuario';
        }
      });
    } else {
      this.buscarPorNombreLive();
    }
  }

  limpiarBusqueda() {
    this.buscarId = undefined;
    this.buscarTexto = '';
    this.mensajeError = '';
    this.mensajeOk = '';
    this.listar();
  }
}
