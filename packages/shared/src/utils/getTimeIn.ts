import { baseTimeInMs } from '../const'
import { type TimeUnits } from '../types'

export const getTimeIn = (
  value: number,
  goalTime: TimeUnits,
  expressIn: TimeUnits
): number => {
  const valueInMs = value * baseTimeInMs[goalTime]
  return valueInMs / baseTimeInMs[expressIn]
}
