/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import { Component, For, Show, createSignal } from 'solid-js'
import { Modal, Select, Switch, Color, Input } from '../../../component'
import type { SelectDataSourceItem } from '../../../component'
import useDataSource from '../../setting-modal/settings/dataSource'

import i18n from '../../../i18n'
import { setShowOverlaySetting, popupOtherInfo, getOverlayType, popupOverlay, setPopupOverlay } from '../../../store/overlaySettingStore'
import {
  setPointStyle, setRectStyle, setPolygonStyle, setCircleStyle, setArcStyle, setTextStyle, pointStyle, rectStyle, polygonStyle,
  circleStyle, arcStyle, textStyle, horizontalStraightLineStyle, horizontalRayLineStyle, horizontalSegmentStyle, verticalStraightLineStyle,
  verticalRayLineStyle, setRayLineStyle, rayLineStyle, segmentStyle, setArrowStyle, straightLineStyle, priceLineStyle, setHorizontalStraightLineStyle,
  setHorizontalRayLineStyle, setHorizontalSegmentStyle, setVerticalStraightLineStyle, setVerticalRayLineStyle, setVerticalSegmentStyle,
  setStraightLineStyle, setSegmentStyle, setPriceLineStyle, arrowStyle, verticalSegmentStyle } from '../../../store/overlaystyle/inbuiltOverlayStyleStore'
import { chartsession, instanceapi } from '../../../ChartProComponent'
import { ChartObjType } from '../../../types'

import { cloneDeep, isArray, isString, set as lodashSet } from 'lodash'
import { setChartModified, useChartState } from '../../../store/chartStateStore'
import verticalSegment from '../../drawing-bar/icons/verticalSegment'
import { useGetOverlayStyle } from '../../../store/overlaystyle/useOverlayStyles'

export interface OverlaySettingModalProps {
  locale: string
}
  
const OverlaySettingModal: Component<OverlaySettingModalProps> = props => {
  console.log('overlay settings activated')
	const { font_size, font_family, font_weight, fill_stroke, solid_dashed, size, true_false } = useDataSource(props.locale)
	const default_options = [
    {
      key: 'style',
      text: i18n('Style', props.locale),
      component: 'select',
      dataSource: fill_stroke
    },
    {
      key: 'size',
      text: i18n('Font size', props.locale),
      component: 'select',
      dataSource: font_size
    },
    {
      key: 'activeBorderSize',
      text: i18n('active border size', props.locale),
      component: 'select',
      dataSource: font_size
    },
    {
      key: 'family',
      text: i18n('Font family', props.locale),
      component: 'select',
      dataSource: font_family
    },
    {
      key: 'weight',
      text: i18n('Font weight', props.locale),
      component: 'select',
      dataSource: font_weight
    },
    {
      key: 'borderStyle',
      text: i18n('Border style', props.locale),
      component: 'select',
      dataSource: solid_dashed
    },
    {
      key: 'borderSize',
      text: i18n('Border size', props.locale),
      component: 'select',
      dataSource: size
    },
    {
      key: 'color',
      text: i18n('Color', props.locale),
      component: 'color',
    },
    {
      key: 'backgroundColor',
      text: i18n('Background color', props.locale),
      component: 'color',
    },
    {
      key: 'activeColor',
      text: i18n('Color', props.locale),
      component: 'color',
    },
    {
      key: 'activeBorderColor',
      text: i18n('Color', props.locale),
      component: 'color',
    },
    {
      key: 'borderColor',
      text: i18n('Border color', props.locale),
      component: 'color',
    },
    {
      key: 'dashedValue',
      text: i18n('Dashed value', props.locale),
      component: 'input',
    },
    {
      key: 'borderDashedValue',
      text: i18n('Border dashed value', props.locale),
      component: 'input',
    },
    {
      key: 'borderRadius',
      text: i18n('Border radius', props.locale),
      component: 'input',
    },
    {
      key: 'activeRadius',
      text: i18n('Active radius', props.locale),
      component: 'input',
    },
    {
      key: 'paddingLeft',
      text: i18n('Padding left', props.locale),
      component: 'input',
    },
    {
      key: 'paddingRight',
      text: i18n('Padding right', props.locale),
      component: 'input',
    },
    {
      key: 'paddingBottom',
      text: i18n('Padding bottom', props.locale),
      component: 'input',
    },
    {
      key: 'paddingTop',
      text: i18n('Padding top', props.locale),
      component: 'input',
    }
	]

  const line_options = [
    {
      key: 'style',
      text: i18n('Style', props.locale),
      component: 'select',
      dataSource: solid_dashed
    },
    {
      key: 'smooth',
      text: i18n('Smooth', props.locale),
      component: 'select',
      dataSource: true_false
    },
    {
      key: 'size',
      text: i18n('Size', props.locale),
      component: 'select',
      dataSource: size
    },
    {
      key: 'color',
      text: i18n('Color', props.locale),
      component: 'color',
    },
    {
      key: 'dashedValue',
      text: i18n('Dashed Value', props.locale),
      component: 'input',
    }
  ]
  // const [defaultOptions, setDefaultOptions] = createSignal(default_options)
  // const [lineOptions, setLineOptions] = createSignal(line_options)
  const options = popupOtherInfo()?.overlayType?.toLocaleLowerCase().includes('line') ? line_options : default_options

  const getValue = (key:any, parentKey?: any) => {
    return (useGetOverlayStyle[`${popupOtherInfo()?.overlayType}Style`]() as any)[key]
    // const overlayType = popupOtherInfo()?.overlayType
    // switch (overlayType) {
    //   case 'point':
    //     return (pointStyle() as any)[key]
    //   case 'horizontalStraightLine':
    //     return (horizontalStraightLineStyle() as any)[key]
    //   case 'horizontalRayLine':
    //     return (horizontalRayLineStyle() as any)[key]
    //   case 'horizontalSegment':
    //     return (horizontalSegmentStyle() as any)[key]
    //   case 'verticalStraightLine':
    //     return (verticalStraightLineStyle() as any)[key]
    //   case 'verticalRayLine':
    //     return (verticalRayLineStyle() as any)[key]
    //   case 'verticalSegment':
    //     return (verticalSegmentStyle() as any)[key]
    //   case 'straightLine':
    //     return (straightLineStyle() as any)[key]
    //   case 'rayLine':
    //     return (rayLineStyle() as any)[key]
    //   case 'segment':
    //     return (segmentStyle() as any)[key]
    //   case 'arrow':
    //     return ((arrowStyle) as any)[key]
    //   case 'priceLine':
    //     return (priceLineStyle() as any)[key]
    //   case 'rect':
    //     return (rectStyle() as any)[key]
    //   case 'polygon':
    //     return (polygonStyle() as any)[key]
    //   case 'circle':
    //     return (circleStyle() as any)[key]
    //   case 'arc':
    //     return (arcStyle() as any)[key]
    //   case 'text':
    //     return (textStyle() as any)[key]
    //   // case 'tp':
    //   //   return (takeProfitStyle() as any)[parentKey][key]
    // }      
  }

  const update = (option: SelectDataSourceItem, newValue: any, parentKey: string) => {
    const chartStateObj = localStorage.getItem(`chartstatedata_${chartsession()?.id}`)
    let chartObj: ChartObjType
    if (chartStateObj) {
      chartObj = (JSON.parse(chartStateObj) as ChartObjType)
      chartObj.orderStyles = chartObj.orderStyles ?? {}
    } else {
      chartObj = {
        orderStyles: {}
      }
    }

    const perfomUpdate = (prevStyle: any) => {
      const updatedStyle = cloneDeep(prevStyle)
      lodashSet(updatedStyle, `${option.key}`, newValue)
      // lodashSet(updatedStyle, `${parentKey}.${option.key}`, newValue)
      // lodashSet(chartObj.orderStyles!, `${popupOtherInfo()?.overlayType}Style.${parentKey}.${option.key}`, newValue)
      // localStorage.setItem(`chartstatedata_${chartsession()?.id}`, JSON.stringify(chartObj))
      // setChartModified(true)
      
      instanceapi()?.overrideOverlay({ id: popupOverlay()?.id, styles: updatedStyle})
      setPopupOverlay( (prevInstance) => instanceapi()?.getOverlayById(prevInstance?.id!) ?? prevInstance)
      if (popupOverlay())
        useChartState().syncObject(popupOverlay()!)
      instanceapi()?.setStyles(chartObj.styleObj ?? {})
      
      return updatedStyle
    }

    switch (popupOtherInfo()?.overlayType) {
      case 'point':
        setPointStyle((prevStyle) => perfomUpdate(prevStyle))
        break
      case 'horizontalStraightLine':
        setHorizontalStraightLineStyle((prevStyle) => perfomUpdate(prevStyle))
        break
      case 'horizontalRayLine':
        setHorizontalRayLineStyle((prevStyle) => perfomUpdate(prevStyle))
        break
      case 'horizontalSegment':
        setHorizontalSegmentStyle((prevStyle) => perfomUpdate(prevStyle))
        break 
      case 'verticalStraightLine':
        setVerticalStraightLineStyle((prevStyle) => perfomUpdate(prevStyle))
        break
      case 'verticalRayLine':
        setVerticalRayLineStyle((prevStyle) => perfomUpdate(prevStyle))
        break
      case 'verticalSegment':
        setVerticalSegmentStyle((prevStyle) => perfomUpdate(prevStyle))
        break 
      case 'straightLine':
        setStraightLineStyle((prevStyle) => perfomUpdate(prevStyle))
        break
      case 'rayLine':
        setRayLineStyle((prevStyle) => perfomUpdate(prevStyle))
        break
      case 'segment':
        setSegmentStyle((prevStyle) => perfomUpdate(prevStyle))
        break 
      case 'arrow':
        setArrowStyle((prevStyle) => perfomUpdate(prevStyle))
        break
      case 'priceLine':
        setPriceLineStyle((prevStyle) => perfomUpdate(prevStyle))
        break
      case 'rect':
        setRectStyle((prevStyle) => perfomUpdate(prevStyle))
        break
      case 'polygon':
        setPolygonStyle((prevStyle) => perfomUpdate(prevStyle))
        break
      case 'circle':
        setCircleStyle((prevStyle) => perfomUpdate(prevStyle))
        break
      case 'arc':
        setArcStyle((prevStyle) => perfomUpdate(prevStyle))
        break
      case 'text':
        setTextStyle((prevStyle) => perfomUpdate(prevStyle))
        break
      // case 'tp':
      //   setTakeProfitStyle((prevStyle) => perfomUpdate(prevStyle))
        break
    }
    // setLabelOptions(labelOptions().map(op => ({ ...op })))
    // setLineOptions(lineOptions().map(op => ({ ...op })))
  }

  const style = useGetOverlayStyle[`${popupOtherInfo()?.overlayType}Style`]()
  if (style) {
    const parentKeys = Object.keys(style)
  }

  return (
    <Modal
      title={`Style ${getOverlayType()}`}
      onClose={() =>  setShowOverlaySetting(false)}
    >
      <div class="klinecharts-pro-overlay-setting-modal-content">
      <div class="content">
        <For each={options}>
          {
            option => {
              let component
              const value = getValue(option.key, 'lineStyle')
              if (value !== undefined) {
                switch (option.component) {
                  case 'select': {
                    component = (
                      <Select
                        style={{ width: '120px' }}
                        value={i18n(value as string, props.locale)}
                        dataSource={option.dataSource}
                        onSelected={(data) => {
                          const newValue = (data as SelectDataSourceItem).key
                          update(option, newValue, 'lineStyle')
                        }}/>
                    )
                    break
                  }
                  case 'input': {
                    // if (value && ['string', 'number'].includes(typeof value)) {
                      component = (
                        <>
                          <Show when={isArray(value)}>
                            <div style={{ width: '120px', display: 'flex', "flex-direction": 'row', "align-items": 'center', 'vertical-align': 'middle'}}>
                              <Input
                                style={{ width: '50px', "margin-right": '10px' }}
                                value={value[0] ?? '4'}
                                onChange={(v) => {
                                  let newValue = getValue(option.key, 'lineStyle')
                                  newValue[0] = Number(v)
                                  update(option, newValue, 'lineStyle')
                                }}/>
                              <Input
                                style={{ width: '50px', "margin-left": '10px' }}
                                value={value[1] ?? '4'}
                                onChange={(v) => {
                                  let newValue = getValue(option.key, 'lineStyle')
                                  newValue[1] = Number(v)
                                  update(option, newValue, 'lineStyle')
                                }}/>
                            </div>
                          </Show>
                          <Show when={ isString(value)}>
                            <Input
                              style={{ width: '120px' }}
                              value={value[1] ?? '4'}
                              onChange={(v) => {
                                let newValue = Number(v)
                                update(option, newValue, 'lineStyle')
                              }}/>
                          </Show>
                        </>
                      )
                    // }

                    break
                  }
                  case 'color': {
                    component = (
                      <Color 
                      style={{ width: '120px' }}
                      value={value}
                      onChange={(el) => {
                        const newValue = el
                        update(option, newValue, 'lineStyle')
                      }}
                      />
                    )
                    break
                  }
                }
                return (
                  <>
                    <div class="component">
                      <span>{option.text}</span>
                      {component}
                    </div>
                    
                  </>
                )
              }
            }
          }
        </For>
        {/* <For each={labelOptions()}>
          {
            option => {
              let component
              const value = getValue(option.key, 'labelStyle')
              switch (option.component) {
                case 'select': {
                  component = (
                    <Select
                      style={{ width: '120px' }}
                      value={i18n(value as string, props.locale)}
                      dataSource={option.dataSource}
                      onSelected={(data) => {
                        const newValue = (data as SelectDataSourceItem).key
                        update(option, newValue, 'labelStyle')
                      }}/>
                  )
                  break
                }
                case 'switch': {
                  const open = !!value
                  component = (
                    <Switch
                      open={open}
                      onChange={() => {
                        const newValue = !open
                        update(option, newValue, 'labelStyle')
                      }}/>
                  )
                  break
                }
                case 'color': {
                  component = (
                    <Color 
                    style={{ width: '120px' }}
                    value={value}
                    onChange={(el) => {
                      const newValue = el
                      update(option, newValue, 'labelStyle')
                    }}
                    />
                  )
                  break
                }
              }
              return (
                <>
                  <div class="component">
                    <span>{option.text}</span>
                    {component}
                  </div>
                  
                </>
              )
            }
          }
        </For> */}
				</div>
      </div> 
    </Modal>
  )
}

export default OverlaySettingModal
