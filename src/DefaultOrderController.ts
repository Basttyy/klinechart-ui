import { OrderInfo, OrderModalType, OtherResource, OrderType } from "./types";

type MethodType = 'POST'|'GET'|'DELETE'|'PUT'

export default class DefaultOrderController implements OtherResource {
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
      pl: resp.data.pl,
      sessionId: resp.data.test_session_id,
      orderId: resp.data.id,
      entryTime: resp.data.entrytime,
      action: resp.data.action
    }
  }

  async retrieveOrders(session_id?: number, type?: OrderType): Promise<OrderInfo[]> {
    const response = await this.makeFetchWithAuthAndBody('GET', `${this.apiurl}/positions`)
    const result = await response!.json()
    return (result.data || []).map((data: any) => ({
      entryPoint: data.entrypoint,
      stopLoss: data.stoploss,
      takeProfit: data.takeprofit,
      pl: data.pl,
      sessionId: data.test_session_id,
      orderId: data.id,
      entryTime: data.entrytime,
      action: data.action
    }))
  }

  async openOrder(action: OrderType, entry_price: number, stop_loss?: number | undefined, take_profit?: number | undefined): Promise<OrderInfo> {
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
      entryPoint: data.entrypoint,
      stopLoss: data.stoploss,
      takeProfit: data.takeprofit,
      pl: data.pl,
      sessionId: data.test_session_id,
      orderId: data.id,
      entryTime: data.entrytime,
      action: data.action
    }
  }

  async closeOrder(order_id: number): Promise<boolean> {
    try {
      const response = await this.makeFetchWithAuthAndBody('PUT', `${this.apiurl}/positions/${order_id}`)
      const data = await response?.json()
      return true
    } catch (err) {
      return false
    }
  }

  async modifyOrder(order_id: number, action?: OrderType, entry_price?: number | undefined, stop_loss?: number | undefined, take_profit?: number | undefined, pl?: number | undefined): Promise<OrderInfo> {
    const response = await this.makeFetchWithAuthAndBody('PUT', `${this.apiurl}/positions/${order_id}`, {
      test_session_id: this.testsesson_id,
      action: action,
      entrypoint: entry_price,
      stoploss: stop_loss,
      takeprofit: take_profit,
    })
    const data = await response?.json()
    return {
      entryPoint: data.entrypoint,
      stopLoss: data.stoploss,
      takeProfit: data.takeprofit,
      pl: data.pl,
      sessionId: data.test_session_id,
      orderId: data.id,
      entryTime: data.entrytime,
      action: data.action
    }
  }

  launchOrderModal(type: OrderModalType, currentprice: number): void {
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