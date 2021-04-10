<template>
  <div id='detail'>

    <detail-nav-bar class="detail-nav" @titleClick='titleClick' ref="nav" 这里的index在子组件中传的></detail-nav-bar>

    <scroll class="content" ref='scroll' :probe-type='3' @scroll="contentScroll">
      <div>{{$store.state.cartList.length}}</div>

      <detail-swiper :topImages='topImages'></detail-swiper>
      <detail-base-info :goods='goods'></detail-base-info>
      <detail-shop-info :shop='shop'></detail-shop-info>
      <detail-goods-info :detail-info='detailInfo' @imageLoad='imageLoad'></detail-goods-info>
      <detail-param-info ref="params" :paramInfo='paramInfo'></detail-param-info>
      <detail-comment-info ref="comment" :commentInfo='commentInfo'></detail-comment-info>
      <goods-list ref="recommend" :goods='recommends'></goods-list>

    </scroll>

    <detail-bottom-bar @addCart='addToCart'></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>

  </div>
</template>


<script>
import DetailNavBar from './childComponents/DetailNavBar'
import DetailSwiper from './childComponents/DetailSwiper'
import DetailBaseInfo from './childComponents/DetailBaseInfo'
import DetailShopInfo from './childComponents/DetailShopInfo'
import DetailGoodsInfo from './childComponents/DetailGoodsInfo'
import DetailParamInfo from './childComponents/DetailParamInfo'
import DetailCommentInfo from './childComponents/DetailCommentInfo'
import DetailBottomBar from './childComponents/DetailBottomBar'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'


import { getDetail, Goods, Shop, GoodsParam, getRecommend } from '../../network/detail'
import { debounce } from 'common/utils'
import { backTopMixin } from 'common/mixin'


export default {
  name: 'Detail',
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailGoodsInfo,
    Scroll,
    DetailShopInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,

    DetailBottomBar,
  },
  mixins: [backTopMixin],
  data () {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
      saveY: 0
    }
  },

  created () {
    // console.log(this.$route.params.iid)
    //保存传入的id
    this.iid = this.$route.params.iid

    // 2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      console.log(res)
      const data = res.data.result;
      // 1.获取顶部的图片轮播数据
      this.topImages = res.data.result.itemInfo.topImages
      // 2.获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      // 3.创建店铺信息对象
      this.shop = new Shop(data.shopInfo)
      // 4.获取商品详细信息
      this.detailInfo = data.detailInfo
      //获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

      //取出评论的信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0]
      }
      // this.$nextTick(() => {
      //   //根据最新的数据,对应的Dom是已经被渲染出来
      //   //但是图片依然是没有加载完(目前获取的offsetTop是不包含图片的)
      //   this.themeTopYs.push(0);
      //   this.themeTopYs.push(this.$refs.params.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
      //   console.log(this.themeTopYs)
      // })
      // 给getThemeTopY赋值
      this.getThemeTopY = debounce(() => {
        this.$nextTick(() => {
          this.themeTopYs.push(0);
          this.themeTopYs.push(this.$refs.params.$el.offsetTop - 44)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44)
          console.log(this.themeTopYs)
        })
      }, 100)
    })
    //请求推荐数据
    getRecommend().then((res) => {
      console.log('------------------------推荐数据')
      console.log(res)
      this.recommends = res.data.data.list
    })
  },
  mounted () {
  },
  updated () {
  },
  activated () {
    this.$refs.scroll.scrollTo(0, this.saveY, 0)

  },
  deactivated () {
    //1.保存Y值
    this.saveY = this.$refs.scroll.getScrollY()


  },


  methods: {
    imageLoad () {
      this.$refs.scroll.refresh()
      this.getThemeTopY()
    },
    titleClick (index) {
      console.log(index)
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100)
    },
    contentScroll (position) {
      // console.log(position)
      // 1.获取Y值
      const positionY = -position.y
      // 2.positionY和主题中值进行对比
      //[ 0,7893,9120,9450]
      // positionY 在 0 和 7893 之间 ,index = 0 
      // positionY 在 = 7893 和 9120 之间 ,index = 1 
      // positionY 在 9120 和 9450 之间 ,index = 2
      // positionY 超过9450,index = 3
      for (let i in this.themeTopYs) {
        /*if (positionY > this.themeTopYs[parseInt(i)] && positionY < this.themeTopYs[parseInt(i) + 1 - 0]) {
          console.log(i)
        }*/
        if (this.currentIndex != i && ((i < this.themeTopYs.length - 1 && positionY >= this.themeTopYs[parseInt(i)] && positionY < this.themeTopYs[parseInt(i) + 1 - 0]) || (i == this.themeTopYs.length - 1 && positionY >= this.themeTopYs[parseInt(i)]))) {
          this.currentIndex = i
          // console.log(this.currentIndex)
          this.$refs.nav.currentIndex = this.currentIndex

        }
      }
      //是否显示回到顶部
      this.listenShowBackTop(position)
    },
    addToCart () {
      //1.获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice;
      product.iid = this.iid
      //2.将商品添加到购物车
      // this.$store.commit('addCart', product)
      this.$store.dispatch('addCart', product)
    }
  },

}
</script>
<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.content {
  height: calc(100% - 44px - 58px);
}
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
</style>