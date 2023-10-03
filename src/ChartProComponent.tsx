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

import { createSignal, createEffect, onMount, Show, onCleanup, startTransition, Component } from 'solid-js'

import {
  init, dispose, utils, Nullable, Chart, OverlayMode, Styles,
  TooltipIconPosition, ActionType, Indicator, DomPosition, FormatDateType
} from 'klinecharts'

import lodashSet from 'lodash/set'
import lodashClone from 'lodash/cloneDeep'

import { SelectDataSourceItem, Loading, Popup } from './component'
import { showPopup, showBuySetting } from './store/overlaySettingStore'

import {
  PeriodBar, DrawingBar, IndicatorModal, TimezoneModal, SettingModal,
  ScreenshotModal, IndicatorSettingModal, SymbolSearchModal, OrdersPanel, BuySettingModal
} from './widget'

import { translateTimezone } from './widget/timezone-modal/data'

import { SymbolInfo, Period, ChartProOptions, ChartPro, sessionType, OrderInfo, OrderResource, ChartSessionResource } from './types'
import { currenttick, setCurrentTick, setTickTimestamp, tickTimestamp } from './store/tickStore'
import { drawOrder, orderList, ordercontr, setOrderContr, setCurrentequity } from './store/positionStore'
import { useChartState, mainIndicators, setMainIndicators, subIndicators, setSubIndicators, chartModified, setChartModified } from './store/chartStateStore'
import { useKeyEvents } from './store/keyEventStore'

const { createIndicator, modifyIndicator, popIndicator, pushOverlay, pushMainIndicator, pushSubIndicator, redrawOrders, redraOverlaysIndiAndFigs } = useChartState()

export interface ChartProComponentProps extends Required<Omit<ChartProOptions, 'container'>> {
  ref: (chart: ChartPro) => void
}

interface PrevSymbolPeriod {
  symbol: SymbolInfo
  period: Period
}

// function createIndicator (widget: Nullable<Chart>, indicatorName: string, isStack?: boolean, paneOptions?: PaneOptions): Nullable<string> {
//   if (indicatorName === 'VOL') {
//     paneOptions = { gap: { bottom: 2 }, ...paneOptions }
//   }
//   return widget?.createIndicator({
//     name: indicatorName,
//     // @ts-expect-error
//     createTooltipDataSource: ({ indicator, defaultStyles }) => {
//       const icons = []
//       if (indicator.visible) {
//         icons.push(defaultStyles.tooltip.icons[1])
//         icons.push(defaultStyles.tooltip.icons[2])
//         icons.push(defaultStyles.tooltip.icons[3])
//       } else {
//         icons.push(defaultStyles.tooltip.icons[0])
//         icons.push(defaultStyles.tooltip.icons[2])
//         icons.push(defaultStyles.tooltip.icons[3])
//       }
//       return { icons }
//     }
//   }, isStack, paneOptions) ?? null
// }

export const [instanceapi, setInstanceapi] = createSignal<Nullable<Chart>>(null)
export const [symbol, setSymbol] = createSignal<SymbolInfo>()
export const [chartsession, setChartsession] = createSignal<sessionType|null>(null)
export const [chartsessionCtr, setChartsessionCtr] = createSignal<ChartSessionResource|null>(null)
export const [pausedStatus, setPausedStatus] = createSignal(false)
export const [screenshotUrl, setScreenshotUrl] = createSignal('')
export const [rootlelID, setRooltelId] = createSignal('')

const ChartProComponent: Component<ChartProComponentProps> = props => {
  let widgetRef: HTMLDivElement | undefined = undefined
  let widget: Nullable<Chart> = null

  let priceUnitDom: HTMLElement

  let loading = false
  let timerId: NodeJS.Timeout

  const [theme, setTheme] = createSignal(props.theme)
  const [styles, setStyles] = createSignal(props.styles)
  const [locale, setLocale] = createSignal(props.locale)

  const [period, setPeriod] = createSignal(props.period)
  const [indicatorModalVisible, setIndicatorModalVisible] = createSignal(false)

  const [timezoneModalVisible, setTimezoneModalVisible] = createSignal(false)
  const [timezone, setTimezone] = createSignal<SelectDataSourceItem>({ key: props.timezone, text: translateTimezone(props.timezone, props.locale) })

  const [settingModalVisible, setSettingModalVisible] = createSignal(false)
  const [widgetDefaultStyles, setWidgetDefaultStyles] = createSignal<Styles>()

  const [drawingBarVisible, setDrawingBarVisible] = createSignal(props.drawingBarVisible)
  
  const [orderPanelVisible, setOrderPanelVisible] = createSignal(props.orderPanelVisible)

  const [symbolSearchModalVisible, setSymbolSearchModalVisible] = createSignal(false)

  const [loadingVisible, setLoadingVisible] = createSignal(false)

  const [indicatorSettingModalParams, setIndicatorSettingModalParams] = createSignal({
    visible: false, indicatorName: '', paneId: '', calcParams: [] as Array<any>
  })
  setSymbol(props.symbol)
  setChartsession(props.chartSession)
  setChartsessionCtr(props.chartSessionController)
  setMainIndicators([...(props.mainIndicators!)])
  setRooltelId(props.rootElementId)

  props.ref({
    setTheme,
    getTheme: () => theme(),
    setStyles,
    getStyles: () => widget!.getStyles(),
    setLocale,
    getLocale: () => locale(),
    setTimezone: (timezone: string) => { setTimezone({ key: timezone, text: translateTimezone(props.timezone, locale()) }) },
    getTimezone: () => timezone().key,
    setSymbol,
    getSymbol: () => symbol()!,
    setPeriod,
    getPeriod: () => period()
  })

  const documentResize = () => {
    widget?.resize()
  }

  const adjustFromTo = (period: Period, toTimestamp: number, count: number) => {
    let to = toTimestamp
    let from = to
    switch (period.timespan) {
      case 'minute': {
        to = to - (to % (60 * 1000))
        from = to - count * period.multiplier * 60 * 1000
        break
      }
      case 'hour': {
        to = to - (to % (60 * 60 * 1000))
        from = to - count * period.multiplier * 60 * 60 * 1000
        break
      }
      case 'day': {
        to = to - (to % (60 * 60 * 1000))
        from = to - count * period.multiplier * 24 * 60 * 60 * 1000
        break
      }
      case 'week': {
        const date = new Date(to)
        const week = date.getDay()
        const dif = week === 0 ? 6 : week - 1
        to = to - dif * 60 * 60 * 24
        const newDate = new Date(to)
        to = new Date(`${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`).getTime()
        from = count * period.multiplier * 7 * 24 * 60 * 60 * 1000
        break
      }
      case 'month': {
        const date = new Date(to)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        to = new Date(`${year}-${month}-01`).getTime()
        from = count * period.multiplier * 30 * 24 * 60 * 60 * 1000
        const fromDate = new Date(from)
        from = new Date(`${fromDate.getFullYear()}-${fromDate.getMonth() + 1}-01`).getTime()
        break
      }
      case 'year': {
        const date = new Date(to)
        const year = date.getFullYear()
        to = new Date(`${year}-01-01`).getTime()
        from = count * period.multiplier * 365 * 24 * 60 * 60 * 1000
        const fromDate = new Date(from)
        from = new Date(`${fromDate.getFullYear()}-01-01`).getTime()
        break
      }
    }
    return [from, to]
  }

  const cleanup = () => {   //Cleanup objects when leaving chart page
    const doJob = async () => {
      clearInterval(timerId)
      props.datafeed.unsubscribe()
  
      const updateRunningOrders = async (orders: OrderInfo[], symbol: SymbolInfo, orderctr: OrderResource) => {
        let i = 0, pL = 0
        if (orders && symbol !== undefined) {
          while(i < orders.length) {
            if (orders[i].pl !== null && orders[i].pips !== null) {
              pL = +pL + +orders[i].pl!
              await orderctr.modifyOrder({
                id: orders[i].orderId, //in a real application this should be calculated on backend
                pips: orders[i].pips, //in a real application this should be calculated on backend
                pl: orders[i].pips! * orders[i].lotSize * symbol!.dollarPerPip!
              })
              await new Promise(resolve => setTimeout(resolve, 500));
            }
            i++
          }
        }
        return pL
      }
      const updateChartSession = async (_session: sessionType, _pl: number, _sessionctr: ChartSessionResource) => {
        const pl = +_session.current_bal + +_pl
        if (_session) {
          await _sessionctr?.updateSession({
            id: _session.id,
            current_bal: _session.current_bal,
            equity: pl,
            chart_timestamp: tickTimestamp(),
            chart: localStorage.getItem(`chartstatedata_${chartsession()?.id}`) != null && chartModified() ? btoa(localStorage.getItem(`chartstatedata_${chartsession()?.id}`)!) : undefined
          })
        }
      }
      const orders = orderList().filter(order => (order.action == 'buy' || order.action == 'sell') && !order.exitType && !order.exitPoint)
  
      let pl = await updateRunningOrders (orders, symbol()!, ordercontr()!)
      await updateChartSession (chartsession()!, pl, chartsessionCtr()!)
      setInstanceapi(null)
      dispose(widgetRef!)
      await new Promise(resolve => setTimeout(resolve, 500));
      window.location.href = '/dashboard'
    }
    doJob()
  }

  onMount(() => {
    document.addEventListener('contextmenu', function(event) {
      event.preventDefault()
    })
    document.addEventListener("keydown", useKeyEvents().handleKeyDown)
    document.addEventListener("keyup", useKeyEvents().handleKeyUp)
    document.addEventListener('keypress', useKeyEvents().handleKeyPress)
    setOrderContr(props.orderController)
    window.addEventListener('resize', documentResize)
    widget = init(widgetRef!, {
      customApi: {
        formatDate: (dateTimeFormat: Intl.DateTimeFormat, timestamp, format: string, type: FormatDateType) => {
          const p = period()
          switch (p.timespan) {
            case 'minute': {
              if (type === FormatDateType.XAxis) {
                return utils.formatDate(dateTimeFormat, timestamp, 'HH:mm')
              }
              return utils.formatDate(dateTimeFormat, timestamp, 'YYYY-MM-DD HH:mm')
            }
            case 'hour': {
              if (type === FormatDateType.XAxis) {
                return utils.formatDate(dateTimeFormat, timestamp, 'MM-DD HH:mm')
              }
              return utils.formatDate(dateTimeFormat, timestamp, 'YYYY-MM-DD HH:mm')
            }
            case 'day':
            case 'week': return utils.formatDate(dateTimeFormat, timestamp, 'YYYY-MM-DD')
            case 'month': {
              if (type === FormatDateType.XAxis) {
                return utils.formatDate(dateTimeFormat, timestamp, 'YYYY-MM')
              }
              return utils.formatDate(dateTimeFormat, timestamp, 'YYYY-MM-DD')
            }
            case 'year': {
              if (type === FormatDateType.XAxis) {
                return utils.formatDate(dateTimeFormat, timestamp, 'YYYY')
              }
              return utils.formatDate(dateTimeFormat, timestamp, 'YYYY-MM-DD')
            }
          }
          return utils.formatDate(dateTimeFormat, timestamp, 'YYYY-MM-DD HH:mm')
        }
      }
    })

    if (widget) {
      setInstanceapi(widget)
      setTheme(props.theme)
      const watermarkContainer = widget.getDom('candle_pane', DomPosition.Main)
      if (watermarkContainer) {
        let watermark = document.createElement('div')
        watermark.className = 'klinecharts-pro-watermark'
        if (utils.isString(props.watermark)) {
          const str = (props.watermark as string).replace(/(^\s*)|(\s*$)/g, '')
          watermark.innerHTML = str
        } else {
          watermark.appendChild(props.watermark as Node)
        }
        watermarkContainer.appendChild(watermark)
      }

      const priceUnitContainer = widget.getDom('candle_pane', DomPosition.YAxis)
      priceUnitDom = document.createElement('span')
      priceUnitDom.className = 'klinecharts-pro-price-unit'
      priceUnitContainer?.appendChild(priceUnitDom)
    }

    mainIndicators().forEach(indicator => {
      createIndicator(widget, indicator, true, { id: 'candle_pane' })
    })
    const subIndicatorMap = {}
    props.subIndicators!.forEach(indicator => {
      const paneId = createIndicator(widget, indicator, true)
      if (paneId) {
        // @ts-expect-error
        subIndicatorMap[indicator] = paneId
      }
    })
    setSubIndicators(subIndicatorMap)
    widget?.loadMore(timestamp => {
      loading = true
      const get = async () => {
        const p = period()
        const [to] = adjustFromTo(p, timestamp!, 1)
        const [from] = adjustFromTo(p, to, 500)
        const kLineDataList = await props.datafeed.getHistoryKLineData(symbol()!, p, from, to)
        widget?.applyMoreData(kLineDataList, kLineDataList.length > 0)
        loading = false
      }
      get()
    })
    widget?.subscribeAction(ActionType.OnTooltipIconClick, (data) => {
      if (data.indicatorName) {
        switch (data.iconId) {
          case 'visible': {
            widget?.overrideIndicator({ name: data.indicatorName, visible: true }, data.paneId)
            break
          }
          case 'invisible': {
            widget?.overrideIndicator({ name: data.indicatorName, visible: false }, data.paneId)
            break
          }
          case 'setting': {
            const indicator = widget?.getIndicatorByPaneId(data.paneId, data.indicatorName) as Indicator
            setIndicatorSettingModalParams({
              visible: true, indicatorName: data.indicatorName, paneId: data.paneId, calcParams: indicator.calcParams
            })
            break
          }
          case 'close': {
            if (data.paneId === 'candle_pane') {
              const newMainIndicators = [...mainIndicators()]
              widget?.removeIndicator('candle_pane', data.indicatorName)
              newMainIndicators.splice(newMainIndicators.indexOf(data.indicatorName), 1)
              setMainIndicators(newMainIndicators)
            } else {
              const newIndicators = { ...subIndicators() }
              widget?.removeIndicator(data.paneId, data.indicatorName)
              // @ts-expect-error
              delete newIndicators[data.indicatorName]
              setSubIndicators(newIndicators)
            }
            popIndicator(data.indicatorName, data.paneId)
          }
        }
      }
    })
  })

  onCleanup(() => {
    document.removeEventListener('contextmenu', function(event) {
      event.preventDefault();
    });
    document.removeEventListener("keydown", useKeyEvents().handleKeyDown)
    document.removeEventListener("keyup", useKeyEvents().handleKeyUp)
    document.removeEventListener('keypress', useKeyEvents().handleKeyPress)
    window.removeEventListener('resize', documentResize)
    clearInterval(timerId)
    dispose(widgetRef!)
  })

  createEffect(() => {
    const s = symbol()
    if (s?.priceCurrency) {
      priceUnitDom.innerHTML = s?.priceCurrency.toLocaleUpperCase()
      priceUnitDom.style.display = 'flex'
    } else {
      priceUnitDom.style.display = 'none'
    }
    widget?.setPriceVolumePrecision(s?.pricePrecision ?? 2, s?.volumePrecision ?? 0)
  })

  createEffect((prev?: PrevSymbolPeriod) => {
    if (!loading) {
      if (prev) {
        props.datafeed.unsubscribe(prev.symbol, prev.period)
      }
      const s = symbol()!
      const p = period()
      loading = true
      setLoadingVisible(true)
      const get = async () => {
        const timestamp = props.dataTimestamp ?? new Date().getTime()
        const [from, to] = adjustFromTo(p, timestamp, 500)
        const kLineDataList = await props.datafeed.getHistoryKLineData(s, p, from, to)
        widget?.applyNewData(kLineDataList, kLineDataList.length > 0)
        setCurrentTick(kLineDataList[kLineDataList.length -1])

        props.datafeed.subscribe(s, p, (data, timestamp) => {
          setCurrentTick(data)
          if (timestamp)
            setTickTimestamp(timestamp)
          widget?.updateData(data)

          const orders = orderList().filter(order => (order.action == 'buy' || order.action == 'sell') && !order.exitType && !order.exitPoint)
          if (orders && symbol() !== undefined) {
            let pl = 0, i = 0
            while(i < orders.length) {
              if (orders[i].pl !== null && orders[i].pips !== null) {
                pl += orders[i].pl!
              }
              i++
            }
            setCurrentequity(pl)
          }
        })
        loading = false
        setLoadingVisible(false)
      }
      get()
      return { symbol: s, period: p }
    }
    return prev
  })

  createEffect(() => {
    const t = theme()
    widget?.setStyles(t)
    const color = t === 'dark' ? '#929AA5' : '#76808F'
    widget?.setStyles({
      indicator: {
        tooltip: {
          icons: [
            {
              id: 'visible',
              position: TooltipIconPosition.Middle,
              marginLeft: 8,
              marginTop: 7,
              marginRight: 0,
              marginBottom: 0,
              paddingLeft: 0,
              paddingTop: 0,
              paddingRight: 0,
              paddingBottom: 0,
              icon: '\ue903',
              fontFamily: 'icomoon',
              size: 14,
              color: color,
              activeColor: color,
              backgroundColor: 'transparent',
              activeBackgroundColor: 'rgba(22, 119, 255, 0.15)'
            },
            {
              id: 'invisible',
              position: TooltipIconPosition.Middle,
              marginLeft: 8,
              marginTop: 7,
              marginRight: 0,
              marginBottom: 0,
              paddingLeft: 0,
              paddingTop: 0,
              paddingRight: 0,
              paddingBottom: 0,
              icon: '\ue901',
              fontFamily: 'icomoon',
              size: 14,
              color: color,
              activeColor: color,
              backgroundColor: 'transparent',
              activeBackgroundColor: 'rgba(22, 119, 255, 0.15)'
            },
            {
              id: 'setting',
              position: TooltipIconPosition.Middle,
              marginLeft: 6,
              marginTop: 7,
              marginBottom: 0,
              marginRight: 0,
              paddingLeft: 0,
              paddingTop: 0,
              paddingRight: 0,
              paddingBottom: 0,
              icon: '\ue902',
              fontFamily: 'icomoon',
              size: 14,
              color: color,
              activeColor: color,
              backgroundColor: 'transparent',
              activeBackgroundColor: 'rgba(22, 119, 255, 0.15)'
            },
            {
              id: 'close',
              position: TooltipIconPosition.Middle,
              marginLeft: 6,
              marginTop: 7,
              marginRight: 0,
              marginBottom: 0,
              paddingLeft: 0,
              paddingTop: 0,
              paddingRight: 0,
              paddingBottom: 0,
              icon: '\ue900',
              fontFamily: 'icomoon',
              size: 14,
              color: color,
              activeColor: color,
              backgroundColor: 'transparent',
              activeBackgroundColor: 'rgba(22, 119, 255, 0.15)'
            }
          ]
        }
      }
    })
  })

  createEffect(() => {
    widget?.setLocale(locale())
  })

  createEffect(() => {
    widget?.setTimezone(timezone().key)
  })

  createEffect(() => {
    if (styles()) {
      widget?.setStyles(styles())
      setWidgetDefaultStyles(lodashClone(widget!.getStyles()))
    }
    redraOverlaysIndiAndFigs()
    redrawOrders()
  })

  createEffect( () => {
    timerId = setInterval(() => {
      const closeRunningOrders = async () => {
        const orders = orderList().filter(order => (order.action == 'buy' || order.action == 'sell') && !order.exitType && !order.exitPoint)
        let i = 0
        if (orders && symbol() !== undefined) {
          while(i < orders.length) {
            await ordercontr()?.modifyOrder({
              id: orders[i].orderId, //in a real application this should be calculated on backend
              exitpoint: currenttick()?.close,
              exittype: 'cancel',
            })
            await new Promise(resolve => setTimeout(resolve, 400));
            i++
          }
        }
      }
      const updateRunningOrders = async () => {
        const orders = orderList().filter(order => (order.action == 'buy' || order.action == 'sell') && !order.exitType && !order.exitPoint)
        let i = 0, pl = 0
        if (orders && symbol() !== undefined) {
          while(i < orders.length) {
            if (orders[i].pl !== null && orders[i].pips !== null) {
              await ordercontr()?.modifyOrder({
                id: orders[i].orderId, //in a real application this should be calculated on backend
                pips: orders[i].pips, //in a real application this should be calculated on backend
                pl: orders[i].pips! * symbol()!.dollarPerPip!
              })
              await new Promise(resolve => setTimeout(resolve, 400));
            }
            pl += +(orders[i].pips! * symbol()!.dollarPerPip!)
            i++
          }
        }
        return pl
      }
      const updateChartSession = async () => {
        let pl = await updateRunningOrders ()
        
        let session = chartsession()
        const chart = localStorage.getItem(`chartstatedata_${chartsession()?.id}`)
        if (session) {
          pl += + +session.current_bal
          if (pl <= 0) {
            pl = 0
            await closeRunningOrders()
          }
          if (session.chart_timestamp !== tickTimestamp() || chart != null)
            if (await chartsessionCtr()?.updateSession({
              id: session.id,
              current_bal: session.current_bal,
              equity: pl,
              chart_timestamp: tickTimestamp(),
              chart: chart != null && chartModified() ? btoa(chart) : undefined
            })) {
              session.equity = pl
              session.chart_timestamp = tickTimestamp()!

              setChartModified(false)
            }
        }
      }
      updateChartSession ()
    }, 2 * 60 * 1000)     // Run this job every 2min
  })

  return (
    <>
      <i class="icon-close klinecharts-pro-load-icon"/>
      <Show when={showPopup()}>
        <Popup/>
      </Show>
      <Show when={showBuySetting()}>
        <BuySettingModal
          locale={props.locale}
        />
      </Show>
      <Show when={symbolSearchModalVisible()}>
        <SymbolSearchModal
          locale={props.locale}
          datafeed={props.datafeed}
          onSymbolSelected={symbol => { setSymbol(symbol) }}
          onClose={() => { setSymbolSearchModalVisible(false) }}/>
      </Show>
      <Show when={indicatorModalVisible()}>
        <IndicatorModal
          locale={props.locale}
          mainIndicators={mainIndicators()}
          subIndicators={subIndicators()}
          onClose={() => { setIndicatorModalVisible(false) }}
          onMainIndicatorChange={data => { pushMainIndicator(data)}}
          onSubIndicatorChange={data => { pushSubIndicator(data) }}/>
      </Show>
      <Show when={timezoneModalVisible()}>
        <TimezoneModal
          locale={props.locale}
          timezone={timezone()}
          onClose={() => { setTimezoneModalVisible(false) }}
          onConfirm={setTimezone}
        />
      </Show>
      <Show when={settingModalVisible()}>
        <SettingModal
          locale={props.locale}
          currentStyles={utils.clone(widget!.getStyles())}
          onClose={() => { setSettingModalVisible(false) }}
          onChange={style => {
            widget?.setStyles(style)
          }}
          onRestoreDefault={(options: SelectDataSourceItem[]) => {
            const style = {}
            options.forEach(option => {
              const key = option.key
              lodashSet(style, key, utils.formatValue(widgetDefaultStyles(), key))
            })
            widget?.setStyles(style)
          }}
        />
      </Show>
      <Show when={screenshotUrl().length > 0}>
        <ScreenshotModal
          locale={props.locale}
          url={screenshotUrl()}
          onClose={() => { setScreenshotUrl('') }}
        />
      </Show>
      <Show when={indicatorSettingModalParams().visible}>
        <IndicatorSettingModal
          locale={props.locale}
          params={indicatorSettingModalParams()}
          onClose={() => { setIndicatorSettingModalParams({ visible: false, indicatorName: '', paneId: '', calcParams: [] }) }}
          onConfirm={(params)=> {
            const modalParams = indicatorSettingModalParams()
            modifyIndicator(modalParams, params)
          }}
        />
      </Show>
      <PeriodBar
        locale={props.locale}
        symbol={symbol()!}
        spread={drawingBarVisible()}
        order_spread={orderPanelVisible()}
        period={period()}
        periods={props.periods}
        onMenuClick={async () => {
          try {
            await startTransition(() => setDrawingBarVisible(!drawingBarVisible()))
            documentResize()
          } catch (e) {}    
        }}
        onOrderMenuClick={async () => {
          try {
            await startTransition(() => setOrderPanelVisible(!orderPanelVisible()))
            documentResize()
          } catch (e) {}
        }}
        onSymbolClick={() => { setSymbolSearchModalVisible(!symbolSearchModalVisible()) }}
        onPeriodChange={setPeriod}
        onIndicatorClick={() => { setIndicatorModalVisible((visible => !visible)) }}
        onTimezoneClick={() => { setTimezoneModalVisible((visible => !visible)) }}
        onSettingClick={() => { setSettingModalVisible((visible => !visible)) }}
        onScreenshotClick={() => {
          if (widget) {
            const url = widget.getConvertPictureUrl(true, 'jpeg', props.theme === 'dark' ? '#151517' : '#ffffff')
            setScreenshotUrl(url)
          }
        }}
        freeResources={cleanup}
        orderController={props.orderController}
        datafeed={props.datafeed}
        rootEl={props.rootElementId}
      />
      <div
        class="klinecharts-pro-content"
        data-orders-pane-visible={orderPanelVisible()}>  
        <Show when={loadingVisible()}>
          <Loading/>
        </Show>
        <Show when={drawingBarVisible()}>
          <DrawingBar
            locale={props.locale}
            onDrawingItemClick={overlay => { pushOverlay(overlay)}}
            onModeChange={mode => { widget?.overrideOverlay({ mode: mode as OverlayMode }) }}
            onLockChange={lock => { widget?.overrideOverlay({ lock }) }}
            onVisibleChange={visible => { widget?.overrideOverlay({ visible }) }}
            onRemoveClick={(groupId) => { widget?.removeOverlay({ groupId }) }}/>
        </Show>
        <div
          ref={widgetRef}
          class='klinecharts-pro-widget'
          data-drawing-bar-visible={drawingBarVisible()}/>
      </div>
      <Show when={orderPanelVisible()}>
        <OrdersPanel
          context='this is the order panel context'
          orderController={props.orderController}
        />
      </Show>
    </>
  )
}

export default ChartProComponent