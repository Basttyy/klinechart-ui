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
import { useGetOverlayStyle, useSetOverlayStyle } from '../../../store/overlaystyle/useOverlayStyles'
import { getOptions } from './options/options'

export interface OverlaySettingModalProps {
  locale: string
}

const OverlaySettingModal: Component<OverlaySettingModalProps> = props => {
  const options = getOptions(props.locale)

  const getValue = (key:any, parentKey?: any) => {
    if (parentKey) {
      if (popupOverlay()?.styles![parentKey][key]) {
        return popupOverlay()?.styles![parentKey][key]
      } else {
        return (useGetOverlayStyle[`${popupOtherInfo()?.overlayType}Style`]() as any)[parentKey][key]
      }
    } else {
      if (popupOverlay()?.styles![key]) {
        return popupOverlay()?.styles![key]
      } else {
        return (useGetOverlayStyle[`${popupOtherInfo()?.overlayType}Style`]() as any)[key]
      }
    }
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
      parentKey ? lodashSet(updatedStyle, `${parentKey}.${option.key}`, newValue) : lodashSet(updatedStyle, `${option.key}`, newValue)
      
      instanceapi()?.overrideOverlay({ id: popupOverlay()?.id, styles: updatedStyle})
      setPopupOverlay( (prevInstance) => instanceapi()?.getOverlayById(prevInstance?.id!) ?? prevInstance)
      if (popupOverlay())
        useChartState().syncObject(popupOverlay()!)
      instanceapi()?.setStyles(chartObj.styleObj ?? {})
      
      return updatedStyle
    }
    const name = popupOtherInfo()?.overlayType;
    if (useSetOverlayStyle[`set${name}Style`])
      useSetOverlayStyle[`set${name}Style`]((prevstyle) => perfomUpdate(prevstyle))
  }

  const style = useGetOverlayStyle[`${popupOtherInfo()?.overlayType}Style`] ? useGetOverlayStyle[`${popupOtherInfo()?.overlayType}Style`]() : undefined
  let optionkeys: string[] = []
  let outerkeys: string[] = []
  if (style) {
    optionkeys = Object.keys(options)
    outerkeys = Object.keys(style)
  }

  return (
    <Modal
      title={`Style ${getOverlayType()}`}
      onClose={() =>  setShowOverlaySetting(false)}
    >
      <div class="klinecharts-pro-overlay-setting-modal-content">
      <div class="content">
        <For each={outerkeys}>
          {
            outerkey => {
              if (optionkeys.includes(outerkey)) {
                return (
                  <>
                    <div>{outerkey}</div>
                    <For each={options[outerkey]}>
                      {
                        option => {
                          let component
                          const value = getValue(option.key, outerkey)
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
                                      update(option, newValue, outerkey)
                                    }}/>
                                )
                                break
                              }
                              case 'input': {
                                component = (
                                  <>
                                    <Show when={isArray(value)}>
                                      <div style={{ width: '120px', display: 'flex', "flex-direction": 'row', "align-items": 'center', 'vertical-align': 'middle'}}>
                                        <Input
                                          style={{ width: '50px', "margin-right": '10px' }}
                                          value={value[0] ?? '4'}
                                          onChange={(v) => {
                                            let newValue = getValue(option.key, outerkey)
                                            newValue[0] = Number(v)
                                            update(option, newValue, outerkey)
                                          }}/>
                                        <Input
                                          style={{ width: '50px', "margin-left": '10px' }}
                                          value={value[1] ?? '4'}
                                          onChange={(v) => {
                                            let newValue = getValue(option.key, outerkey)
                                            newValue[1] = Number(v)
                                            update(option, newValue, outerkey)
                                          }}/>
                                      </div>
                                    </Show>
                                    <Show when={ !isArray(value)}>
                                      <Input
                                        style={{ width: '120px' }}
                                        value={value ?? '4'}
                                        onChange={(v) => {
                                          let newValue = Number(v)
                                          update(option, newValue, outerkey)
                                        }}/>
                                    </Show>
                                  </>
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
                                    update(option, newValue, outerkey)
                                  }}
                                  />
                                )
                                break
                              }
                            }
                            if (component) {
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
                      }
                    </For>
                  </>
                )
              }
            }
          }
        </For>
				</div>
      </div> 
    </Modal>
  )
}

export default OverlaySettingModal
