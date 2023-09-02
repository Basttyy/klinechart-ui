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


import { Component, createEffect, For, createSignal } from 'solid-js'
import { Modal, Select, Switch, Color } from '../../../component'
import type { SelectDataSourceItem } from '../../../component'
import useDataSource from '../../setting-modal/settings/dataSource'

import i18n from '../../../i18n'
import { setShowBuySetting, popupOtherInfo, getOverlayType } from '../../../store/overlaySettingStore'
import { 
  buyStyle, setBuyStyle,
  sellStyle, setSellStyle,
  takeProfitStyle, setTakeProfitStyle,
  stopLossStyle, setStopLossStyle
} from '../../../store/overlayStyleStore'

export interface BuySettingModalProps {
  locale: string
}

  
const BuySettingModal: Component<BuySettingModalProps> = props => {
	const { font_size, font_family, font_weight, fill_stroke, solid_dashed, size } = useDataSource(props.locale)
	const options = [
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
  
	const getValue = (key:any) => {
    if(popupOtherInfo()?.overlayType == 'buy'){
      return (buyStyle() as any)[key];
    } else if(popupOtherInfo()?.overlayType == 'sell') {
      return (sellStyle() as any)[key];
    } else if(popupOtherInfo()?.overlayType == 'sl') {
      return (stopLossStyle() as any)[key];
    } else if(popupOtherInfo()?.overlayType == 'tp') {
      return (takeProfitStyle() as any)[key];
    }
  };

  const update = (option:SelectDataSourceItem, newValue: any) => {
    if(popupOtherInfo()?.overlayType == 'buy'){
      setBuyStyle((prevStyle) => ({ ...prevStyle, [option.key]: newValue}));
    } else if(popupOtherInfo()?.overlayType == 'sell') {
      setSellStyle((prevStyle) => ({ ...prevStyle, [option.key]: newValue}));
    } else if(popupOtherInfo()?.overlayType == 'sl') {
      setStopLossStyle((prevStyle) => ({ ...prevStyle, [option.key]: newValue}));
    } else if(popupOtherInfo()?.overlayType == 'tp') {
      setTakeProfitStyle((prevStyle) => ({ ...prevStyle, [option.key]: newValue}));
    }
  }

  return (
    <Modal
      title={`Style ${getOverlayType()}`}
      onClose={() =>  setShowBuySetting(false)}
    >
      <div class="klinecharts-pro-buy-setting-modal-content">
				<div class="content">
						<For each={options}>
              {
                option => {
                  let component
                  const value = getValue(option.key)
                  switch (option.component) {
                    case 'select': {
                      component = (
                        <Select
                          style={{ width: '120px' }}
                          value={i18n(value as string, props.locale)}
                          dataSource={option.dataSource}
                          onSelected={(data) => {
                            const newValue = (data as SelectDataSourceItem).key
                            update(option, newValue)
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
                            update(option, newValue)
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
                          update(option, newValue)
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

export default BuySettingModal
