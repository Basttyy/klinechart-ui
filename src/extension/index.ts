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
import buyLine from './position/buyLine'
import buyLossLine from './position/buyLossLine'
import buyProfitLine from './position/buyProfitLine'
import buyProfitLossLine from './position/buyProfitLossLine'
import sellLine from './position/sellLine'
import sellLossLine from './position/sellLossLine'
import sellProfitLine from './position/sellProfitLine'
import sellProfitLossLine from './position/sellProfitLossLine'
import buystopLine from './position/buystopLine'
import buystopProfitLine from './position/buystopProfitLine'
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
  sellLine, sellLossLine, sellProfitLine, sellProfitLossLine,
  buyLimitLine, buyLimitLossLine, buyLimitProfitLine, buyLimitProfitLossLine
]

export default overlays
