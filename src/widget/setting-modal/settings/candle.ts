import i18n from '../../../i18n'

const getCandleSettings = (locale:string) => {
	return [
		{
			key: 'candle.type',
			text: i18n('candle_type', locale),
			component: 'select',
			dataSource: [
				{ key: 'candle_solid', text: i18n('candle_solid', locale) },
				{ key: 'candle_stroke', text: i18n('candle_stroke', locale) },
				{ key: 'candle_up_stroke', text: i18n('candle_up_stroke', locale) },
				{ key: 'candle_down_stroke', text: i18n('candle_down_stroke', locale) },
				{ key: 'ohlc', text: i18n('ohlc', locale) },
				{ key: 'area', text: i18n('area', locale) }
			]
		},
		{
			key: 'candle.area.lineSize',
			text: i18n('Area linesize', locale),
			component: 'select',
			dataSource: [
				{ key: 1, text: 1 },
				{ key: 2, text: 2 },
				{ key: 3, text: 3 },
				{ key: 4, text: 4 }
			]
		},
		{
			key: 'candle.priceMark.last.show',
			text: i18n('last_price_show', locale),
			component: 'switch'
		},
		{
			key: 'candle.priceMark.high.show',
			text: i18n('high_price_show', locale),
			component: 'switch'
		},
		{
			key: 'candle.priceMark.high.textSize',
			text: i18n('Pricemark High Textsize', locale),
			component: 'select',
			dataSource: [
				{ key: 10, text: 10 },
				{ key: 12, text: 12 },
				{ key: 14, text: 14 },
				{ key: 16, text: 16 },
				{ key: 18, text: 18 }
			]
		},
		{
			key: 'candle.priceMark.high.textFamily',
			text: i18n('Pricemark High Font family', locale),
			component: 'select',
			dataSource: [
				{ key: 'Helvetica Neue', text: i18n('Helvetica Neue', locale) },
			]
		},
		{
			key: 'candle.priceMark.high.textWeight',
			text: i18n('Pricemark High Font Weight', locale),
			component: 'select',
			dataSource: [
				{ key: 'normal', text: i18n('Normal', locale) }
			]
		},
		{
			key: 'candle.priceMark.low.show',
			text: i18n('low_price_show', locale),
			component: 'switch'
		},
		{
			key: 'candle.priceMark.low.textSize',
			text: i18n('Pricemark Low Textsize', locale),
			component: 'select',
			dataSource: [
				{ key: 10, text: 10 },
				{ key: 12, text: 12 },
				{ key: 14, text: 14 },
				{ key: 16, text: 16 },
				{ key: 18, text: 18 }
			]
		},
		{
			key: 'candle.priceMark.low.textFamily',
			text: i18n('Pricemark Low Font family', locale),
			component: 'select',
			dataSource: [
				{ key: 'Helvetica Neue', text: i18n('Helvetica Neue', locale) },
			]
		},
		{
			key: 'candle.priceMark.low.textWeight',
			text: i18n('Pricemark Low Font Weight', locale),
			component: 'select',
			dataSource: [
				{ key: 'normal', text: i18n('Normal', locale) }
			]
		},
		{
			key: 'candle.priceMark.last.show',
			text: i18n('Show Pricemark last', locale),
			component: 'switch'
		},
		{
			key: 'candle.priceMark.last.line.show',
			text: i18n('Show Pricemark last line', locale),
			component: 'switch'
		},
		{
			key: 'candle.priceMark.last.line.style',
			text: i18n('Pricemark last line style', locale),
			component: 'select',
			dataSource: [
				{ key: 'solid', text: i18n('Solid', locale) },
				{ key: 'dashed', text: i18n('Dashed', locale) }
			]
		},
		{
			key: 'candle.priceMark.last.line.size',
			text: i18n('Pricemark last line size', locale),
			component: 'select',
			dataSource: [
				{ key: 1, text: 1 },
				{ key: 2, text: 2 },
				{ key: 3, text: 3 },
				{ key: 4, text: 4 }
			]
		},
		{
			key: 'candle.priceMark.last.text.show',
			text: i18n('Show Pricemark last text', locale),
			component: 'switch'
		},
		{
			key: 'candle.priceMark.last.text.style',
			text: i18n('Pricemark last text style', locale),
			component: 'select',
			dataSource: [
				{ key: 'fill', text: i18n('Fill', locale) },
				{ key: 'stroke', text: i18n('Stroke', locale) },
				{ key: 'stroke_fill', text: i18n('Stroke fill', locale) }
			]
		},
		{
			key: 'candle.priceMark.last.text.size',
			text: i18n('Pricemark last text size', locale),
			component: 'select',
			dataSource: [
				{ key: 10, text: 10 },
				{ key: 12, text: 12 },
				{ key: 14, text: 14 },
				{ key: 16, text: 16 },
				{ key: 18, text: 18 }
			]
		},
			// candle tooltip
		{
			key: 'candle.tooltip.showRule',
			text: i18n('candle_tooltip', locale),
			component: 'select',
			dataSource: [
				{ key: 'none', text: i18n('none', locale) },
				{ key: 'always', text: i18n('always', locale) },
				{ key: 'follow_cross', text: i18n('follow_cross', locale) }
			]
		},
		{
			key: 'candle.tooltip.showType',
			text: i18n('Tooltip showtype', locale),
			component: 'select',
			dataSource: [
				{ key: 'rect', text: i18n('Rect', locale) },
				{ key: 'standard', text: i18n('Standard', locale) }
			]
		},
		{
			key: 'candle.tooltip.rect.position',
			text: i18n('Tooltip rect position', locale),
			component: 'select',
			dataSource: [
				{ key: 'fixed', text: i18n('Fixed', locale) },
				{ key: 'pointer', text: i18n('Pointer', locale) }
			]
		},
		{
			key: 'candle.tooltip.text.size',
			text: i18n('Tooltip text size', locale),
			component: 'select',
			dataSource: [
				{ key: 10, text: 10 },
				{ key: 12, text: 12 },
				{ key: 14, text: 14 },
				{ key: 16, text: 16 },
				{ key: 18, text: 18 }
			]
		},
		{
			key: 'candle.tooltip.text.weight',
			text: i18n('Tooltip text weight', locale),
			component: 'select',
			dataSource: [
				{ key: 'normal', text: 'Normal' },
			]
		},
	]
}

export default getCandleSettings