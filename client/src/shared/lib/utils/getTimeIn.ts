import { baseTimeInMs } from 'shared/const/numbers'
import { type TimeUnits } from 'shared/types'

export const getTimeIn = (
  value: number,
  goalTime: TimeUnits,
  expressIn: TimeUnits
): number => {
  const valueInMs = value * baseTimeInMs[goalTime]
  return valueInMs / baseTimeInMs[expressIn]
}
