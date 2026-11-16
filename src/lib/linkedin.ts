// Links públicos do LinkedIn (sem API e sem chave): adicionar o certificado ao perfil
// e compartilhar a página do certificado numa publicação
type CertificateForLinkedIn = { courseTitle: string; issuedAt: Date; code: string; url: string }

export function linkedInAddToProfileUrl({ courseTitle, issuedAt, code, url }: CertificateForLinkedIn) {
  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: courseTitle,
    organizationName: 'Instasany',
    issueYear: String(issuedAt.getFullYear()),
    issueMonth: String(issuedAt.getMonth() + 1),
    certUrl: url,
    certId: code,
  })
  return `https://www.linkedin.com/profile/add?${params}`
}

export const linkedInShareUrl = (url: string) =>
  `https://www.linkedin.com/sharing/share-offsite/?${new URLSearchParams({ url })}`
