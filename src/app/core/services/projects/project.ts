import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Project {
  id?: number;
  title: string;
  description: string;
  imageUrl: string;
  repoUrl?: string;
  demoUrl?: string;
  technologies: string[];
  type: 'academico' | 'laboral';
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/projects'; // URL del backend


  getMyProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/my-projects`);
  }

  // Para el Dashboard del Programador (Usa el Token)
  getProjectsByProgrammerId(id: number): Observable<Project[]> {
  return this.http.get<Project[]>(`${this.apiUrl}/programmer/${id}`);
  }

  // 1. Crear
  addProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  // 2. Leer proyectos del programador (El Backend filtra por el Token)
  getProjectsByProgrammer(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/my-projects`);
  }

  // 3. Editar
  updateProject(id: number, project: Partial<Project>): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, project);
  }

  // 4. Eliminar
  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
