<template>
  <div class="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartLength }})</div>
    </nav-bar>
    <scroll class="content ">
      <cart-list></cart-list>
    </scroll>
  </div>
</template>
<script>
import NavBar from 'components/common/navbar/NavBar'
import CartList from './childComps/CartList'
import { mapGetters } from 'vuex'
import Scroll from 'components/common/scroll/Scroll'
export default {
  components: {
    NavBar,
    CartList,
    Scroll
  },
  computed: {
    ...mapGetters(['cartLength']


    )

  }
}
</script>
<style scoped>
.nav-bar {
  background-color: var(--color-tint);
  color: #ffff;
  font-weight: 700;
}
.cart {
  height: 100vh;
}
.content {
  height: 100%;
  overflow: hidden;
}
</style>