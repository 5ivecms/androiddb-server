export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const isNumeric = (num: any) => !isNaN(num)
