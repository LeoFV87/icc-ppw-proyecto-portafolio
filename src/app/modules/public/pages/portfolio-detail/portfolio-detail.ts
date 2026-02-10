import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Project, ProjectService } from '../../../../core/services/projects/project';

@Component({
  selector: 'app-portfolio-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './portfolio-detail.html'
})
export class PortfolioDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private projectService = inject(ProjectService);

  programmerId = signal<number | null>(null);
  programmerData = signal<any>(null);

  academicProjects$!: Observable<Project[]>;
  laboralProjects$!: Observable<Project[]>;

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');

    // Verificamos que el ID exista y sea numérico
    if (idParam && !isNaN(Number(idParam))) {
      const id = Number(idParam);
      this.programmerId.set(id);

      // Cargar datos personales del programador
      this.http.get(`http://localhost:8080/api/users/${id}`).subscribe({
        next: (data) => this.programmerData.set(data),
        error: (err) => console.error('Error al cargar datos del programador', err)
      });

      // Cargar y filtrar proyectos
      const allProjects$ = this.projectService.getProjectsByProgrammerId(id);

      this.academicProjects$ = allProjects$.pipe(
        map((projects: Project[]) => projects.filter(p => p.type === 'academico'))
      );

      this.laboralProjects$ = allProjects$.pipe(
        map((projects: Project[]) => projects.filter(p => p.type === 'laboral'))
      );
    } else {
      console.warn('ID de programador no válido en la URL');
    }
  }
}
