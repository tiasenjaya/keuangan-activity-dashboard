export const idFormatter = new Intl.NumberFormat('id-ID')
export const currencyIDR = new Intl.NumberFormat('id-ID', { style:'currency', currency:'IDR', maximumFractionDigits:0 })

export function formatRupiah(val: number){ return currencyIDR.format(val).replace('Rp', 'Rp ').replace(',00','') }
export function stripNonNumeric(s: string){ return s.replace(/[^0-9.,]/g,'') }

export function parseRupiah(input: string): number{
  const s = stripNonNumeric(input).trim()
  if(!s) return 0
  if(s.includes(',') && s.includes('.')){ const t = s.replace(/\./g,'').replace(',', '.'); return Number(t) || 0 }
  if(s.includes(',') && !s.includes('.')){ return Number(s.replace(',', '.')) || 0 }
  if(s.includes('.') && !s.includes(',')){
    const parts = s.split('.')
    if(parts.length>1 && parts.slice(1).every(p=>p.length===3)){ return Number(parts.join('')) || 0 }
    return Number(s) || 0
  }
  return Number(s) || 0
}

export function formatThousandsLive(input: string){
  const n = parseRupiah(input)
  if(!n) return ''
  return idFormatter.format(Math.round(n))
}
