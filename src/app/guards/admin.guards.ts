import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router) {}

  private checkAdmin(): boolean {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');

    if (token && rol === 'ADMIN') {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }

  canActivate(): boolean {
    return this.checkAdmin();
  }

  canActivateChild(): boolean {
    return this.checkAdmin();
  }
}
