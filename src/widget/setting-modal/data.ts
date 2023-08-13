/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific locale governing permissions and
 * limitations under the License.
 */

import i18n from '../../i18n'

export function getOptions (locale: string) {
  return [
    // candle
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
      key: 'candle.priceMark.low.show',
      text: i18n('low_price_show', locale),
      component: 'switch'
    },

    // indicator
    {
      key: 'indicator.lastValueMark.show',
      text: i18n('indicator_last_value_show', locale),
      component: 'switch'
    },
    {
      key: 'indicator.tooltip.showRule',
      text: i18n('Indicator Tooltip', locale),
      component: 'select',
      dataSource: [
        { key: 'none', text: i18n('none', locale) },
        { key: 'always', text: i18n('always', locale) },
        { key: 'follow_cross', text: i18n('follow_cross', locale) }
      ]
    },

    //x axis
    {
      key: 'xAxis.show',
      text: i18n('Show xAxis', locale),
      component: 'switch',
    },

    // y axis
    {
      key: 'yAxis.show',
      text: i18n('Show yAxis', locale),
      component: 'switch',
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
      key: 'yAxis.reverse',
      text: i18n('reverse_coordinate', locale),
      component: 'switch',
    },

    // grid
    {
      key: 'grid.show',
      text: i18n('grid_show', locale),
      component: 'switch',
    },

    // crosshair
    {
      key: 'crosshair.show',
      text: i18n('Show Crosshair', locale),
      component: 'switch',
    },

    // seperator
    {
      key: 'separator.size',
      text: i18n('Seperator size', locale),
      component: 'select',
      dataSource: [
        { key: 1, text: '1' },
        { key: 2, text: '2' },
        { key: 3, text: '3' },
        { key: 4, text: '4' },
        { key: 5, text: '5' },
      ]
    },

    // overlay
    // {
    //   key: 'overlay.line.style',
    //   text: i18n('Overlay Line Style', locale),
    //   component: 'select',
    //   dataSource: [
    //     { key: 'solid', text: i18n('solid', locale) },
    //     { key: 'dashed', text: i18n('dashed', locale) }
    //   ]
    // },
    // {
    //   key: 'overlay.arc.style',
    //   text: i18n('Overlay Arc Style', locale),
    //   component: 'select',
    //   dataSource: [
    //     { key: 'solid', text: i18n('solid', locale) },
    //     { key: 'dashed', text: i18n('dashed', locale) }
    //   ]
    // },
    // {
    //   key: 'overlay.rect.style',
    //   text: i18n('Overlay Rect Style', locale),
    //   component: 'select',
    //   dataSource: [
    //     { key: 'fill', text: i18n('fill', locale) },
    //     { key: 'stroke', text: i18n('stroke', locale) },
    //     { key: 'stroke_fill', text: i18n('stroke_fill', locale) }
    //   ]
    // },
    // {
    //   key: 'overlay.polygon.style',
    //   text: i18n('Overlay Polygon Style', locale),
    //   component: 'select',
    //   dataSource: [
    //     { key: 'fill', text: i18n('fill', locale) },
    //     { key: 'stroke', text: i18n('stroke', locale) },
    //     { key: 'stroke_fill', text: i18n('stroke_fill', locale) }
    //   ]
    // },
    // {
    //   key: 'overlay.circle.style',
    //   text: i18n('Overlay Circle Style', locale),
    //   component: 'select',
    //   dataSource: [
    //     { key: 'fill', text: i18n('fill', locale) },
    //     { key: 'stroke', text: i18n('stroke', locale) },
    //     { key: 'stroke_fill', text: i18n('stroke_fill', locale) }
    //   ]
    // },
  ]
}

// kline documentation for settings
// {
//   grid: {
//     show: true,
//     horizontal: {
//       show: true,
//       size: 1,
//       color: '#EDEDED',
//       style: 'dashed',
//       dashedValue: [2, 2]
//     },
//     vertical: {
//       show: true,
//       size: 1,
//       color: '#EDEDED',
//       style: 'dashed',
//       dashedValue: [2, 2]
//     }
//   },
//   candle: {
//     // 'candle_solid'|'candle_stroke'|'candle_up_stroke'|'candle_down_stroke'|'ohlc'|'area'
//     type: 'candle_solid',
//     bar: {
//       upColor: '#2DC08E',
//       downColor: '#F92855',
//       noChangeColor: '#888888',
//       upBorderColor: '#2DC08E',
//       downBorderColor: '#F92855',
//       noChangeBorderColor: '#888888',
//       upWickColor: '#2DC08E',
//       downWickColor: '#F92855',
//       noChangeWickColor: '#888888'
//     },
//     area: {
//       lineSize: 2,
//       lineColor: '#2196F3',
//       value: 'close',
//       backgroundColor: [{
//         offset: 0,
//         color: 'rgba(33, 150, 243, 0.01)'
//       }, {
//         offset: 1,
//         color: 'rgba(33, 150, 243, 0.2)'
//       }]
//     },
//     priceMark: {
//       show: true,
//       high: {
//         show: true,
//         color: '#D9D9D9',
//         textMargin: 5,
//         textSize: 10,
//         textFamily: 'Helvetica Neue',
//         textWeight: 'normal'
//       },
//       low: {
//         show: true,
//         color: '#D9D9D9',
//         textMargin: 5,
//         textSize: 10,
//         textFamily: 'Helvetica Neue',
//         textWeight: 'normal',
//       },
//       last: {
//         show: true,
//         upColor: '#2DC08E',
//         downColor: '#F92855',
//         noChangeColor: '#888888',
//         line: {
//           show: true,
//           // 'solid' | 'dashed'
//           style: 'dashed',
//           dashedValue: [4, 4],
//           size: 1
//         },
//         text: {
//           show: true,
//           // 'fill' | 'stroke' | 'stroke_fill'
//           style: 'fill',
//           size: 12,
//           paddingLeft: 4,
//           paddingTop: 4,
//           paddingRight: 4,
//           paddingBottom: 4,
//           // 'solid' | 'dashed'
//           borderStyle: 'solid',
//           borderSize: 1,
//           borderDashedValue: [2, 2],
//           color: '#FFFFFF',
//           family: 'Helvetica Neue',
//           weight: 'normal',
//           borderRadius: 2
//         }
//       }
//     },
//     tooltip: {
//       // 'always' | 'follow_cross' | 'none'
//       showRule: 'always',
//       // 'standard' | 'rect'
//       showType: 'standard',
//       // Custom display, it can be a callback method or an array, when it is a method, it needs to return an array
//       // The child item type of the array is { title, value }
//       // title and value can be strings or objects, and the object type is { text, color }
//       // title or title.text can be an internationalized key,
//       // value or value.text supports string templates
//       // For example: want to display time, opening and closing, configure [{ title: 'time', value: '{time}' }, { title: 'open', value: '{open}' }, { title: ' close', value: '{close}' }]
//       custom: null
//       defaultValue: 'n/a',
//       rect: {
//        // 'fixed' | 'pointer'
//         position: 'fixed',
//         paddingLeft: 0,
//         paddingRight: 0,
//         paddingTop: 0,
//         paddingBottom: 6,
//         offsetLeft: 10,
//         offsetTop: 8,
//         offsetRight: 10,
//         offsetBottom: 8,
//         borderRadius: 4,
//         borderSize: 1,
//         borderColor: '#f2f3f5',
//         color: '#FEFEFE'
//       },
//       text: {
//         size: 12,
//         family: 'Helvetica Neue',
//         weight: 'normal',
//         color: '#D9D9D9',
//         marginLeft: 10,
//         marginTop: 8,
//         marginRight: 6,
//         marginBottom: 0
//       },
//       // sample:
//       // [{
//       //   id: 'icon_id',
//       //   position: 'left', // types include 'left', 'middle', 'right'
//       //   marginLeft: 8,
//       //   marginTop: 6,
//       //   marginRight: 0,
//       //   marginBottom: 0,
//       //   paddingLeft: 1,
//       //   paddingTop: 1,
//       //   paddingRight: 1,
//       //   paddingBottom: 1,
//       //   icon: '\ue900',
//       //   fontFamily: 'iconfont',
//       //   size: 12,
//       //   color: '#76808F',
//       //   backgroundColor: 'rgba(33, 150, 243, 0.2)',
//       //   activeBackgroundColor: 'rgba(33, 150, 243, 0.4)'
//       // }]
//       icons: []
//     }
//   },
//   indicator: {
//     ohlc: {
//       upColor: 'rgba(45, 192, 142, .7)',
//       downColor: 'rgba(249, 40, 85, .7)',
//       noChangeColor: '#888888'
//     },
//     bars: [{
//       // 'fill' | 'stroke' | 'stroke_fill'
//       style: 'fill',
//       // 'solid' | 'dashed'
//       borderStyle: 'solid',
//       borderSize: 1,
//       borderDashedValue: [2, 2],
//       upColor: 'rgba(45, 192, 142, .7)',
//       downColor: 'rgba(249, 40, 85, .7)',
//       noChangeColor: '#888888'
//     }],
//     lines: [
//       {
//         // 'solid' | 'dashed'
//         style: 'solid',
//         smooth: false,
//         size: 1,
//         dashedValue: [2, 2],
//         color: '#FF9600'
//       }, {
//         style: 'solid',
//         smooth: false,
//         size: 1,
//         dashedValue: [2, 2],
//         color: '#935EBD'
//       }, {
//         style: 'solid',
//         smooth: false,
//         size: 1,
//         dashedValue: [2, 2],
//         color: '#2196F3'
//       }, {
//         style: 'solid',
//         smooth: false,
//         size: 1,
//         dashedValue: [2, 2],
//         color: '#E11D74'
//       }, {
//         style: 'solid',
//         smooth: false,
//         size: 1,
//         dashedValue: [2, 2],
//         color: '#01C5C4'
//       }
//     ],
//     circles: [{
//       // 'fill' | 'stroke' | 'stroke_fill'
//       style: 'fill',
//       // 'solid' | 'dashed'
//       borderStyle: 'solid',
//       borderSize: 1,
//       borderDashedValue: [2, 2],
//       upColor: 'rgba(45, 192, 142, .7)',
//       downColor: 'rgba(249, 40, 85, .7)',
//       noChangeColor: '#888888'
//     }],
//     lastValueMark: {
//       show: false,
//       text: {
//         show: false,
//         // 'fill' | 'stroke' | 'stroke_fill'
//         style: 'fill',
//         color: '#FFFFFF',
//         size: 12,
//         family: 'Helvetica Neue',
//         weight: 'normal',
//         // 'solid' | 'dashed'
//         borderStyle: 'solid',
//         borderSize: 1,
//         borderDashedValue: [2, 2],
//         paddingLeft: 4,
//         paddingTop: 4,
//         paddingRight: 4,
//         paddingBottom: 4,
//         borderRadius: 2
//       }
//     },
//     tooltip: {
//       // 'always' | 'follow_cross' | 'none'
//       showRule: 'always',
//       // 'standard' | 'rect'
//       showType: 'standard',
//       showName: true,
//       showParams: true,
//       defaultValue: 'n/a',
//       text: {
//         size: 12,
//         family: 'Helvetica Neue',
//         weight: 'normal',
//         color: '#D9D9D9',
//         marginTop: 8,
//         marginRight: 6,
//         marginBottom: 0,
//         marginLeft: 10
//       },
//       // sample:
//       // [{
//       //   id: 'icon_id',
//       //   position: 'left', // types include 'left', 'middle', 'right'
//       //   marginLeft: 8,
//       //   marginTop: 6,
//       //   marginRight: 0,
//       //   marginBottom: 0,
//       //   paddingLeft: 1,
//       //   paddingTop: 1,
//       //   paddingRight: 1,
//       //   paddingBottom: 1,
//       //   icon: '\ue900',
//       //   fontFamily: 'iconfont',
//       //   size: 12,
//       //   color: '#76808F',
//       //   backgroundColor: 'rgba(33, 150, 243, 0.2)',
//       //   activeBackgroundColor: 'rgba(33, 150, 243, 0.4)'
//       // }]
//       icons: []
//     }
//   },
//   xAxis: {
//     show: true,
//     size: 'auto',
//     axisLine: {
//       show: true,
//       color: '#888888',
//       size: 1
//     },
//     tickText: {
//       show: true,
//       color: '#D9D9D9',
//       family: 'Helvetica Neue',
//       weight: 'normal',
//       size: 12,
//       marginStrat: 4,
//       marginBottom: 4
//     },
//     tickLine: {
//       show: true,
//       size: 1,
//       length: 3,
//       color: '#888888'
//     }
//   },
//   yAxis: {
//     show: true,
//     size: 'auto',
//     // 'left' | 'right'
//     position: 'right',
//     // 'normal' | 'percentage' | 'log'
//     type: 'normal',
//     inside: false,
//     reverse: false,
//     axisLine: {
//       show: true,
//       color: '#888888',
//       size: 1
//     },
//     tickText: {
//       show: true,
//       color: '#D9D9D9',
//       family: 'Helvetica Neue',
//       weight: 'normal',
//       size: 12,
//       marginStrat: 4,
//       marginBottom: 4
//     },
//     tickLine: {
//       show: true,
//       size: 1,
//       length: 3,
//       color: '#888888'
//     }
//   },
//   separator: {
//     size: 1,
//     color: '#888888',
//     fill: true,
//     activeBackgroundColor: 'rgba(230, 230, 230, .15)'
//   },
//   crosshair: {
//     show: true,
//     horizontal: {
//       show: true,
//       line: {
//         show: true,
//         // 'solid'|'dashed'
//         style: 'dashed',
//         dashedValue: [4, 2],
//         size: 1,
//         color: '#888888'
//       },
//       text: {
//         show: true,
//         // 'fill' | 'stroke' | 'stroke_fill'
//         style: 'fill',
//         color: '#FFFFFF',
//         size: 12,
//         family: 'Helvetica Neue',
//         weight: 'normal',
//         // 'solid' | 'dashed'
//         borderStyle: 'solid',
//         borderDashedValue: [2, 2],
//         borderSize: 1,
//         borderColor: '#686D76',
//         borderRadius: 2,
//         paddingLeft: 4,
//         paddingRight: 4,
//         paddingTop: 4,
//         paddingBottom: 4,
//         backgroundColor: '#686D76'
//       }
//     },
//     vertical: {
//       show: true,
//       line: {
//         show: true,
//         // 'solid'|'dashed'
//         style: 'dashed',
//         dashedValue: [4, 2],
//         size: 1,
//         color: '#888888'
//       },
//       text: {
//         show: true,
//         // 'fill' | 'stroke' | 'stroke_fill'
//         style: 'fill',
//         color: '#FFFFFF',
//         size: 12,
//         family: 'Helvetica Neue',
//         weight: 'normal',
//         // 'solid' | 'dashed'
//         borderStyle: 'solid',
//         borderDashedValue: [2, 2],
//         borderSize: 1,
//         borderColor: '#686D76',
//         borderRadius: 2,
//         paddingLeft: 4,
//         paddingRight: 4,
//         paddingTop: 4,
//         paddingBottom: 4,
//         backgroundColor: '#686D76'
//       }
//     }
//   },
//   overlay: {
//     point: {
//       color: '#1677FF',
//       borderColor: 'rgba(22, 119, 255, 0.35)',
//       borderSize: 1,
//       radius: 5,
//       activeColor: '#1677FF',
//       activeBorderColor: 'rgba(22, 119, 255, 0.35)',
//       activeBorderSize: 3,
//       activeRadius: 5
//     },
//     line: {
//       // 'solid' | 'dashed'
//       style: 'solid',
//       smooth: false,
//       color: '#1677FF',
//       size: 1,
//       dashedValue: [2, 2]
//     },
//     rect: {
//       // 'fill' | 'stroke' | 'stroke_fill'
//       style: 'fill',
//       color: 'rgba(22, 119, 255, 0.25)',
//       borderColor: '#1677FF',
//       borderSize: 1,
//       borderRadius: 0,
//       // 'solid' | 'dashed'
//       borderStyle: 'solid',
//       borderDashedValue: [2, 2]
//     },
//     polygon: {
//       // 'fill' | 'stroke' | 'stroke_fill'
//       style: 'fill',
//       color: '#1677FF',
//       borderColor: '#1677FF',
//       borderSize: 1,
//       // 'solid' | 'dashed'
//       borderStyle: 'solid',
//       borderDashedValue: [2, 2]
//     },
//     circle: {
//       // 'fill' | 'stroke' | 'stroke_fill'
//       style: 'fill',
//       color: 'rgba(22, 119, 255, 0.25)',
//       borderColor: '#1677FF',
//       borderSize: 1,
//       // 'solid' | 'dashed'
//       borderStyle: 'solid',
//       borderDashedValue: [2, 2]
//     },
//     arc: {
//       // 'solid' | 'dashed'
//       style: 'solid',
//       color: '#1677FF',
//       size: 1,
//       dashedValue: [2, 2]
//     },
//     text: {
//       color: '#1677FF',
//       size: 12,
//       family: 'Helvetica Neue',
//       weight: 'normal'
//     },
//     rectText: {
//       // 'fill' | 'stroke' | 'stroke_fill'
//       style: 'fill',
//       color: '#FFFFFF',
//       size: 12,
//       family: 'Helvetica Neue',
//       weight: 'normal',
//       // 'solid' | 'dashed'
//       borderStyle: 'solid',
//       borderDashedValue: [2, 2],
//       borderSize: 1,
//       borderRadius: 2,
//       borderColor: '#1677FF',
//       paddingLeft: 4,
//       paddingRight: 4,
//       paddingTop: 4,
//       paddingBottom: 4,
//       backgroundColor: '#1677FF'
//     }
//   }
// }