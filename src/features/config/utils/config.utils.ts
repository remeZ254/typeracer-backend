import * as nconf from 'nconf';

const serverStore = new nconf.Provider();
const clientStore = new nconf.Provider();
const quotesStore = new nconf.Provider();

export const initConfiguration = () => {
  serverStore.file('server', 'configuration/server.config.json');
  clientStore.file('client', 'configuration/client.config.json');
  quotesStore.file('quotes', 'configuration/quotes.json');
};

export const getFromConfig = (...keys: string[]): any => {
  const path = keys.join(':');
  const value: any = path ? serverStore.get(path) : serverStore.get();
  if (value != null) {
    return value;
  } else {
    console.warn(`Could not find "${path}" in config`);
  }
};

export const getQuotesFromConfig = () => quotesStore.get();

export const getClientConfig = () => clientStore.get();

export interface ServerConfig {
  authKey: string;
  roomMaxCapacity: number;
  countdown: {
    practice: number;
    1: number;
    2: number;
    3: number;
    4: number;
  };
}
