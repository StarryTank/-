<template>
	<!-- 首页 -->
	<view class="home">
		<!-- 小程序导航栏 -->
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar placeholder>
			<view slot="left" class="iconfont iconqiandao"></view>
			<view slot="center" class="nav-center">
				<u-search placeholder="搜索新鲜事" @click="handleSearch()" :showAction="false" disabled></u-search>
			</view>
			<view slot="right" class="iconfont iconPensyumaobi" @click="handlePublish()"></view>
		</u-navbar>
		<!-- #endif -->
		<!-- 标签 -->
		<u-sticky bgColor="#fff">
			<u-tabs class="wrap-card" ref="tabs" @change="changeTab" :list="tablist" :current="tabIndex"
				lineColor="#01906c" :activeStyle="{color:'#01906c'}" :inactiveStyle="{color:'#909399'}" lineWidth="30"
				:scrollable="false">
			</u-tabs>
		</u-sticky>
		<!-- 列表 -->
		<swiper class="flex-1" :current="swiperIndex" @animationfinish="animationfinish">
			<swiper-item class="h-full" v-for="(item, index) in swiperList" :key="index">
				<scroll-view :ref="'scrollView'+index" :scroll-top="scrollTops[tabIndex]" class="w-full h-full" scroll-y
					@scrolltolower="reachBottom" @scroll="scroll">
					<!-- 有内容 -->
					<template v-if="item.list.length > 0">
						<!-- 资讯列表 -->
						<info-list :item="item1" v-for="(item1,index1) in item.list" :key="index1" :index="index1"
							@mark="handleMark" @follow="handleFollow">
						</info-list>
						<u-loadmore :status="loadStatus[tabIndex]"></u-loadmore>
					</template>
					<!-- 无内容 -->
					<template v-else>
						<u-empty text="本来无一物,何处惹尘埃" icon="/static/img/demo/winter.svg" textSize="16" marginTop='25%'
							mode="list"></u-empty>
					</template>
				</scroll-view>
			</swiper-item>
		</swiper>
		<!-- 回到顶部 -->
		<view v-if="scrollTop[tabIndex] > 400" class="go-top" @click="goTop">
			<u-icon color="#01906c" name="arrow-up" size="24"></u-icon>
		</view>
	</view>
</template>

<script>
	import {
		newsList
	} from "@/utils/data/data.js"
	import InfoList from "@/pages/home/cpns/info-list.vue"
	export default {
		components: {
			InfoList
		},
		data() {
			return {
				scrollTops: [0, 0, 0, 0, 0, 0],
				scrollTop: [0, 0, 0, 0, 0, 0],
				// 加载更多 // loadmore/ loading / nomore
				loadStatus: ['loadmore', 'loadmore', 'loadmore', 'loadmore', 'loadmore', 'loadmore'],
				// 标签栏
				tabIndex: 0,
				tablist: [{
						name: "关注"
					},
					{
						name: "谷雨"
					},
					{
						name: "芒种"
					},
					{
						name: "小满",
					},
					{
						name: "霜降"
					},
					{
						name: "寒露"
					}
				],
				// 列表数据
				swiperIndex: 0,
				swiperList: newsList
			}
		},
		// 监听原生标题栏搜索输入框点击事件
		onNavigationBarSearchInputClicked() {
			this.handleSearch()
		},
		// 监听原生标题栏按钮点击事件
		onNavigationBarButtonTap(e) {
			switch (e.index) {
				case 1:
					this.handlePublish()
					break;
			}
		},
		methods: {
			// 发布
			handlePublish() {
				this.$u.route('/pages/home/release')
			},
			// 搜索
			handleSearch() {
				this.$u.route('/pages/home/search', {
					type: 'info'
				})
			},
			// tab栏切换
			changeTab(item) {
				this.tabIndex = item.index
				this.swiperIndex = item.index
			},
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				this.tabIndex = e.detail.current
				this.swiperIndex = e.detail.current
			},
			// scroll-view到底部加载更多
			reachBottom() {
				// 是否可加载
				if (this.loadStatus[this.tabIndex] !== 'loadmore') return
				// 加载中
				this.loadStatus.splice(this.tabIndex, 1, "loading")
				setTimeout(() => {
					this.getList(this.tabIndex)
				}, 1000);
			},
			// 获取列表
			getList(index) {
				// 随机添加5条数据
				for (let i = 0; i < 5; i++) {
					let curr = this.$u.random(0, this.swiperList[index].list.length - 1)
					let data = this.swiperList[index].list[curr]
					this.swiperList[index].list.push(data)
				}
				// 加载更多
				this.loadStatus.splice(this.tabIndex, 1, "nomore")
			},
			// 回到顶部
			scroll(e) {
				const index = this.tabIndex
				this.scrollTop.splice(index, 1, e.detail.scrollTop) // 400显示回到顶部
			},
			// 回到顶部
			goTop() {
				const index = this.tabIndex
				// 解决view层不同步的问题
				this.scrollTops.splice(index, 1, this.scrollTop[index])
				this.$nextTick(function() {
					this.scrollTops.splice(index, 1, 0)
					this.scrollTop.splice(index, 1, 0)
				})
			},
			// 关注
			handleFollow(item) {
				this.swiperList[this.swiperIndex].list[item.index].isFollow = item.value
				const title = item.value ? '关注成功' : '取消成功'
				uni.showToast({
					title,
					icon: 'none',
				})
			},
			// 表情
			handleMark(item) {
				let infoNum = this.swiperList[this.swiperIndex].list[item.index].infoNum
				switch (item.value) {
					case 'smile':
						if (infoNum.index == 1) return // 微笑
						else if (infoNum.index == 2) infoNum.cryNum--
						infoNum.index = 1
						infoNum.smileNum++
						break;
					case 'cry':
						if (infoNum.index == 2) return // 踩
						else if (infoNum.index == 1) infoNum.smileNum--
						infoNum.index = 2
						infoNum.cryNum++
						break
				}
				const title = item.value === 'smile' ? '谢谢表扬' : '继续加油'
				uni.showToast({
					title,
					icon: 'none',
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.home {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top) - var(--window-bottom)); // 视高 - 内容区顶部 - 内容区底部
		width: 100%;
		
		// 小程序导航栏
		/* #ifdef MP-WEIXIN */
		/deep/ .u-navbar {
			.iconfont {
				font-size: 48rpx;
				color: $uni-color-green;
			}


			.u-navbar__content {
				margin-right: 180rpx !important; // 胶囊按钮
			}
		}

		/* #endif */

		// 回到顶部
		.go-top {
			position: fixed;
			right: 30rpx;
			bottom: 100rpx;
			height: 80rpx;
			width: 80rpx;
			background: #E5E7EB;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 100%;
		}
	}
</style>
