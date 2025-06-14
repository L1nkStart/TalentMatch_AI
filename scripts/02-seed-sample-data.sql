-- Insert sample candidates for testing
INSERT INTO candidates (
  email, full_name, phone, department, education_level, hierarchical_level,
  skills, executive_summary, relevance_score, resume_url
) VALUES 
(
  'juan.perez@email.com',
  'Juan Pérez García',
  '+34 600 123 456',
  'Desarrollo de Software',
  'Ingeniería Informática',
  'Senior',
  ARRAY['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS'],
  'Desarrollador Full Stack con 5 años de experiencia en tecnologías web modernas. Especializado en React y Node.js con conocimientos sólidos en arquitectura de microservicios.',
  85,
  '/resumes/juan-perez.pdf'
),
(
  'maria.rodriguez@email.com',
  'María Rodríguez López',
  '+34 600 789 012',
  'Marketing Digital',
  'Máster en Marketing',
  'Manager',
  ARRAY['SEO', 'SEM', 'Google Analytics', 'Social Media', 'Content Marketing'],
  'Especialista en Marketing Digital con 7 años de experiencia. Experta en estrategias SEO/SEM y gestión de campañas publicitarias con ROI comprobado.',
  92,
  '/resumes/maria-rodriguez.pdf'
),
(
  'carlos.martinez@email.com',
  'Carlos Martínez Ruiz',
  '+34 600 345 678',
  'Recursos Humanos',
  'Licenciatura en Psicología',
  'Junior',
  ARRAY['Reclutamiento', 'Selección de Personal', 'HRIS', 'Entrevistas', 'Onboarding'],
  'Profesional de RRHH con 2 años de experiencia en procesos de selección y reclutamiento. Conocimientos en sistemas HRIS y técnicas de entrevista.',
  78,
  '/resumes/carlos-martinez.pdf'
);
