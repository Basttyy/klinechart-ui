import i18n from '../../../i18n'

const getIndicatorSettings = (locale:string) => {
	return [
		// {
    //   key: 'indicator.bars.style',
    //   text: i18n('Bar style', locale),
    //   component: 'select',
    //   dataSource: [
    //     { key: 'fill', text: i18n('Fill', locale) },
    //     { key: 'stroke', text: i18n('Stroke', locale) },
    //     { key: 'stroke_fill', text: i18n('Stroke fill', locale) }
    //   ]
    // },
    // {
    //   key: 'indicator.bars.borderStyle',
    //   text: i18n('Bar border style', locale),
    //   component: 'select',
    //   dataSource: [
    //     { key: 'solid', text: i18n('Solid', locale) },
    //     { key: 'dashed', text: i18n('Dashed', locale) }
    //   ]
    // },
    // {
    //   key: 'indicator.bars.borderSize',
    //   text: i18n('Bar border thickness', locale),
    //   component: 'select',
    //   dataSource: [
    //     { key: 1, text: 1},
    //     { key: 2, text: 2},
    //     { key: 3, text: 3},
    //     { key: 4, text: 4}
    //   ]
    // },
    {
      key: 'indicator.lastValueMark.show',
      text: i18n('indicator_last_value_show', locale),
      component: 'switch'
    },
    {
      key: 'indicator.lastValueMark.text.show',
      text: i18n('Show lastvaluemark text', locale),
      component: 'switch'
    },
    {
      key: 'indicator.lastValueMark.text.style',
      text: i18n('Lastvaluemark text style', locale),
      component: 'select',
      dataSource: [
        { key: 'fill', text: i18n('Fill', locale) },
        { key: 'stroke', text: i18n('Stroke', locale) },
        { key: 'stroke_fill', text: i18n('Stroke fill', locale) }
      ]
    },
    {
			key: 'indicator.lastValueMark.text.size',
			text: i18n('Lastvaluemark text size', locale),
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
			key: 'indicator.lastValueMark.text.weight',
			text: i18n('Lastvaluemark text Weight', locale),
			component: 'select',
			dataSource: [
				{ key: 'normal', text: i18n('Normal', locale) }
			]
		},
    {
      key: 'indicator.tooltip.showRule',
      text: i18n('Tooltip showrule', locale),
      component: 'select',
      dataSource: [
        { key: 'none', text: i18n('none', locale) },
        { key: 'always', text: i18n('always', locale) },
        { key: 'follow_cross', text: i18n('follow_cross', locale) }
      ]
    },
    {
      key: 'indicator.tooltip.showType',
      text: i18n('Tooltip showtype', locale),
      component: 'select',
      dataSource: [
        { key: 'standard', text: i18n('Standard', locale) },
        { key: 'rect', text: i18n('Rect', locale) }
      ]
    },
    {
      key: 'indicator.tooltip.showName',
      text: i18n('Show tooltip name', locale),
      component: 'switch'
    },
    {
      key: 'indicator.tooltip.showParams',
      text: i18n('Show tooltip params', locale),
      component: 'switch'
    },
    {
			key: 'indicator.tooltip.text.size',
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
			key: 'indicator.tooltip.text.weight',
			text: i18n('Tooltip text Weight', locale),
			component: 'select',
			dataSource: [
				{ key: 'normal', text: i18n('Normal', locale) }
			]
		},
	]
}

export default getIndicatorSettings