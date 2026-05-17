export const keepLargestArrays = <T>(arr: T[][]): T[][] => {
  const maxLength = Math.max(...arr.map(innerArray => innerArray.length))
  return arr.filter(innerArray => innerArray.length === maxLength)
}
