import i18n from '../../../i18n'

const getYAxisSettings = (locale:string) => {
	return [
		{
      key: 'yAxis.show',
      text: i18n('Show yAxis', locale),
      component: 'switch',
    },
    {
      key: 'yAxis.position',
      text: i18n('Position', locale),
      component: 'select',
      dataSource: [
        { key: 'right', text: i18n('Right', locale) },
        { key: 'left', text: i18n('Left', locale) }
      ],
    },
    {
      key: 'yAxis.type',
      text: i18n('price_axis_type', locale),
      component: 'select',
      dataSource: [
        { key: 'normal', text: i18n('normal', locale) },
        { key: 'percentage', text: i18n('percentage', locale) },
        { key: 'log', text: i18n('log', locale) }
      ],
    },
    {
      key: 'yAxis.inside',
      text: i18n('Inside', locale),
      component: 'switch',
    },
    {
      key: 'yAxis.reverse',
      text: i18n('reverse_coordinate', locale),
      component: 'switch',
    },
    {
      key: 'yAxis.axisLine.show',
      text: i18n('Show axis line', locale),
      component: 'switch',
    },
    {
      key: 'yAxis.axisLine.size',
      text: i18n('Axis line size', locale),
      component: 'select',
      dataSource: [
        { key: 1, text: 1},
        { key: 2, text: 2},
        { key: 3, text: 3},
        { key: 4, text: 4}
      ]
    },
    {
      key: 'yAxis.tickText.show',
      text: i18n('Show tick text', locale),
      component: 'switch',
    },
    {
			key: 'yAxis.tickText.size',
			text: i18n('Tick text size', locale),
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
			key: 'yAxis.tickText.weight',
			text: i18n('Tick text Weight', locale),
			component: 'select',
			dataSource: [
				{ key: 'normal', text: i18n('Normal', locale) }
			]
		},
    {
      key: 'yAxis.tickLine.show',
      text: i18n('Show tick line', locale),
      component: 'switch',
    },
    {
      key: 'yAxis.tickLine.size',
      text: i18n('Tick line size', locale),
      component: 'select',
      dataSource: [
        { key: 1, text: 1},
        { key: 2, text: 2},
        { key: 3, text: 3},
        { key: 4, text: 4}
      ]
    },
    {
      key: 'yAxis.tickLine.length',
      text: i18n('Tick line length', locale),
      component: 'select',
      dataSource: [
        { key: 1, text: 1},
        { key: 2, text: 2},
        { key: 3, text: 3},
        { key: 4, text: 4},
        { key: 5, text: 5},
        { key: 6, text: 6},
        { key: 7, text: 7},
        { key: 8, text: 8}
      ]
    }
	]
}

export default getYAxisSettings