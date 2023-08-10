import { Chart, Nullable, Overlay } from 'klinecharts';
import { ExitType, OrderInfo, OrderModifyInfo, OrderResource, OrderType } from '../types';
import { createSignal } from 'solid-js';
import { currenttick } from './tickStore';
import { instanceapi } from '../ChartProComponent';

export const [chartapi, setChartapi] = createSignal<Nullable<Chart>>(null);
export const [ordercontr, setOrderContr] = createSignal<Nullable<OrderResource>>(null)
export const [orderList, setOrderList] = createSignal<OrderInfo[]>([])

export const useOrder = () => {
  /**
   * This method may be used interchangeably with calcStopOrTarget
   * 
   * @param top
   * @param middle 
   * @param dp 
   * @param usereal 
   * @param buysell 
   * @returns string
   */
  const calcTarget = (top:number, middle:number, dp:number, usereal: boolean = false, buysell: 'buy'|'sell' = 'buy'): string => {
    let multiplier = 10**(dp-1), value: string
    if (buysell === 'buy')
      value = usereal ? ((top - middle)*multiplier).toFixed(2) : (top - middle).toFixed(dp)
    else
      value = usereal ? ((middle - top)*multiplier).toFixed(2) : (middle - top).toFixed(dp)
    return value
  }
  
  /**
   * Calculate the distance between Entry Point and Stoploss or Takeprofit
   * 
   * @param middle the base line you want to calculate from
   * @param bottom the target line to calculate to
   * @param dp number of decimal places round up to
   * @param usereal should result be in pips or points, true will return pips
   * @param buysell are we calculating for a buy trade or a sell one
   * @returns return a string of the difference in pips or points
   */
  const calcStopOrTarget = (middle:number, bottom:number, dp:number, usereal: boolean = false, buysell: 'buy'|'sell' = 'buy'): string => {
    let multiplier = 10**(dp-1), value: string
    if (buysell === 'sell')
      value = usereal ? ((middle - bottom)*multiplier).toFixed(2) : (middle - bottom).toFixed(dp)
    else
      value = usereal ? ((bottom - middle)*multiplier).toFixed(2) : (bottom - middle).toFixed(dp)
    
    return value
  }
  
  /**
   * Calculate the profit or loss of a trade in pips or points
   * 
   * @param middle the entry point of the trade
   * @param dp number of decimal places to round up to
   * @param usereal should result be in pips or points, true will return pips
   * @param buysell are we calculating for a buy trade or a sell one
   * @returns return a string of profit or loss in pips or points
   */
  const calcPL = (middle:number, dp:number, usereal: boolean = false, buysell: 'buy'|'sell' = 'buy'): string => {
    let multiplier = 10**(dp-1), value: string
    if (buysell === 'buy')
      value = usereal ? ((currenttick()!.close-middle) * multiplier).toFixed(2) : (currenttick()!.close-middle).toFixed(dp)
    else
      value = usereal ? ((middle-currenttick()!.close) * multiplier).toFixed(2) : (middle-currenttick()!.close).toFixed(dp)
    
    return value
  }

  const triggerPending = (overlay: Overlay, action: OrderType) => {
    const doJob = async () => {
      let id = overlay.id
      let order = orderList().find(order => order.orderId === parseInt(id.replace('orderline_', ''))) ?? null
      if (order) {
        order.action = action
        instanceapi()?.removeOverlay({
          id,
          groupId: overlay.groupId,
          name: overlay.name
        })
        const updatedorder = await ordercontr()?.modifyOrder({
          id: order.orderId,
          action: order.action,
          entrypoint: order.entryPoint
        })!
        if (updatedorder) {
          const orderlist = orderList().map(order => (order.orderId === updatedorder.orderId ? updatedorder : order))
          setOrderList(orderlist)
          drawOrder(updatedorder)
        }
      }
    }
    doJob()
  }

  const updateOrder = (order: OrderModifyInfo) => {
    const doJob = async () => {
      await ordercontr()?.modifyOrder(order)
    }
    doJob()
  }

  const removeStopOrTP = (overlay: Overlay, removal: 'sl'|'tp') => {
    const doJob = async () => {
      let id = overlay.id
      let order = orderList().find(order => order.orderId === parseInt(id.replace('orderline_', ''))) ?? null
      if (order) {
        order = await ordercontr()?.unsetSlOrTP(order.orderId, removal)!
        if (order) {
          instanceapi()?.removeOverlay({
            id,
            groupId: overlay.groupId,
            name: overlay.name
          })
          const orderlist = orderList().map(orda => (orda.orderId === order?.orderId ? order : orda))
          setOrderList(orderlist)
          drawOrder(order)
        }
      }
    }
    doJob()
  }

  const closeOrder = (overlay: Overlay, type: ExitType): void => {
    let id = overlay.id
    let order: OrderInfo|null
    if (order = orderList().find(order => order.orderId === parseInt(id.replace('orderline_', ''))) ?? null) { // order found
      updateOrder({
        id: order.orderId,
        exitpoint: currenttick()?.close,
        exittype: type,
        pips: order.pips,   //in a real application this should be calculated on backend
        pl: order.pl    //in a real application this should be calculated on backend
      })
      
      instanceapi()?.removeOverlay({
        id: overlay.id,
        groupId: overlay.groupId,
        name: overlay.name
      })
    }
  }

  return { calcTarget, calcStopOrTarget, calcPL, triggerPending, removeStopOrTP, updateOrder, closeOrder }
};

export const drawOrder = (order: OrderInfo|null) => {
  if (!order)
    return
  let name = ''
  let lock = false;
  order!.entryPoint = order?.entryPoint! - 0.00001+0.00001   //for some reason adding and subtracting the same value stop the overlay from vanishing when dragged
  order!.stopLoss = order?.stopLoss! - 0.00001+0.00001
  order!.takeProfit = order?.takeProfit! - 0.00001+0.00001
  let points = [
    { timestamp: Date.parse(order?.entryTime!), value: order?.entryPoint }
  ]
  switch (order?.action) {
    case 'buy':
      if (!order?.stopLoss && !order?.takeProfit) {
        name = 'buyLine'
        lock = true
      } else if (order.stopLoss && !order.takeProfit) {
        name = 'buyLossLine'
        points.push({ timestamp: Date.parse(order?.entryTime!), value: order.stopLoss })
      } else if (!order.stopLoss && order.takeProfit) {
        name = 'buyProfitLine'
        points.push({ timestamp: Date.parse(order?.entryTime!), value: order.takeProfit })
      } else if (order.stopLoss && order.takeProfit) {
        name = 'buyProfitLossLine'
        points.push({ timestamp: Date.parse(order?.entryTime!), value: order.takeProfit })
        points.push({ timestamp: Date.parse(order?.entryTime!), value: order.stopLoss })
      }
      break
    case 'buystop':
      if (!order?.stopLoss && !order?.takeProfit) {
        name = 'buystopLine'
      } else if (order.stopLoss && !order.takeProfit) {
        name = 'buystopLossLine'
        points.push({ timestamp: Date.parse(order?.entryTime!), value: order.stopLoss })
      } else if (!order.stopLoss && order.takeProfit) {
        name = 'buystopProfitLine'
        points.push({ timestamp: Date.parse(order?.entryTime!), value: order.takeProfit })
      } else if (order.stopLoss && order.takeProfit) {
        name = 'buystopProfitLossLine'
        points.push({ timestamp: Date.parse(order?.entryTime!), value: order.takeProfit })
        points.push({ timestamp: Date.parse(order?.entryTime!), value: order.stopLoss })
      }
      break
    case 'buylimit':
      if (!order?.stopLoss && !order?.takeProfit) {
        name = 'buyLimitLine'
      } else if (order.stopLoss && !order.takeProfit) {
        name = 'buyLimitLossLine'
        points.push({ timestamp: Date.parse(order?.entryTime!), value: order.stopLoss })
      } else if (!order.stopLoss && order.takeProfit) {
        name = 'buyLimitProfitLine'
        points.push({ timestamp: Date.parse(order?.entryTime!), value: order.takeProfit })
      } else if (order.stopLoss && order.takeProfit) {
        name = 'buyLimitProfitLossLine'
        points.push({ timestamp: Date.parse(order?.entryTime!), value: order.takeProfit })
        points.push({ timestamp: Date.parse(order?.entryTime!), value: order.stopLoss })
      }
      break
    case 'sell':
      if (!order?.stopLoss && !order?.takeProfit) {
        name = 'sellLine'
        lock = true
      } else if (order.stopLoss && !order.takeProfit) {
        name = 'sellLossLine'
        points.push({ timestamp: Date.parse(order?.entryTime!), value: order.stopLoss })
      } else if (!order.stopLoss && order.takeProfit) {
        name = 'sellProfitLine'
        points.push({ timestamp: Date.parse(order?.entryTime!), value: order.takeProfit })
      } else if (order.stopLoss && order.takeProfit) {
        name = 'sellProfitLossLine'
        points.push({ timestamp: Date.parse(order?.entryTime!), value: order.takeProfit })
        points.push({ timestamp: Date.parse(order?.entryTime!), value: order.stopLoss })
      }
      break
    case 'sellstop':
      if (!order?.stopLoss && !order?.takeProfit) {
        name = 'sellstopLine'
      } else if (order.stopLoss && !order.takeProfit) {
        name = 'sellstopLossLine'
      } else if (!order.stopLoss && order.takeProfit) {
        name = 'sellstopProfitLine'
      } else if (order.stopLoss && order.takeProfit) {
        name = 'sellstopProfitLossLine'
      }
      break
    case 'selllimit':
      if (!order?.stopLoss && !order?.takeProfit) {
        name = 'selllimitLine'
      } else if (order.stopLoss && !order.takeProfit) {
        name = 'selllimitLossLine'
      } else if (!order.stopLoss && order.takeProfit) {
        name = 'selllimitProfitLine'
      } else if (order.stopLoss && order.takeProfit) {
        name = 'selllimitProfitLossLine'
      }
      break
    default:
      break
  }
  instanceapi()?.createOverlay({
    name,
    id: `orderline_${order?.orderId}`,
    groupId: 'orderLine',
    points,
    lock
  })
};

// return { drawOrder };