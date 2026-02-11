import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Project, ProjectService } from '../../../../core/services/projects/project';
import { AuthService } from '../../../../core/services/auth/auth';

@Component({
  selector: 'app-my-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-projects.html'
})
export class MyProjects {
  private projectService = inject(ProjectService);
  private authService = inject(AuthService);

  editingId = signal<number | null>(null);
  title = signal('');
  imgUrl = signal('');
  desc = signal('');
  projectType = signal<'academico' | 'laboral'>('academico');
  projectRole = signal('');
  repo = signal('');
  demo = signal('');
  techInput = signal('');

  myProjects$ = toObservable(this.authService.currentUser).pipe(
    switchMap(user => {
      if (user) return this.projectService.getMyProjects();
      return of([]);
    })
  );

  openNewModal() {
    this.resetForm();
    const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
    modal?.showModal();
  }

  openEditModal(proj: Project) {
    // Aseguramos que el ID se guarde como número
    this.editingId.set(proj.id ? Number(proj.id) : null);
    this.title.set(proj.title);
    this.imgUrl.set(proj.imageUrl);
    this.desc.set(proj.description);
    this.projectType.set(proj.type);
    this.projectRole.set(proj.role);
    this.repo.set(proj.repoUrl || '');
    this.demo.set(proj.demoUrl || '');
    this.techInput.set(proj.technologies.join(', '));

    const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
    modal?.showModal();
  }

  async saveProject() {
    // Construcción del objeto asegurando tipos
    const projectData: Project = {
      title: this.title(),
      description: this.desc(),
      imageUrl: this.imgUrl(),
      technologies: this.techInput().split(',').map(t => t.trim()).filter(t => t !== ''),
      type: this.projectType(),
      role: this.projectRole(),
      repoUrl: this.repo(),
      demoUrl: this.demo()
    };

    const id = this.editingId();

    if (id !== null) {
      this.projectService.updateProject(id, projectData).subscribe({
        next: () => this.handleSuccess('Proyecto actualizado'),
        error: (err) => console.error('Error al actualizar:', err)
      });
    } else {
      this.projectService.addProject(projectData).subscribe({
        next: () => this.handleSuccess('Proyecto creado'),
        error: (err) => console.error('Error al crear:', err)
      });
    }
  }

  async deleteProject(id: number | undefined) {
    if (!id) return;
    if (confirm('¿Estás seguro de eliminar este proyecto?')) {
      this.projectService.deleteProject(Number(id)).subscribe({
        next: () => alert('🗑️ Proyecto eliminado'),
        error: (err) => console.error(err)
      });
    }
  }

  private handleSuccess(msg: string) {
    alert(`✅ ${msg}`);
    this.resetForm();
    const modal = document.getElementById('my_modal_3') as HTMLDialogElement;
    modal?.close();


    this.myProjects$ = this.projectService.getMyProjects();
  }

  private resetForm() {
    this.editingId.set(null);
    this.title.set('');
    this.imgUrl.set('');
    this.desc.set('');
    this.projectType.set('academico');
    this.projectRole.set('');
    this.repo.set('');
    this.demo.set('');
    this.techInput.set('');
  }
}
