import type { CheerioAPI } from 'cheerio'
import type { Element } from 'domhandler'

export interface Paginate {
  prev: string | undefined
  next: string | undefined
}

export function getPaginate($: CheerioAPI): Paginate {
  const paginate: Paginate = { prev: undefined, next: undefined }
  const paginator = $('.js-notifications-list-paginator-buttons')
  if (paginator) {
    const [prev, next] = paginator.children()
    paginate.prev = getButtonLink(prev, 'before')
    paginate.next = getButtonLink(next, 'after')
  }

  return paginate

  function getButtonLink(btn: Element, query: string): string | undefined {
    const href = $(btn).attr('href')
    if (href) {
      return (new URL(`https://github.com${href}`).searchParams.get(query) ||
        undefined) as string | undefined
    }
    return
  }
}
