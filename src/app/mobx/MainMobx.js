import { action, makeObservable, observable } from 'mobx';

export default class MainMobx {
  isLoading = false;
  cache = {}

  constructor() {
    makeObservable(this, {
      isLoading: observable,
      cache: observable,
    });
  }

  set = (key, value) => this[key] = value
}
