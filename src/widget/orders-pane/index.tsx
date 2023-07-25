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

import { Component, createResource, createMemo, createSignal, createEffect, Show } from 'solid-js'
import { OverlayCreate, OverlayMode } from 'klinecharts'
import i18n from '../../i18n'
import { List, Checkbox, Input, Button, Loading } from '../../component'
import { Datafeed, OrderInfo, OtherResource, OrderType } from '../../types'

export interface OrderPanelProps {
  context: string
  otherController: OtherResource
  // onOrderSelected: (order: OrderInfo) => void
  // onMouseDown: (event: MouseEvent) => void
}

const GROUP_ID = 'order_panel'

const OrdersPanel: Component<OrderPanelProps> = props => {
  let loading = false
  const [value, setValue] = createSignal('')
  const [loadingVisible, setLoadingVisible] = createSignal(false)
  const [orderList, setOrderList] = createSignal<OrderInfo[]>([])

  const onOrderSelected = (order: OrderInfo) => {
    alert(`${order.orderId} is selected`)
  }

  const performOrderAction = (order: OrderInfo, action: 'edit'|'close') => {

  }

  createEffect(() => {
    if (!loading) {
      console.log("executing")
      loading = true
      setLoadingVisible(true)
      if (!loading) { //Will check if order list is set in localstorage
        // get the order list from local storage
        const getList = () => {

          setLoadingVisible(false)
          loading = false
        }
        getList()
      } else {  //we will retrieve from api service instead
        const getList =async (action?: OrderType) => {
          const orderlist = await props.otherController.retrieveOrders()
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
      <Show when={loadingVisible()}>
        <Loading />
      </Show>
      <Show when={orderList().length < 1 && !loadingVisible()}>
        <span>No Opened Orders</span>
      </Show>
      <Show when={orderList().length > 0}>
        <List
          class="klinecharts-pro-symbol-search-modal-list"
          loading={false}
          dataSource={orderList() ?? []}
          renderItem={(order: OrderInfo) => (
            <li
              onClick={() => {
                onOrderSelected(order)
              }}>
              <div class='order-item'>
                <span>{ order.orderId }</span>
                <span>{ order.sessionId }</span>
                <span>{ order.action }</span>
                <span>{ order.entryPoint }</span>
                <span>{ order.takeProfit }</span>
                <span>{ order.stopLoss }</span>
                <span>{ order.pl }</span>
                <span>{ order.entryTime }</span>
                <Button
                  type='confirm'
                  class='edit-button'
                  onClick={() => {performOrderAction(order, 'edit')}}>Edit</Button>
                <Button
                  type='cancel'
                  class='close-button'
                  onClick={() => {performOrderAction(order, 'close')}}>Close</Button>
              </div>
            </li>
          )}>
        </List>
      </Show>
    </div>
  )
}

export default OrdersPanel