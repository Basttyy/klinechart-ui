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

import { Component, createResource, createMemo, createSignal, createEffect, Show, For, onMount } from 'solid-js'
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
  let loading = true
  let list_headers = ['Order Id', 'Session Id', 'Action Type', 'Entry Point', 'Take Profit', 'Stop Loss', 'Profit/Loss', 'Exit Point', 'Entry Time', 'Exit Time', 'Edit Order', 'Close Order']

  const [value, setValue] = createSignal('')
  const [loadingVisible, setLoadingVisible] = createSignal(true)
  const [orderList, setOrderList] = createSignal<OrderInfo[]>([])

  const onOrderSelected = (order: OrderInfo) => {
    alert(`${order.orderId} is selected`)
  }

  const performOrderAction = (order: OrderInfo, action: 'edit'|'close') => {
    console.log(`${action} ${order.orderId}: was clicked`)
  }

  onMount(() => {
    setLoadingVisible(true)
    loading = true
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
        setLoadingVisible(false)
        loading = false
        setOrderList(orderlist)
      }
      getList()
    }
  })
  return (
    <div
      class="klinecharts-pro-order-panel">
      <Show when={(orderList().length < 1) && !loadingVisible()}>
        <span>No Opened Orders</span>
      </Show>
      <Show when={orderList().length > 0 || loadingVisible()}>
        <List
          class="klinecharts-pro-order-pane-list"
          loading={loadingVisible()}>
          {
            !loadingVisible() ? <li>
            <div class="order-header">
              <span style={'width: 70px'}>Order Id</span>
              <span style={'width: 70px'}>Session Id</span>
              <span style={'width: 110px'}>Action Type</span>
              <span style={'width: 110px'}>Entry Point</span>
              <span style={'width: 110px'}>Take Profit</span>
              <span style={'width: 110px'}>Stop Loss</span>
              <span style={'width: 140px'}>Profit/Loss</span>
              <span style={'width: 110px'}>Exit Point</span>
              <span style={'width: 160px'}>Entry Time</span>
              <span style={'width: 160px'}>Exit Time</span>
              <span style={'width: 110px'}>Edit Order</span>
              <span style={'width: 110px'}>Close Order</span>
            </div>
          </li> :
          <li></li>
          }
          {
            orderList().map(order => (
              <li>
                <div class='order-item'>
                  <span style={'width: 70px'}>{ order.orderId }</span>
                  <span style={'width: 70px'}>{ order.sessionId }</span>
                  <span style={'width: 110px'}>{ order.action }</span>
                  <span style={'width: 110px'}>{ order.entryPoint }</span>
                  <span style={'width: 110px'}>{ order.takeProfit }</span>
                  <span style={'width: 110px'}>{ order.stopLoss }</span>
                  <span style={'width: 140px'}>{ order.pl }</span>
                  <span style={'width: 110px'}>{ order.exitPoint }</span>
                  <span style={'width: 160px'}>{ order.entryTime }</span>
                  <span style={'width: 160px'}>{ order.exitTime }</span>
                  <span style={'width: 110px'}>
                    <Button
                      type='confirm'
                      class='edit-button'
                      onClick={() => {performOrderAction(order, 'edit')}}>Edit</Button>
                  </span>
                  <span style={'width: 110px'}>
                    <Button
                      type='cancel'
                      class='close-button'
                      onClick={() => {performOrderAction(order, 'close')}}>Close</Button>
                  </span>
                </div>
              </li>
            ))
          }
        </List>
      </Show>
    </div>
  )
}

export default OrdersPanel