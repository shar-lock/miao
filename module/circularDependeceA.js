import b from './circularDependenceB.js'

export default 'aaaaa'

export function foo(){
  console.log(b)
}