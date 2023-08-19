import i18n from '../../../i18n'

const getXAxisSettings = (locale:string) => {
	return [
		{
      key: 'xAxis.show',
      text: i18n('Show xAxis', locale),
      component: 'switch',
    },
    {
      key: 'xAxis.axisLine.show',
      text: i18n('Show axis line', locale),
      component: 'switch',
    },
    {
      key: 'xAxis.axisLine.size',
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
      key: 'xAxis.tickText.show',
      text: i18n('Show tick text', locale),
      component: 'switch',
    },
    {
			key: 'xAxis.tickText.size',
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
			key: 'xAxis.tickText.weight',
			text: i18n('Tick text Weight', locale),
			component: 'select',
			dataSource: [
				{ key: 'normal', text: i18n('Normal', locale) }
			]
		},
    {
      key: 'xAxis.tickLine.show',
      text: i18n('Show tick line', locale),
      component: 'switch',
    },
    {
      key: 'xAxis.tickLine.size',
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
      key: 'xAxis.tickLine.length',
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

export default getXAxisSettings