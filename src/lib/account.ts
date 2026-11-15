// Primeiro nome para saudações; sem nome cadastrado, usa o começo do e-mail
export const firstNameOf = (name: string, email: string) => name.trim().split(' ')[0] || email.split('@')[0] || 'Aluno'

// Iniciais para o avatar: "Bia Aluna" vira "BA"; só e-mail, as duas primeiras partes
export const initialsOf = (name: string) =>
  name
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
