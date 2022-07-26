export enum ParsingStatus {
  UNCOMPLETED = 1,
  PROCESS = 2,
  COMPLETED = 3,
}

export interface PDALifeApp {
  poster?: string
  title?: string
  shortDescription?: string
  category?: string
  description?: string
  url: string
  screenshots?: string[]
}

export interface PDALifeFile {
  label: string
  size: string
  mod?: string
  path?: string
}

export interface PDALifeAppVersion {
  description: string
  changes: string
  version: string
  androidVersion?: string
  internet?: string
  multiplayer?: string
  diskSpace?: string
  files: PDALifeFile[]
}

export interface PDALifeCategories {
  parent: string
  children: string
}
