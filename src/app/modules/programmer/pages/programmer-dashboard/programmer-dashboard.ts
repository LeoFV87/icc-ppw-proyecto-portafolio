import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdvisoryService } from '../../../../core/services/advisory/advisory';


declare var Chart: any;
declare var XLSX: any;

@Component({
  selector: 'app-programmer-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './programmer-dashboard.html',
})
export class ProgrammerDashboard implements OnInit {
  private advisoryService = inject(AdvisoryService);

  @ViewChild('statsChart') statsChart!: ElementRef;

  ngOnInit() {
    this.loadChartData();
  }

  loadChartData() {
    // Añadimos tipos (stats: any) y (err: any) para evitar errores de compilación
    this.advisoryService.getStats().subscribe({
      next: (stats: any) => {
        this.createChart(stats);
      },
      error: (err: any) => console.error('Error al cargar estadísticas:', err)
    });
  }

  createChart(stats: any) {
    if (!this.statsChart || !this.statsChart.nativeElement) return;

    // Con el CDN, la variable Chart ya está disponible globalmente
    new Chart(this.statsChart.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Pendientes', 'Aceptadas', 'Rechazadas'],
        datasets: [{
          data: [stats.pending || 0, stats.accepted || 0, stats.rejected || 0],
          backgroundColor: ['#fbbf24', '#10b981', '#ef4444'],
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  exportToExcel() {
    this.advisoryService.getProgrammerAdvisories().subscribe({
      next: (data: any[]) => {
        // XLSX también viene del CDN en el index.html
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Asesorías');
        XLSX.writeFile(workbook, 'Reporte_Asesorias_Programador.xlsx');
      },
      error: (err: any) => alert('Error al generar el reporte')
    });
  }

  contactWhatsApp(advisory: any) {
    const phone = '593962250122';
    const message = `Hola ${advisory.clientName}, soy el programador de la plataforma. He revisado tu solicitud sobre el tema "${advisory.topic}" y me gustaría coordinar los detalles.`;

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  }
}
