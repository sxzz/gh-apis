import Debug from 'debug'
import type { CheerioAPI } from 'cheerio'

export const debug: Debug.Debugger = Debug('gh-apis')

export function checkLogin($: CheerioAPI): void {
  if ($('input[name="login"]').length) {
    throw new Error('Not logged in')
  }
}
