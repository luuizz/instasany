// Papéis da plataforma. Equipe (instrutor e admin) vê todos os cursos sem matrícula;
// o instrutor edita o conteúdo dos cursos, e só o admin cuida de alunos, números e do site.
export const ROLES = ['student', 'instructor', 'admin'] as const
export type Role = (typeof ROLES)[number]

export const ROLE_LABELS: Record<Role, string> = { student: 'Aluno', instructor: 'Instrutor', admin: 'Admin' }

export const isStaff = (role: Role) => role !== 'student'

// Para onde a pessoa vai depois de entrar
export const homeFor = (role: Role) =>
  role === 'admin' ? '/admin' : role === 'instructor' ? '/admin/cursos' : '/aluno'
