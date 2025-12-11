import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/firebase/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html'
})
export class Home {

  private authService = inject(AuthService);

  // Exponer las signals al HTML
  currentUser = this.authService.currentUser;
  userProfile = this.authService.userProfile;

  // Lista de proyectos para la sección nueva
  featuredProjects = signal([
    {
      title: 'Fundamentos Web',
      description: 'Estructura sólida y buenas prácticas de desarrollo web moderno.',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=800&auto=format&fit=crop',
      link: 'https://github.com/LeoFV87/icc-ppw-fundamentos',
      tags: ['HTML5', 'CSS3', 'Best Practices']
    },
    {
      title: 'UI Componentes',
      description: 'Biblioteca modular de interfaces reutilizables y atómicas.',
      image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop',
      link: 'https://github.com/LeoFV87/02-ui-componentes',
      tags: ['Angular', 'Atomic Design', 'UI Kit']
    },
    {
      title: 'Estilos & Diseño',
      description: 'Implementación avanzada de estilos y sistemas de diseño responsivo.',
      image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=800&auto=format&fit=crop',
      link: 'https://github.com/LeoFV87/03-ui-componentes-estilos-02',
      tags: ['SASS', 'Animations', 'UX']
    },
    // --- Proyectos Aleatorios para rellenar ---
    {
      title: 'Dashboard Financiero',
      description: 'Visualización de datos en tiempo real para fintechs.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
      link: '#',
      tags: ['ChartJS', 'React', 'Fintech']
    },
    {
      title: 'E-commerce API',
      description: 'Backend robusto para tiendas online de alto tráfico.',
      // CAMBIO AQUÍ: Nueva URL válida
      image: 'https://img.freepik.com/foto-gratis/mostrando-carro-carro-compras-linea-signo-grafico_53876-133967.jpg?semt=ais_hybrid&w=740&q=80',
      link: '#',
      tags: ['Node.js', 'MongoDB', 'API REST']
    },
    {
      title: 'Social App Mobile',
      description: 'Red social enfocada en comunidades de nicho.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
      link: '#',
      tags: ['Flutter', 'Firebase', 'Social']
    }
  ]);
}
