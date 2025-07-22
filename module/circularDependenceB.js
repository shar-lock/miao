import a from './circularDependeceA.js'

export default 'bbbbb'

export function foo(){
  console.log(a)
}