// Primeiro nome para saudações; sem nome cadastrado, usa o começo do e-mail
export const firstNameOf = (name: string, email: string) => name.trim().split(' ')[0] || email.split('@')[0] || 'Aluno'
