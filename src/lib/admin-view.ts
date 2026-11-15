// Visualização das listas do painel (cursos, seções do site), lembrada num cookie
export const ADMIN_VIEW_COOKIE = 'painel-visualizacao'
export const ADMIN_VIEWS = ['grade', 'lista'] as const
export type AdminView = (typeof ADMIN_VIEWS)[number]

export const parseAdminView = (value: string | undefined): AdminView => (value === 'lista' ? 'lista' : 'grade')
