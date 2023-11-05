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


import { Component, For, createSignal } from 'solid-js'
import { Modal, Select, Switch, Color, Input } from '../../../component'
import type { SelectDataSourceItem } from '../../../component'
import useDataSource from '../../setting-modal/settings/dataSource'

import i18n from '../../../i18n'
import { setShowPositionSetting, popupOtherInfo, getOverlayType } from '../../../store/overlaySettingStore'
import { 
  buyStyle, setBuyStyle,
  sellStyle, setSellStyle,
  takeProfitStyle, setTakeProfitStyle,
  stopLossStyle, setStopLossStyle, buyLimitStyle, buyStopStyle, sellLimitStyle, sellStopStyle, setBuyLimitStyle, setBuyStopStyle, setSellLimitStyle, setSellStopStyle
} from '../../../store/overlaystyle/positionStyleStore'
import { chartsession, instanceapi } from '../../../ChartProComponent'
import { ChartObjType } from '../../../types'

import { cloneDeep, set as lodashSet } from 'lodash'
import { setChartModified } from '../../../store/chartStateStore'

export interface PositionSettingModalProps {
  locale: string
}
  
const PositionSettingModal: Component<PositionSettingModalProps> = props => {
	const { font_size, font_family, font_weight, fill_stroke, solid_dashed, size } = useDataSource(props.locale)
	const label_options = [
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
      text: i18n('Border Style', props.locale),
      component: 'select',
      dataSource: solid_dashed
    },
    {
      key: 'borderSize',
      text: i18n('Border Size', props.locale),
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
      key: 'borderColor',
      text: i18n('Border color', props.locale),
      component: 'color',
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
  const [labelOptions, setLabelOptions] = createSignal(label_options)
  const [lineOptions, setLineOptions] = createSignal(line_options)
  
	const getValue = (key:any, parentKey: any) => {
    const overlayType = popupOtherInfo()?.overlayType
    switch (overlayType) {
      case 'buy':
        return (buyStyle() as any)[parentKey][key]
      case 'buylimit':
        return (buyLimitStyle() as any)[parentKey][key]
      case 'buystop':
        return (buyStopStyle() as any)[parentKey][key]
      case 'sell':
        return (sellStyle() as any)[parentKey][key]
      case 'selllimit':
        return (sellLimitStyle() as any)[parentKey][key]
      case 'sellstop':
        return (sellStopStyle() as any)[parentKey][key]
      case 'sl':
        return (stopLossStyle() as any)[parentKey][key]
      case 'tp':
        return (takeProfitStyle() as any)[parentKey][key]
    }      
  };

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
      lodashSet(updatedStyle, `${parentKey}.${option.key}`, newValue)
      lodashSet(chartObj.orderStyles!, `${popupOtherInfo()?.overlayType}Style.${parentKey}.${option.key}`, newValue)
      localStorage.setItem(`chartstatedata_${chartsession()?.id}`, JSON.stringify(chartObj))
      setChartModified(true)
      instanceapi()?.setStyles(chartObj.styleObj ?? {})
      return updatedStyle
    }

    switch (popupOtherInfo()?.overlayType) {
      case 'buy':
        setBuyStyle((prevStyle) => perfomUpdate(prevStyle))
        break
      case 'buylimit':
        setBuyLimitStyle((prevStyle) => perfomUpdate(prevStyle))
        break
      case 'buystop':
        setBuyStopStyle((prevStyle) => perfomUpdate(prevStyle))
        break
      case 'sell':
        setSellStyle((prevStyle) => perfomUpdate(prevStyle))
        break
      case 'selllimit':
        setSellLimitStyle((prevStyle) => perfomUpdate(prevStyle))
        break
      case 'sellstop':
        setSellStopStyle((prevStyle) => perfomUpdate(prevStyle))
        break
      case 'sl':
        setStopLossStyle((prevStyle) => perfomUpdate(prevStyle))
        break
      case 'tp':
        setTakeProfitStyle((prevStyle) => perfomUpdate(prevStyle))
        break
    }
    // setLabelOptions(labelOptions().map(op => ({ ...op })))
    // setLineOptions(lineOptions().map(op => ({ ...op })))
  }

  return (
    <Modal
      title={`Style ${getOverlayType()}`}
      onClose={() =>  setShowPositionSetting(false)}
    >
      <div class="klinecharts-pro-position-setting-modal-content">
				<div class="content">
            <For each={lineOptions()}>
              {
                option => {
                  let component
                  const value = getValue(option.key, 'lineStyle')
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
            </For>
						<For each={labelOptions()}>
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
            </For>
				</div>
      </div> 
    </Modal>
  )
}

export default PositionSettingModal
