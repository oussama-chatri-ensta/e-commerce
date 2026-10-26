const formatter = new Intl.NumberFormat('fr-FR')

export default function formatDzd(value) {
  return `${formatter.format(Math.round(value))} DA`
}
