import Container, { saveDataFunc } from './Container';

class CacheContainer extends Container {
  ttl: number;
  constructor(
    name: string,
    saveData: saveDataFunc,
    data: any,
    autocommit: boolean,
    ttl: number
  ) {
    super(name, saveData, data, autocommit);
    this.ttl = ttl;
  }

  /**
   *
   * @param key key name
   * @param value can be a string or object (will be stringified)
   */
  set(key: string, value: any) {
    value = {
      value: value,
      exp: Math.round(Date.now() / 1000 + this.ttl),
    };
    this.data[key] = value;
    if (this.autocommit) this.commit();
  }
  get(key: string) {
    if (this.data[key].exp >= Date.now() / 1000) return this.data[key].value;
    else this.remove(key);
  }
  list() {
    for (const item of Object.keys(this.data)) this.get(item);
    return Object.keys(this.data);
  }
}
