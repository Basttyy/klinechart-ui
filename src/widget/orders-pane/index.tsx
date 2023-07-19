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

import { Component, createMemo, createSignal } from 'solid-js'

import { OverlayCreate, OverlayMode } from 'klinecharts'

import { List } from '../../component'

export interface OrderPanelProps {
  locale: string
  onDrawingItemClick: (overlay: OverlayCreate) => void
  onModeChange: (mode: string) => void,
  onLockChange: (lock: boolean) => void
  onVisibleChange: (visible: boolean) => void
  onRemoveClick: (groupId: string) => void
}

const GROUP_ID = 'order_tools'

const OrdersPanel: Component<OrderPanelProps> = props => {
  const [singleLineIcon, setSingleLineIcon] = createSignal('horizontalStraightLine')
  const [moreLineIcon, setMoreLineIcon] = createSignal('priceChannelLine')
  const [polygonIcon, setPolygonIcon] = createSignal('circle')
  const [fibonacciIcon, setFibonacciIcon] = createSignal('fibonacciLine')
  const [waveIcon, setWaveIcon] = createSignal('xabcd')

  const [modeIcon, setModeIcon] = createSignal('weak_magnet')
  const [mode, setMode] = createSignal('normal')

  const [lock, setLock] = createSignal(false)

  const [visible, setVisible] = createSignal(true)

  const [popoverKey, setPopoverKey] = createSignal('')

  return (
    <div
      class="klinecharts-pro-order-panel">
        Orders Panel
    </div>
  )
}

export default OrdersPanel