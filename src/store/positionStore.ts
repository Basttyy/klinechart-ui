import { Chart, Nullable } from 'klinecharts';
import { OrderInfo } from '../types';
import { createSignal } from 'solid-js';


export const [chartapi, setChartapi] = createSignal<Nullable<Chart>>(null);

// export const useOrder = () => {

// };

export const drawOrder = (order: OrderInfo|null, widget: Nullable<Chart>) => {
  if (!order)
    return
  let name = ''
  let lock = false;
  order!.entryPoint = order?.entryPoint! - 0.00001+0.00001
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
      } else if (order.stopLoss && order.takeProfit) {
        name = 'buyProfitLossLine'
      }
      break
    case 'buystop':
      if (!order?.stopLoss && !order?.takeProfit) {
        name = 'buystopLine'
      } else if (order.stopLoss && !order.takeProfit) {
        name = 'buystopLossLine'
      } else if (!order.stopLoss && order.takeProfit) {
        name = 'buystopProfitLine'
      } else if (order.stopLoss && order.takeProfit) {
        name = 'buystopProfitLossLine'
      }
      break
    case 'buylimit':
      if (!order?.stopLoss && !order?.takeProfit) {
        name = 'buylimitLine'
      } else if (order.stopLoss && !order.takeProfit) {
        name = 'buylimitLossLine'
      } else if (!order.stopLoss && order.takeProfit) {
        name = 'buylimitProfitLine'
      } else if (order.stopLoss && order.takeProfit) {
        name = 'buylimitProfitLossLine'
      }
      break
    case 'sell':
      if (!order?.stopLoss && !order?.takeProfit) {
        name = 'sellLine'
      } else if (order.stopLoss && !order.takeProfit) {
        name = 'sellLossLine'
      } else if (!order.stopLoss && order.takeProfit) {
        name = 'sellProfitLine'
      } else if (order.stopLoss && order.takeProfit) {
        name = 'sellProfitLossLine'
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
  console.log(points)
  widget?.createOverlay({
    name,
    id: `orderline_${order?.orderId}`,
    groupId: 'orderLine',
    points,
    lock
  })
};

// return { drawOrder };