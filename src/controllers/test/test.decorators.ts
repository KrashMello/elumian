export function log() {
  return function (targer: any, keyPropiety: string) {
    console.log(targer, keyPropiety);
  };
}

export function test() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log(target, propertyKey, descriptor);
  };
}
