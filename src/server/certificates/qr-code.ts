import 'server-only'
import QRCode from 'qrcode'

// QR em SVG para o endereço de verificação. Precisa de contraste alto para a câmera ler,
// por isso as cores vão fixas: módulos em pine (#1d3531) sobre fundo branco.
export function qrCodeSvg(url: string) {
  return QRCode.toString(url, {
    type: 'svg',
    margin: 0,
    errorCorrectionLevel: 'M',
    color: { dark: '#1d3531', light: '#ffffff' },
  })
}
