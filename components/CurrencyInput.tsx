'use client'
import * as React from 'react'

// format 1234567 => "1.234.567"
function formatDigits(s: string) {
  const digits = (s || '').replace(/\D/g, '')
  if (!digits) return ''
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export default function CurrencyInput({
  value,
  onChange,
  placeholder,
}: {
  value?: number
  onChange?: (valueNumber: number) => void
  placeholder?: string
}) {
  const [display, setDisplay] = React.useState(
    typeof value === 'number' && value > 0 ? formatDigits(String(Math.round(value))) : ''
  )

  React.useEffect(() => {
    if (typeof value === 'number') {
      setDisplay(value > 0 ? formatDigits(String(Math.round(value))) : '')
    }
  }, [value])

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    const formatted = formatDigits(raw) // selalu format berbasis digit
    setDisplay(formatted)
    const asNumber = Number((formatted || '').replace(/\./g, '') || '0') // kirim angka murni
    onChange?.(asNumber)
  }

  return (
    <input
      className="input"
      inputMode="numeric"
      placeholder={placeholder || 'mis: 10.000'}
      value={display}
      onChange={handle}
    />
  )
}
