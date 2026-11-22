import { createContext, useContext } from 'react';
import { ContentStore } from './ContentStore';

export class RootStore {
  contentStore: ContentStore;

  constructor() {
    this.contentStore = new ContentStore();
  }
}

export const rootStore = new RootStore();
const StoreContext = createContext<RootStore>(rootStore);

export const StoreProvider = StoreContext.Provider;
export const useStores = () => useContext(StoreContext);

