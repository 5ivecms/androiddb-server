export const PDALIFE_BASE_URL = 'https://pdalife.to'

export const getGameCatalogUrl = (page: number = 1) => `${PDALIFE_BASE_URL}/android/igry/sort-by/new/page-${page}`

export const getGameCategoryUrl = () => `${PDALIFE_BASE_URL}/android/igry/`

export const getSoftCategoryUrl = () => `${PDALIFE_BASE_URL}/android/programmy/`
