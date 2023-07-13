import { OverlayTemplate, LineAttrs, TextAttrs,  } from 'klinecharts'


function formatThousands (value: string | number, sign: string): string {
  const vl = `${value}`
  if (sign.length === 0) {
    return vl
  }
  if (vl.includes('.')) {
    const arr = vl.split('.')
    return `${arr[0].replace(/(\d)(?=(\d{3})+$)/g, $1 => `${$1}${sign}`)}.${arr[1]}`
  }
  return vl.replace(/(\d)(?=(\d{3})+$)/g, $1 => `${$1}${sign}`)
}

const positionLine: OverlayTemplate = {
  name: 'positionLine',
  totalStep: 3,
  needDefaultPointFigure: true,
  needDefaultXAxisFigure: true,
  needDefaultYAxisFigure: true,
  createPointFigures: ({ coordinates, bounding, overlay, precision, thousandsSeparator }) => {
    const points = overlay.points
    if (coordinates.length > 0) {
      const lines: LineAttrs[] = []
      const texts: TextAttrs[] = []
      const startX = 0
      const endX = bounding.width
      if (coordinates.length > 1 && points[0].value !== undefined && points[1].value !== undefined) {
        const percents = [1, 0.5, 0]
        const yDif = coordinates[0].y - coordinates[1].y
        const valueDif = points[0].value - points[1].value
        percents.forEach(percent => {
          const y = coordinates[1].y + yDif * percent
          const value = formatThousands(((points[1].value ?? 0) + valueDif * percent).toFixed(precision.price), thousandsSeparator)
          lines.push({ coordinates: [{ x: startX, y }, { x: endX, y }] })
          texts.push({
            x: startX,
            y,
            text: `${value} (${(percent * 100).toFixed(1)}%)`,
            baseline: 'bottom'
          })
        })
      }
      return [
        {
          type: 'line',
          attrs: lines
        }, {
          type: 'text',
          isCheckEvent: false,
          attrs: texts
        }
      ]
    }
    return []
  }
}

export default positionLine