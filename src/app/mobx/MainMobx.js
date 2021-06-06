import {action, makeObservable, observable} from 'mobx';

export default class MainMobx {
  isLoading = false;

  constructor() {
    makeObservable(this, {
      isLoading: observable,
      setLoading: action,
    });
  }

  setLoading = isLoading => (this.isLoading = isLoading);
}
