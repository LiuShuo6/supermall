export default {
  //mutations唯一的目的就是修改state中状态
  //mutations中的每个方法尽可能完成的事情比较单一一点
  AddCounter (state, payload) {
    payload.count++
  },
  addToCart (state, payload) {
    state.cartList.push(payload)
  }
}