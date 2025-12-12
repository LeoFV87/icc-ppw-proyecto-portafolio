import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // <--- IMPORTANTE: Necesario para el filtro
import { Project, ProjectService } from '../../../../core/services/projects/project';

@Component({
  selector: 'app-portfolio-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './portfolio-detail.html' // Asegúrate de que coincida con tu nombre de archivo
})
export class PortfolioDetail implements OnInit { // El error decía que tu clase se llama PortfolioDetail
  private route = inject(ActivatedRoute);
  private firestore = inject(Firestore);
  private projectService = inject(ProjectService);

  programmerId = signal('');
  programmerData = signal<any>(null);

  // === ESTAS SON LAS VARIABLES QUE FALTABAN ===
  academicProjects$!: Observable<Project[]>;
  laboralProjects$!: Observable<Project[]>;

  async ngOnInit() {
    // 1. Obtener ID de la URL
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.programmerId.set(id);

      // 2. Cargar datos del usuario (Nombre, Foto, Bio, Redes)
      const userDoc = await getDoc(doc(this.firestore, `users/${id}`));
      if (userDoc.exists()) {
        this.programmerData.set(userDoc.data());
      }

      // 3. Cargar proyectos y separarlos por tipo
      const allProjects$ = this.projectService.getProjectsByProgrammer(id);

      // Filtramos los académicos
      this.academicProjects$ = allProjects$.pipe(
        map(projects => projects.filter(p => p.type === 'academico'))
      );

      // Filtramos los laborales
      this.laboralProjects$ = allProjects$.pipe(
        map(projects => projects.filter(p => p.type === 'laboral'))
      );
    }
  }
}
