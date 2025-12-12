import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, query, where, collectionData, deleteDoc, doc, updateDoc } from '@angular/fire/firestore'; // <--- Agregamos updateDoc
import { Observable } from 'rxjs';

export interface Project {
  id?: string;
  programmerId: string;
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
  private firestore = inject(Firestore);

  // 1. Crear
  async addProject(project: Project) {
    const ref = collection(this.firestore, 'projects');
    return addDoc(ref, project);
  }

  // 2. Leer
  getProjectsByProgrammer(uid: string): Observable<Project[]> {
    const ref = collection(this.firestore, 'projects');
    const q = query(ref, where('programmerId', '==', uid));
    return collectionData(q, { idField: 'id' }) as Observable<Project[]>;
  }

  // 3. Editar (NUEVO)
  async updateProject(id: string, project: Partial<Project>) {
    const ref = doc(this.firestore, `projects/${id}`);
    return updateDoc(ref, project);
  }

  // 4. Eliminar
  async deleteProject(projectId: string) {
    const ref = doc(this.firestore, `projects/${projectId}`);
    return deleteDoc(ref);
  }
}
