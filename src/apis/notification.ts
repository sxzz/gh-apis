import { toArray } from '@antfu/utils'
import { load } from 'cheerio'
import { getPaginate, type Paginate } from '../paginate'
import { request } from '../request'
import { checkLogin, debug } from '../utils'
import type { Element } from 'domhandler'

export interface Notification {
  id: string
  title: string
  link: string | undefined
  context: any
  authenticityToken: string
}

export async function fetchNotifications(
  query?: string,
  after?: string,
): Promise<{
  list: Notification[]
  paginate: Paginate
  viewType: 'group_by_repository' | 'sort_by_date'
}> {
  const html = await request('notifications', {
    searchParams: { query: query || '', after: after || '' },
  }).then((r) => r.text())
  const $ = load(html)
  checkLogin($)

  const container = $('.js-navigation-container')
  const hasGroups = $('.js-notifications-group').length
  const viewType = hasGroups ? 'group_by_repository' : 'sort_by_date'
  debug(`view type is ${viewType}`)

  const list: Notification[] = []
  if (hasGroups) {
    for (const group of container.children()) {
      for (const item of $(group).find('.Box-body > ul > *')) {
        processNotification(item)
      }
    }
  } else {
    for (const item of container.children()) {
      processNotification(item)
    }
  }

  const paginate = getPaginate($)

  return {
    list,
    paginate,
    viewType,
  }

  function processNotification(el: Element): void {
    const $el = $(el)
    const id = $el.data('notification-id') as string
    if (!id) return
    debug('Got notification', id)

    const $link = $el.find('.notification-list-item-link')
    const link = $link.attr('href')
    const context: any = $link.data('hydro-click')
    const title = $link.find('.markdown-title').text().trim()
    const authenticityToken = $el
      .find('input[name="authenticity_token"]')
      .attr('value') as string

    const notification: Notification = {
      id,
      title,
      link,
      context,
      authenticityToken,
    }
    list.push(notification)
  }
}

export async function mutateNotification(
  action:
    | 'mark'
    | 'unmark'
    | 'archive'
    | 'unarchive'
    | 'subscribe'
    | 'unsubscribe'
    | 'star'
    | 'unstar',
  id: string | string[],
  authenticityToken: string,
): Promise<void> {
  const formData = new FormData()
  const ids = toArray(id)
  for (const id of ids) {
    formData.append('notification_ids[]', id)
  }
  formData.append('authenticity_token', authenticityToken)
  await request.post(`notifications/beta/${action}`, {
    body: formData,
  })
}

export function archiveNotification(
  id: string | string[],
  authenticityToken: string,
): Promise<void> {
  return mutateNotification('archive', id, authenticityToken)
}

export function unarchiveNotification(
  id: string | string[],
  authenticityToken: string,
): Promise<void> {
  return mutateNotification('unarchive', id, authenticityToken)
}

export function readNotification(
  id: string | string[],
  authenticityToken: string,
): Promise<void> {
  return mutateNotification('mark', id, authenticityToken)
}

export function unreadNotification(
  id: string | string[],
  authenticityToken: string,
): Promise<void> {
  return mutateNotification('unmark', id, authenticityToken)
}

export function subscribeNotification(
  id: string | string[],
  authenticityToken: string,
): Promise<void> {
  return mutateNotification('subscribe', id, authenticityToken)
}

export function unsubscribeNotification(
  id: string | string[],
  authenticityToken: string,
): Promise<void> {
  return mutateNotification('unsubscribe', id, authenticityToken)
}

export function starNotification(
  id: string | string[],
  authenticityToken: string,
): Promise<void> {
  return mutateNotification('star', id, authenticityToken)
}

export function unstarNotification(
  id: string | string[],
  authenticityToken: string,
): Promise<void> {
  return mutateNotification('unstar', id, authenticityToken)
}
