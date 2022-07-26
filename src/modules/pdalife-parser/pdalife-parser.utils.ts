export const getAndroidVersion = (string: string) => {
  const result = string.match(/([0-9.]{3,})[+]$/)
  return result[1]
}

export const getRequirementValue = (requirement: string) => {
  const parts = requirement.split(':')
  return parts.length === 2 ? parts[1].trim() : ''
}
