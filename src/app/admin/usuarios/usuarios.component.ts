import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService, Usuario } from './usuarios.service';

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

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.listar();
  }

  listar() {
    this.cargando = true;
    this.usuarioService.listar().subscribe({
      next: data => {
        this.usuarios = data;
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  nuevo() {
    this.editando = false;
    this.form = {
      usuario: '',
      password: '',
      rol: 'USER',
      activo: true
    };
    this.mensajeError = '';
    this.mensajeOk = '';
    this.abrirModal();
  }

  editar(u: Usuario) {
    this.editando = true;
    this.form = {
      id: u.id,
      idEmpleado: u.idEmpleado,
      usuario: u.usuario,
      rol: u.rol,
      activo: u.activo
    };
    this.mensajeError = '';
    this.mensajeOk = '';
    this.abrirModal();
  }

  guardar() {
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
      this.usuarioService.actualizar(this.form.id, {
        usuario: this.form.usuario,
        password: this.form.password,
        rol: this.form.rol,
        activo: this.form.activo
      }).subscribe({
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
    } else {
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

    this.usuarioService.eliminar(u.id).subscribe({
      next: () => {
        this.mensajeOk = 'Usuario eliminado correctamente';
        this.listar();
      },
      error: err => {
        this.mensajeError = err.error?.message || 'Error al eliminar usuario';
      }
    });
  }

  abrirModal() {
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
      error: () => {
        this.buscando = false;
        this.usuarios = [];
        this.mensajeError = 'Error al buscar usuarios';
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
