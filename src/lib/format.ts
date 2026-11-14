const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

// R$ 397 sem centavos quando o valor é inteiro; R$ 33,08 quando tem
export function formatPrice(value: number) {
  return Number.isInteger(value) ? brl.format(value).replace(/,00$/, '') : brl.format(value)
}
