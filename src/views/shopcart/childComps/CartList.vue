<template>

  <div class="cart-list">

    <cart-list-item v-for="(item , index ) in cartList" :item-info='item' :key="index"></cart-list-item>

  </div>

</template>
<script>
import { mapGetters } from 'vuex'
import CartListItem from './CartListItem'



export default {
  name: 'CartList',
  components: {

    CartListItem

  },
  computed: {
    ...mapGetters(['cartList'])
  }
}
</script>
<style scoped>
.cart-list {
  height: calc(100% - 44px - 49px);
}
</style>