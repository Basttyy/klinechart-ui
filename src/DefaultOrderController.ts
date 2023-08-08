import { OrderInfo, OrderModalType, OrderModifyInfo, OrderPlacedCallback, OrderResource, OrderType } from "./types";

type MethodType = 'POST'|'GET'|'DELETE'|'PUT'

export default class DefaultOrderController implements OrderResource {
  constructor (_testsession_id: number, _apiurl: string, _apikey: string) {
    this.apiurl = _apiurl
    this.apikey = _apikey
    this.testsesson_id = _testsession_id
  }

  private apikey: string
  private apiurl: string
  private testsesson_id: number

  async retrieveOrder(order_id: number): Promise<OrderInfo> {
    const response = await this.makeFetchWithAuthAndBody('GET', `${this.apiurl}/positions/${order_id}`)
    const resp = await response?.json()
    return {
      entryPoint: resp.data.entrypoint,
      stopLoss: resp.data.stoploss,
      takeProfit: resp.data.takeprofit,
      lotSize: resp.data.lotsize,
      pl: resp.data.pl,
      sessionId: resp.data.test_session_id,
      orderId: resp.data.id,
      entryTime: resp.data.entrytime,
      exitTime: resp.data.exittime,
      exitPoint: resp.data.exitpoint,
      action: resp.data.action
    }
  }

  async retrieveOrders(action?: OrderType, session_id?: number): Promise<OrderInfo[]> {
    try {
      const response = await this.makeFetchWithAuthAndBody('GET', `${this.apiurl}/positions`)
      const result = await response!.json()
      return (result.data || []).map((data: any) => ({
        entryPoint: data.entrypoint,
        stopLoss: data.stoploss,
        takeProfit: data.takeprofit,
        lotSize: data.lotsize,
        pl: data.pl,
        sessionId: data.test_session_id,
        orderId: data.id,
        entryTime: data.entrytime,
        exitTime: data.exittime,
        exitPoint: data.exitpoint,
        action: data.action
      }))
    } catch (err) {
      return []
    }
  }

  async openOrder(action: OrderType, lot_size: number, entry_price: number, stop_loss?: number, take_profit?: number): Promise<OrderInfo|null> {
    const response = await this.makeFetchWithAuthAndBody('POST', `${this.apiurl}/positions`, {
      test_session_id: this.testsesson_id,
      action: action,
      entrypoint: entry_price,
      stoploss: stop_loss,
      takeprofit: take_profit,
    })
    // const response = await fetch(`${this.apiurl}/orders/${order_id}`)
    const data = await response?.json()
    return {
      orderId: data.id,
      sessionId: data.test_session_id,
      action: data.action,
      entryPoint: data.entrypoint,
      exitPoint: data.exitpoint,
      stopLoss: data.stoploss,
      takeProfit: data.takeprofit,
      lotSize: data.lotsize,
      pips: data.pips,
      pl: data.pl,
      entryTime: data.entrytime,
      exitTime: data.exittime,
      exitType: data.exittype,
      partials: data.partials
    }
  }

  async closeOrder(order_id: number, lotsize?: number): Promise<OrderInfo|null> {
    try {
      const response = await this.makeFetchWithAuthAndBody('PUT', `${this.apiurl}/positions/${order_id}`)
      const data = await response?.json()
      return data
    } catch (err) {
      return null
    }
  }

  async modifyOrder(order: OrderModifyInfo): Promise<OrderInfo|null> {
    const response = await this.makeFetchWithAuthAndBody('PUT', `${this.apiurl}/positions/${order.id}`, order)
    const data = await response?.json()
    return {
      orderId: data.id,
      sessionId: data.test_session_id,
      action: data.action,
      entryPoint: data.entrypoint,
      exitPoint: data.exitpoint,
      stopLoss: data.stoploss,
      takeProfit: data.takeprofit,
      lotSize: data.lotsize,
      pips: data.pips,
      pl: data.pl,
      entryTime: data.entrytime,
      exitTime: data.exittime,
      exitType: data.exittype,
      partials: data.partials
    }
  }

  launchOrderModal(type: OrderModalType, callback: OrderPlacedCallback): void {
    return ;
  }

  private async makeFetchWithAuthAndBody (method: MethodType, endpoint: string, params?: object): Promise<Response|null> {
    const options: RequestInit = {
      method: method,
      credentials: "include",
      headers: {
        Accept: 'application/json', 
        'Content-Type': 'application/json',
        authorization: `Bearer ${this.apikey}`
      },
      body: params ? JSON.stringify(params) : null
    };
    try {
      const res = await fetch(`${endpoint}`, options)
      return res
      // const data = await res.json()
      // return data
    } catch (err:any) {
      alert(err.message ?? 'An error occured')
      // alert('error', err.message ?? 'An error occured')
      return null
    }
  }
}