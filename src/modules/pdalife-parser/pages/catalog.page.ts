import { BasePage } from './base.page'

export class CatalogPage extends BasePage {
  async openPage(page: number = 1): Promise<void> {
    await super.open(`https://pdalife.to/android/igry/sort-by/new/page-${page}/`)
  }
}
