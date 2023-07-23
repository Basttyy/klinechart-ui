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

import { Component, createResource, createMemo, createSignal, createEffect } from 'solid-js'
import { OverlayCreate, OverlayMode } from 'klinecharts'
import i18n from '../../i18n'
import { List, Checkbox, Input } from '../../component'
import { Datafeed, OrderInfo, OrderResource, OrderType } from '../../types'

export interface OrderPanelProps {
  context: string
  ordercontroller: OrderResource
  onOrderSelected: (order: OrderInfo) => void
  // onMouseDown: (event: MouseEvent) => void
}

const GROUP_ID = 'order_panel'

const OrdersPanel: Component<OrderPanelProps> = props => {
  let loading = false
  const [value, setValue] = createSignal('')
  const [loadingVisible, setLoadingVisible] = createSignal(false)
  const [orderList, setOrderList] = createSignal<OrderInfo[]>([])

  createEffect(() => {
    if (!loading) {
      loading = true
      setLoadingVisible(true)
      if (loading) { //Will check if order list is set in localstorage
        // get the order list from local storage
        const getList = () => {

          setLoadingVisible(false)
          loading = false
        }
        getList()
      } else {  //we will retrieve from api service instead
        const getList =async (action?: OrderType) => {
          const orderlist = await props.ordercontroller.retrieveOrders(action)
          setOrderList(orderlist)
          setLoadingVisible(false)
          loading = false
        }
        getList()
      }
    }
  })
  return (
    <div
      class="klinecharts-pro-order-panel">
      <List
        class="klinecharts-pro-symbol-search-modal-list"
        loading={loadingVisible()}
        dataSource={orderList() ?? []}
        renderItem={(order: OrderInfo) => (
          <li
            onClick={() => {
              props.onOrderSelected(order)
            }}>
            <div>
              {/* <Show when={order.logo}>
                <img alt="order" src={order.logo}/>
              </Show> */}
              <span title={order.name ?? ''}>{order.shortName ?? order.ticker}{`${order.name ? `(${order.name})` : ''}`}</span>
            </div>
            {order.exchange ?? ''}
          </li>
        )}>
      </List>
      { props.context }
      <span class="split-line"/>
      { props.context }
      <span class="split-line"/>
      { props.context }
      <span class="split-line"/>
      { props.context }
      <span class="split-line"/>
      { props.context }
      <span class="split-line"/>
      { props.context }
      <span class="split-line"/>
      { props.context }
      <span class="split-line"/>
      { props.context }
      <span class="split-line"/>
      { props.context }
      <span class="split-line"/>
      { props.context }
      <span class="split-line"/>
      { props.context }
      <span class="split-line"/>
      { props.context }
      <span class="split-line"/>
      { props.context }
      <span class="split-line"/>
      { props.context }
      <span class="split-line"/>
      { props.context }
      <span class="split-line"/>
      { props.context }
      <span class="split-line"/>
      { props.context }
      <span class="split-line"/>
      { props.context }
      <span class="split-line"/>
      { props.context }
      <span class="split-line"/>
      { props.context }
      <span class="split-line"/>
      { props.context }
      <span class="split-line"/>
      { props.context }
      <span class="split-line"/>
      { props.context }
      <span class="split-line"/>
      { props.context }
      <span class="split-line"/>
      { props.context }
    </div>
  )
}

export default OrdersPanel