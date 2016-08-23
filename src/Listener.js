// @flow

export class Listener {
  constructor(target:Function, type:string = '') {
    this.type = type;
    this.target = target;
  }

  bind(type:string) {
    this.type = type;
  }
}

export function listener(target:Function) {
  return new Listener(target);
}
