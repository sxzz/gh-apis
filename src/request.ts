import ky, { type KyInstance } from 'ky'

let session = ''

export function setSession(newSession: string): void {
  session = newSession
}

export const request: KyInstance = ky.create({
  prefixUrl: 'https://github.com',
  hooks: {
    beforeRequest: [
      (request) => {
        request.headers.set(
          'Cookie',
          `user_session=${session}; __Host-user_session_same_site=${session}`,
        )
      },
    ],
  },
})
