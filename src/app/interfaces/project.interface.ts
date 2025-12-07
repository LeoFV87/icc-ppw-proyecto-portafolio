export interface Project {
  id: string;
  programmerId: string; // Dueño del proyecto
  name: string;
  description: string;
  category: 'academic' | 'work'; // Secciones diferenciadas [cite: 52, 53]
  role: 'Frontend' | 'Backend' | 'Database'; // Tipo de participación
  technologies: string[];
  repoUrl: string;
  demoUrl: string;
}
