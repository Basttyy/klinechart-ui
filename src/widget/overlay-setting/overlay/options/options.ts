import i18n from "../../../../i18n";
import useDataSource from '../../../setting-modal/settings/dataSource'

type optionType = {
  key: string,
  text: string,
  component: string,
  dataSource?: object[]
}

export const getOptions = (locale: string): {[key: string]: optionType[]} => {
  const { font_size, font_family, font_weight, fill_stroke, solid_dashed, size, true_false } = useDataSource(locale)

  const point = [
    {
      key: 'activeBorderSize',
      text: i18n('active border size', locale),
      component: 'select',
      dataSource: font_size
    },
    {
      key: 'borderSize',
      text: i18n('Border size', locale),
      component: 'select',
      dataSource: size
    },
    {
      key: 'color',
      text: i18n('Color', locale),
      component: 'color',
    },
    {
      key: 'activeColor',
      text: i18n('Color', locale),
      component: 'color',
    },
    {
      key: 'activeBorderColor',
      text: i18n('Color', locale),
      component: 'color',
    },
    {
      key: 'borderColor',
      text: i18n('Border color', locale),
      component: 'color',
    },
    {
      key: 'activeRadius',
      text: i18n('Active radius', locale),
      component: 'input',
    },
    {
      key: 'radius',
      text: i18n('Radius', locale),
      component: 'input',
    }
  ]
  
  const text = [
    {
      key: 'style',
      text: i18n('Style', locale),
      component: 'select',
      dataSource: fill_stroke
    },
    {
      key: 'size',
      text: i18n('Font size', locale),
      component: 'select',
      dataSource: font_size
    },
    {
      key: 'family',
      text: i18n('Font family', locale),
      component: 'select',
      dataSource: font_family
    },
    {
      key: 'weight',
      text: i18n('Font weight', locale),
      component: 'select',
      dataSource: font_weight
    },
    {
      key: 'borderStyle',
      text: i18n('Border style', locale),
      component: 'select',
      dataSource: solid_dashed
    },
    {
      key: 'borderSize',
      text: i18n('Border size', locale),
      component: 'select',
      dataSource: size
    },
    {
      key: 'color',
      text: i18n('Color', locale),
      component: 'color',
    },
    {
      key: 'backgroundColor',
      text: i18n('Background color', locale),
      component: 'color',
    },
    {
      key: 'borderColor',
      text: i18n('Border color', locale),
      component: 'color',
    },
    {
      key: 'borderDashedValue',
      text: i18n('Border dashed value', locale),
      component: 'input',
    },
    {
      key: 'borderRadius',
      text: i18n('Border radius', locale),
      component: 'input',
    },
    {
      key: 'paddingLeft',
      text: i18n('Padding left', locale),
      component: 'input',
    },
    {
      key: 'paddingRight',
      text: i18n('Padding right', locale),
      component: 'input',
    },
    {
      key: 'paddingBottom',
      text: i18n('Padding bottom', locale),
      component: 'input',
    },
    {
      key: 'paddingTop',
      text: i18n('Padding top', locale),
      component: 'input',
    }
  ]
  
  const arc = [
    {
      key: 'style',
      text: i18n('Style', locale),
      component: 'select',
      dataSource: solid_dashed
    },
    {
      key: 'size',
      text: i18n('Size', locale),
      component: 'select',
      dataSource: size
    },
    {
      key: 'color',
      text: i18n('Color', locale),
      component: 'color',
    },
    {
      key: 'dashedValue',
      text: i18n('Dashed Value', locale),
      component: 'input',
    }
  ]
  
  const circle = [
    {
      key: 'style',
      text: i18n('Style', locale),
      component: 'select',
      dataSource: fill_stroke
    },
    {
      key: 'color',
      text: i18n('Color', locale),
      component: 'color',
    },
    {
      key: 'borderColor',
      text: i18n('Border color', locale),
      component: 'color',
    },
    {
      key: 'borderSize',
      text: i18n('Active border size', locale),
      component: 'select',
      dataSource: font_size
    },
    {
      key: 'borderStyle',
      text: i18n('Border style', locale),
      component: 'select',
      dataSource: solid_dashed
    },
    {
      key: 'borderDashedValue',
      text: i18n('Border dashed value', locale),
      component: 'input',
    }
  ]

  const line = arc
  line.push(    {
    key: 'smooth',
    text: i18n('Smooth', locale),
    component: 'select',
    dataSource: true_false
  })
  
  const rect = circle
  rect.push({
    key: 'borderRadius',
    text: i18n('Border radius', locale),
    component: 'input',
  })

  const polygon = circle

  const options: {[key: string]: optionType[]} = {
    point,
    text,
    line,
    rect,
    polygon,
    circle,
    arc
  }
  return options
}

// default: [
//   {
//     key: 'style',
//     text: i18n('Style', locale),
//     component: 'select',
//     dataSource: fill_stroke
//   },
//   {
//     key: 'size',
//     text: i18n('Font size', locale),
//     component: 'select',
//     dataSource: font_size
//   },
//   {
//     key: 'activeBorderSize',
//     text: i18n('active border size', locale),
//     component: 'select',
//     dataSource: font_size
//   },
//   {
//     key: 'family',
//     text: i18n('Font family', locale),
//     component: 'select',
//     dataSource: font_family
//   },
//   {
//     key: 'weight',
//     text: i18n('Font weight', locale),
//     component: 'select',
//     dataSource: font_weight
//   },
//   {
//     key: 'borderStyle',
//     text: i18n('Border style', locale),
//     component: 'select',
//     dataSource: solid_dashed
//   },
//   {
//     key: 'borderSize',
//     text: i18n('Border size', locale),
//     component: 'select',
//     dataSource: size
//   },
//   {
//     key: 'color',
//     text: i18n('Color', locale),
//     component: 'color',
//   },
//   {
//     key: 'backgroundColor',
//     text: i18n('Background color', locale),
//     component: 'color',
//   },
//   {
//     key: 'activeColor',
//     text: i18n('Color', locale),
//     component: 'color',
//   },
//   {
//     key: 'activeBorderColor',
//     text: i18n('Color', locale),
//     component: 'color',
//   },
//   {
//     key: 'borderColor',
//     text: i18n('Border color', locale),
//     component: 'color',
//   },
//   {
//     key: 'dashedValue',
//     text: i18n('Dashed value', locale),
//     component: 'input',
//   },
//   {
//     key: 'borderDashedValue',
//     text: i18n('Border dashed value', locale),
//     component: 'input',
//   },
//   {
//     key: 'borderRadius',
//     text: i18n('Border radius', locale),
//     component: 'input',
//   },
//   {
//     key: 'activeRadius',
//     text: i18n('Active radius', locale),
//     component: 'input',
//   },
//   {
//     key: 'paddingLeft',
//     text: i18n('Padding left', locale),
//     component: 'input',
//   },
//   {
//     key: 'paddingRight',
//     text: i18n('Padding right', locale),
//     component: 'input',
//   },
//   {
//     key: 'paddingBottom',
//     text: i18n('Padding bottom', locale),
//     component: 'input',
//   },
//   {
//     key: 'paddingTop',
//     text: i18n('Padding top', locale),
//     component: 'input',
//   }
// ],