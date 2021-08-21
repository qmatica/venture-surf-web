export const pipe = (...fns: ((value: any) => any)[]) =>
  (input: any) =>
    fns.reduce((chain, func) => chain.then(func), Promise.resolve(input))
