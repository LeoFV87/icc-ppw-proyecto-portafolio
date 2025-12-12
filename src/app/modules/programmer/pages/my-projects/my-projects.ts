import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Project, ProjectService } from '../../../../core/services/projects/project';
import { AuthService } from '../../../../core/services/firebase/auth';


@Component({
  selector: 'app-my-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-projects.html'
})
export class MyProjects {
  private projectService = inject(ProjectService);
  private authService = inject(AuthService);

  // Señal para saber si estamos editando (guarda el ID)
  editingId = signal<string | null>(null);

  // Formulario
  title = signal('');
  desc = signal('');
  imgUrl = signal('');
  repo = signal('');
  demo = signal('');
  techInput = signal('');
  projectType = signal<'academico' | 'laboral'>('academico');
  projectRole = signal('');

  myProjects$ = toObservable(this.authService.currentUser).pipe(
    switchMap(user => {
      if (user) return this.projectService.getProjectsByProgrammer(user.uid);
      return of([]);
    })
  );

  // ABRIR MODAL PARA CREAR (Limpio)
  openNewModal() {
    this.resetForm();
    (document.getElementById('my_modal_3') as any).showModal();
  }

  // ABRIR MODAL PARA EDITAR (Carga datos)
  openEditModal(proj: Project) {
    this.editingId.set(proj.id!); // Guardamos el ID que estamos editando

    // Rellenamos el formulario
    this.title.set(proj.title);
    this.desc.set(proj.description);
    this.imgUrl.set(proj.imageUrl);
    this.repo.set(proj.repoUrl || '');
    this.demo.set(proj.demoUrl || '');
    this.techInput.set(proj.technologies.join(', '));
    this.projectType.set(proj.type);
    this.projectRole.set(proj.role);

    (document.getElementById('my_modal_3') as any).showModal();
  }

  async saveProject() {
    const user = this.authService.currentUser();
    if (!user) return;

    if (!this.title() || !this.desc() || !this.imgUrl()) {
      alert('Completa los campos obligatorios');
      return;
    }

    try {
      const projectData: any = {
        programmerId: user.uid,
        title: this.title(),
        description: this.desc(),
        imageUrl: this.imgUrl(),
        repoUrl: this.repo(),
        demoUrl: this.demo(),
        technologies: this.techInput().split(',').map(t => t.trim()).filter(t => t !== ''),
        type: this.projectType(),
        role: this.projectRole() || 'Full Stack'
      };

      // DECISIÓN: ¿CREAR O EDITAR?
      if (this.editingId()) {
        // MODO EDICIÓN
        await this.projectService.updateProject(this.editingId()!, projectData);
        alert('✅ Proyecto actualizado');
      } else {
        // MODO CREACIÓN
        await this.projectService.addProject(projectData);
        alert('✅ Proyecto creado');
      }

      this.resetForm();
    } catch (error) {
      console.error(error);
      alert('Error al guardar');
    }
  }

  async deleteProject(id: string) {
    if (confirm('¿Borrar proyecto?')) {
      await this.projectService.deleteProject(id);
    }
  }

  resetForm() {
    this.editingId.set(null); // Importante: volver a modo creación
    this.title.set('');
    this.desc.set('');
    this.imgUrl.set('');
    this.repo.set('');
    this.demo.set('');
    this.techInput.set('');
    this.projectType.set('academico');
    this.projectRole.set('');
  }
}
