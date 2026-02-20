import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LoginService } from '../services/login.service'; // 👈 ajusta ruta si es necesario

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  logout(): void {
    this.loginService.logout().subscribe({
      next: () => {
        localStorage.removeItem('token'); // mejor que clear()
        this.router.navigate(['/']);
      },
      error: () => {
        localStorage.removeItem('token');
        this.router.navigate(['/']);
      }
    });
  }
}