import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para el buscador
import { RouterModule } from '@angular/router';

interface Programmer {
  id: string;
  name: string;
  role: string;
  image: string;
  skills: string[];
  description: string;
}

@Component({
  selector: 'app-explorar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './explorar.html'

})
export class Explorar {
  searchTerm = signal('');

  // Datos de ejemplo (Mock Data) para ver la interfaz lista
  programmers = signal<Programmer[]>([
    {
      id: '1',
      name: 'Leo Vasconez',
      role: 'Full Stack Developer',
      image: 'https://ui-avatars.com/api/?name=Leo+Vasconez&background=0D8ABC&color=fff&size=400',
      skills: ['Angular', 'Firebase', 'Node.js', 'Tailwind'],
      description: 'Arquitecto de software enfocado en escalabilidad y backend robusto.'
    },
    {
      id: '2',
      name: 'Michelle Morocho',
      role: 'Frontend Engineer',
      image: 'https://ui-avatars.com/api/?name=Michelle+Morocho&background=D926A9&color=fff&size=400',
      skills: ['UX/UI', 'React', 'Angular', 'Figma'],
      description: 'Especialista en interfaces interactivas y accesibilidad web.'
    },
    {
      id: '3',
      name: 'Dev Example',
      role: 'Backend Developer',
      image: 'https://ui-avatars.com/api/?name=Dev+Example&background=random&size=400',
      skills: ['Python', 'Django', 'PostgreSQL'],
      description: 'Experto en APIs RESTful y seguridad de datos.'
    }
  ]);

  // Filtro simple
  get filteredProgrammers() {
    return this.programmers().filter(p =>
      p.name.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
      p.skills.some(s => s.toLowerCase().includes(this.searchTerm().toLowerCase()))
    );
  }
}
