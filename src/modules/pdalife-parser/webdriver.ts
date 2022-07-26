import { remote, RemoteOptions } from 'webdriverio'

export const getRemoteOptions = (isHeadless: boolean = false): RemoteOptions => {
  const options: RemoteOptions = {
    reporters: ['dot'],
    logLevel: 'silent',
    capabilities: {
      browserName: 'chrome',
      maxInstances: 10,
      acceptInsecureCerts: true,
      'goog:chromeOptions': {
        args: [
          '--disable-application-cache',
          '--log-level=3',
          '--disable-logging',
          '--disable-blink-features=AutomationControlled',
          '--disable-popup-blocking',
          '--disable-notifications',
        ],
        extensions: [],
      },
    },
  }

  if (isHeadless) {
    options.capabilities['goog:chromeOptions'].args.push('--headless')
  }

  return options
}

export const initBrowser = async (): Promise<WebdriverIO.Browser> => {
  const options = getRemoteOptions()
  const browser: WebdriverIO.Browser = await remote(options)

  return browser
}
