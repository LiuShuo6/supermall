<template>
  <!-- ref如果是绑定在组件中,那么通过this.$refs.refname 得到的就是组件对象
ref如果是绑定在普通 元素中,那么通过this.$refs.refname 得到的就是元素对象 -->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>

  </div>
</template>
<script>
import BScroll from 'better-scroll'
export default {
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      scroll: null,
      message: 'hahah'
    }
  },
  mounted () {
    // 1.创建BScroll对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      probeType: this.probeType,
      observeDOM: true,
      click: true,
      pullUpLoad: this.pullUpLoad
    })
    // 2.监听滚动位置
    this.scroll.on('scroll', position => {
      this.$emit('scroll', position)

    })
    // 3.监听scroll滚动到底部
    if (this.pullUpLoad) {
      this.scroll.on('pullingUp', () => {
        this.$emit('pullingUp')

      })
    }
  },
  methods: {

    scrollTo (x, y, time) {
      this.scroll.scrollTo(x, y, time)
    },
    finishPullUp () {
      this.scroll.finishPullUp()
    },
    refresh () {
      this.scroll.refresh()
    },
    getScrollY () {
      return this.scroll ? - this.scroll.y : 0

    }
  },
  components: {

  }
}
</script>
<style scoped>
.content {
  overflow: hidden;
}
</style>