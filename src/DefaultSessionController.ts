import { ChartSessionResource, sessionModifyType, sessionType } from "./types";

type MethodType = 'POST'|'GET'|'DELETE'|'PUT'

export default class DefaultSessionController implements ChartSessionResource {
  constructor (_apiurl: string, _apikey: string) {
    this.apiurl = _apiurl
    this.apikey = _apikey
  }
  
  private apikey: string
  private apiurl: string

  async retrieveSession(id: number): Promise<sessionType | null> {
    const response = await this.makeFetchWithAuthAndBody('GET', `${this.apiurl}/test-sessions/${id}`)
    const resp = await response?.json()
    return {
      id: resp.data.id,
      starting_bal: resp.data.starting_bal,
      current_bal: resp.data.current_bal,
      equity: resp.data.equity,
      strategy_id: resp.data.strategy_id,
      user_id: resp.data.user_id,
      pair: resp.data.pair,
      chart: resp.data.chart,
      chart_timestamp: resp.data.chart_timestamp,
      start_date: resp.data.start_date,
      end_date: resp.data.end_date
    }
  }
  
  async updateSession(session: sessionModifyType): Promise<sessionType | null> {
    const response = await this.makeFetchWithAuthAndBody('PUT', `${this.apiurl}/test-sessions/${session.id}`, session)
    const data = await response?.json()
    return {
      id: data.id,
      starting_bal: data.starting_bal,
      current_bal: data.current_bal,
      equity: data.equity,
      strategy_id: data.strategy_id,
      user_id: data.user_id,
      pair: data.pair,
      chart: data.chart,
      chart_timestamp: data.chart_timestamp,
      start_date: data.start_date,
      end_date: data.end_date
    }
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