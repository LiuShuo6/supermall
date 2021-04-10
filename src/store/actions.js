export default {
  addCart (context, payload) {
    //payload 新添加的商品{
    let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)


    //2.判断 oldProduct
    if (oldProduct) {
      // oldProduct.count += 1
      context.commit('AddCounter', oldProduct)
    } else {
      payload.count = 1
      context.commit('addToCart', payload)

    }



  }
}
