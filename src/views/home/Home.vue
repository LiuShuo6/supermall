<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control class="tab-control" @tabClick='tabClick' :titles='["流行","新款","精选"]' ref='tabControl1' v-show="isTabFixed"></tab-control>
    <scroll class="content" ref="scroll" :probe-type='3' @scroll="contentScroll" :pull-up-load='true' @pullingUp='loadMore'>
      <home-swiper :banners="banners" @swiperImageLoad='swiperImageLoad'></home-swiper>
      <recommend-view :Recommends='recommends' />
      <feature-view></feature-view>
      <tab-control @tabClick='tabClick' :titles='["流行","新款","精选"]' ref='tabControl2'></tab-control>
      <goods-list :goods="this.showGoods"></goods-list>
    </scroll>
    <!-- 在外面需要监听一个组件的原生事件时，必须给对应的事件加上.native修饰符才能进行监听 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>

  </div>
</template>
<script>
import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backtop/BackTop'

import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'

import { getHomeMultidata, getHomeGoods } from 'network/home'
import { debounce } from 'common/utils'
import { backTopMixin } from 'common/mixin'


// import Swiper from 'components/common/swiper/Swiper'
// import SwiperItem from 'components/common/swiper/SwiperItem'

export default {
  components: {
    NavBar,
    TabControl,
    GoodsList,
    Scroll,
    BackTop,
    HomeSwiper,
    RecommendView,
    FeatureView,
  },
  mixins: [backTopMixin],
  data () {
    return {
      banners: [],
      recommends: [],
      goods: {
        'pop': { page: 0, list: [] },
        'new': { page: 0, list: [] },
        'sell': { page: 0, list: [] },
      },
      currentType: 'pop',

      tabOffsetTop: 0,
      isTabFixed: false,
      saveY: 0,

    }
  },
  activated () {

    this.$refs.scroll.scrollTo(0, this.saveY);
    this.$refs.scroll.refresh()

  },
  deactivated () {
    //1.保存Y值
    if (this.$refs.scroll.scroll !== null) {
      this.saveY = this.$refs.scroll.getScrollY()
      console.log(this.saveY)
    }

  },
  created () {
    //1.请求多个数据
    this.getHomeMultidata();
    //2.请求商品数据
    this.getHomeGoods('pop');
    this.getHomeGoods('new');
    this.getHomeGoods('sell');

  },
  mounted () {

    //图片加载完成事件监听
    const refresh = debounce(this.$refs.scroll.refresh, 100)


    // 3.监听item中图片加载完成
    this.$bus.$on('itemImageLoad', () => {
      refresh()
    })
    // 2.获取tabControl的offsetTop
    //所有的组件都有一个属性 $el:用于获取组件中的元素

  },
  methods: {
    /* 事件监听相关方法*/

    tabClick (index) {
      switch (index) {
        case 0:
          this.currentType = 'pop'
          break;
        case 1:
          this.currentType = 'new'
          break;
        case 2:
          this.currentType = 'sell'
          break;
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },

    backClick () {
      this.$refs.scroll.scrollTo(0, 0)

    },
    contentScroll (position) {
      // console.log(position)
      // position.y<1000
      // 1.判断BackTop是否显示
      this.listenShowBackTop(position)
      // 2.决定tabControl是否吸顶（pisition：fixed）
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    // 上拉加载更多
    loadMore () {
      this.getHomeGoods(this.currentType)
    },
    swiperImageLoad () {
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },


    /* 网络请求相关方法*/
    getHomeMultidata () {
      getHomeMultidata().then(res => {
        this.banners = res.data.data.banner.list
        this.recommends = res.data.data.recommend.list
      })
    },
    getHomeGoods (type) {
      const page = this.goods[type].page + 1
      getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.data.list)
        this.goods[type].page += 1
        //完成上拉加载更多
        this.$refs.scroll.finishPullUp()

      })
    },

  },
  computed: {
    showGoods () {
      console.log(this.goods[this.currentType].list)
      return this.goods[this.currentType].list
    }
  }
}
</script>
<style scoped>
#home {
  padding-top: 44px;
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: #ffff;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9;
}
.tab-control {
  position: relative;
  z-index: 9;
}
.content {
  /* height: 300px; */
  overflow: hidden;
  position: absolute;
  top: 44px;
  bottom: 49px;
  right: 0;
  left: 0;
}
/* .content {
  height: calc(100% - 93px);
  overflow: hidden;
  margin-top: 50px;
} */
.tab-control {
  position: relative;
}
</style>