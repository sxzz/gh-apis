import process from 'node:process'
import { describe, expect, test } from 'vitest'
import { fetchNotifications } from '../src'
import { setSession } from '../src/request'

describe('notifications', () => {
  setSession(process.env.VITE_GITHUB_SESSION!)

  test('fetchNotifications', async () => {
    const result = await fetchNotifications('is:done')
    expect(result.list.length).greaterThan(0)
    expect(result.paginate.next).toBeDefined()
  })

  // test('archiveNotification', async () => {
  // await archiveNotification('NT_XXXXX', 'XXXX')
  // })
})
