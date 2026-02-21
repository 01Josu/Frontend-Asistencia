import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';
import { ReporteService, DashboardResumen, EstadoResumen, TardanzaPorMes, AsistenciaEmpleado } from '../reportes/reportes.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  // filtros
  inicio = '2026-01-01';
  fin = '2026-01-31';

  // datos
  dashboard?: DashboardResumen;
  estados: EstadoResumen[] = [];
  tardanzas: TardanzaPorMes[] = [];
  empleados: AsistenciaEmpleado[] = [];

  // gráficos
  pieChart?: Chart;
  barChart?: Chart;

  cargando = false;
  error = '';

  constructor(private reporteService: ReporteService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.error = '';

    this.reporteService.dashboard(this.inicio, this.fin).subscribe({
      next: (res: DashboardResumen) => this.dashboard = res,
      error: () => this.error = 'Error cargando dashboard'
    });

    this.reporteService.resumenPorEstado(this.inicio, this.fin).subscribe({
      next: (res: EstadoResumen[]) => {
        this.estados = res;

        const labels = res.map(r => r.estado);
        const data = res.map(r => r.total);

        this.crearPie(labels, data);
      }
    });

    this.reporteService.tardanzasPorMes().subscribe({
      next: (res: TardanzaPorMes[]) => {
        this.tardanzas = res;

        const labels = res.map(r => this.traducirMes(r.mes));
        const data = res.map(r => r.total);

        this.crearBar(labels, data);
      }
    });

    this.reporteService.asistenciaPorEmpleado(this.inicio, this.fin).subscribe({
      next: (res: AsistenciaEmpleado[]) => {
        this.empleados = res;
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  buscar(): void {
    this.cargar();
  }

  // ===========================
  // GRÁFICO PIE
  // ===========================
  crearPie(labels: string[], data: number[]): void {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;

    if (this.pieChart) {
      this.pieChart.destroy();
    }

    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: [
            '#4caf50',
            '#2196f3',
            '#ff9800',
            '#f44336',
            '#9c27b0'
          ]
        }]
      }
    });
  }

  // ===========================
  // GRÁFICO BARRA
  // ===========================
  crearBar(labels: string[], data: number[]): void {
      const ctx = document.getElementById('barChart') as HTMLCanvasElement;

      if (this.barChart) {
        this.barChart.destroy();
      }

      this.barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Tardanzas',
            data,
            backgroundColor: '#2196f3'
          }]
        }
      });
  }

  traducirMes(mes: string): string {
    const meses: any = {
      'January': 'Enero',
      'February': 'Febrero',
      'March': 'Marzo',
      'April': 'Abril',
      'May': 'Mayo',
      'June': 'Junio',
      'July': 'Julio',
      'August': 'Agosto',
      'September': 'Septiembre',
      'October': 'Octubre',
      'November': 'Noviembre',
      'December': 'Diciembre'
    };

    return meses[mes] ?? mes;
  }
}