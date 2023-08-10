import arrow from './arrow'

import circle from './circle'
import rect from './rect'
import parallelogram from './parallelogram'
import triangle from './triangle'
import fibonacciCircle from './fibonacciCircle'
import fibonacciSegment from './fibonacciSegment'
import fibonacciSpiral from './fibonacciSpiral'
import fibonacciSpeedResistanceFan from './fibonacciSpeedResistanceFan'
import fibonacciExtension from './fibonacciExtension'
import gannBox from './gannBox'
import threeWaves from './threeWaves'
import fiveWaves from './fiveWaves'
import eightWaves from './eightWaves'
import anyWaves from './anyWaves'
import abcd from './abcd'
import xabcd from './xabcd'

//Added by TradingIo Team
import positionLine from './custom/positionLine'
import fibonaccDiagonal from './custom/fibonacciDiagonal'
import positionBox from './custom/positionBox'
import buyLine from './position/buy/buyLine'
import buyLossLine from './position/buy/buyLossLine'
import buyProfitLine from './position/buy/buyProfitLine'
import buyProfitLossLine from './position/buy/buyProfitLossLine'
import sellLine from './position/sell/sellLine'
import sellLossLine from './position/sell/sellLossLine'
import sellProfitLine from './position/sell/sellProfitLine'
import sellProfitLossLine from './position/sell/sellProfitLossLine'
import buystopLine from './position/buyStop/buystopLine'
import buystopProfitLine from './position/buyStop/buystopProfitLine'
import buyLimitLine from './position/buyLimit/buyLimitLine'
import buyLimitLossLine from './position/buyLimit/buyLimitLossLine'
import buyLimitProfitLine from './position/buyLimit/buyLimitProfitLine'
import buyLimitProfitLossLine from './position/buyLimit/buyLimitProfitLossLine'

const overlays = [
  arrow, circle, rect, triangle, parallelogram, fibonaccDiagonal, fibonacciCircle,
  fibonacciSegment, fibonacciSpiral, fibonacciSpeedResistanceFan, fibonacciExtension,
  gannBox, threeWaves, fiveWaves, eightWaves, anyWaves, abcd, xabcd, positionBox,
  positionLine, buyLine, buyLossLine, buyProfitLine, buyProfitLossLine, buystopLine,
  buystopProfitLine,
  buyLimitLine, buyLimitLossLine, buyLimitProfitLine, buyLimitProfitLossLine,
  sellLine, sellLossLine, sellProfitLine, sellProfitLossLine
]

export default overlays
