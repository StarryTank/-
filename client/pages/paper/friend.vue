<template>
	<!-- 好友列表 -->
	<view class="friend">
		<!-- 小程序导航栏 -->
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar placeholder autoBack>
			<view slot="center" class="nav-center">
				<u-search placeholder="请输入内容" @click="handleSearch()" disabled></u-search>
			</view>
		</u-navbar>
		<!-- #endif -->
		<!-- 标签切换 -->
		<u-sticky bgColor="#fff">
			<view class="nav-center">
				<view :class="{'active':tabIndex === index}" @click="changeTab(index)" v-for="(item,index) in tabList"
					:key="index">
					<view class="nav-title">
						{{item.name}}
						<text class="ml-10" v-if="item.count > 0">{{item.count}}</text>
					</view>
				</view>
			</view>
		</u-sticky>
		<!-- 列表 -->
		<swiper :style="swiperStyle" :current="swiperIndex" @animationfinish="animationfinish">
			<swiper-item class="h-full" v-for="(item, index) in swiperList" :key="index">
				<scroll-view class="w-full h-full" scroll-y @scrolltolower="reachBottom">
					<!-- 有内容 -->
					<template v-if="item.list.length > 0">
						<friend-list v-for="(item1,index1) in item.list" :key="index1" :item="item1"></friend-list>
						<u-loadmore v-if="item.list.length >= 10" :status="loadStatus"></u-loadmore>
					</template>
					<!-- 无内容 -->
					<template v-else>
						<u-empty text="本来无一物,何处惹尘埃" icon="/static/img/demo/winter.svg" textSize="16" marginTop='25%'
							mode="list"></u-empty>
					</template>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import {
		newsList,
		friendList
	} from "@/utils/data/data.js"
	import FriendList from "@/pages/paper/cpns/friend-list.vue"
	export default {
		components: {
			FriendList
		},
		data() {
			return {
				// 导航标签
				tabIndex: 0,
				tabList: [{
						name: "互关",
						count: 0,
					},
					{
						name: "关注",
						count: 10
					},
					{
						name: "粉丝",
						count: 99
					}
				],
				// 列表数据
				swiperIndex: 0,
				swiperHeight: 0,
				swiperList: friendList,
				// 加载更多
				loadStatus: 'loadmore',
			}
		},
		computed: {
			swiperStyle() {
				return `height: ${this.swiperHeight}px;`
			}
		},
		// 监听原生标题栏搜索输入框点击事件
		onNavigationBarSearchInputClicked() {
			this.handleSearch()
		},
		// 监听原生标题栏按钮点击事件
		onNavigationBarButtonTap(e) {
			uni.navigateBack()
			// this.$u.route({
			// 	type: 'back'
			// })
		},
		onLoad() {
			// 设置swiperHeight
			uni.getSystemInfo({
				success: (res) => {
					// 屏幕高度（screenHeight) = 手机状态栏的高度(statusBarHeight) + 导航栏高度(44px) + 可使用窗口高度(windowHeight)
					// 可使用窗口高度 =  swiper高度 + 其他组件高度
					this.swiperHeight = res.windowHeight - uni.upx2px(80)
				}
			})
		},
		methods: {
			// 搜索
			handleSearch() {
				this.$u.route('/pages/home/search', {
					type: 'user'
				})
			},
			// tabbar点击
			changeTab(index) {
				this.tabIndex = index
				this.swiperIndex = index
			},
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				this.changeTab(e.detail.current)
			},
			// scroll-view触底
			reachBottom() {
				// 是否可加载
				if (this.loadStatus !== 'loadmore') return;
				// 加载更多
				this.loadStatus = "loading"
				setTimeout(() => {
					this.getList()
				}, 1000)
			},
			// 获取列表
			getList() {
				const index = this.tabIndex
				// 随机添加5条数据
				for (let i = 0; i < 5; i++) {
					let curr = this.$u.random(0, this.swiperList[index].list.length - 1)
					let data = this.swiperList[index].list[curr]
					this.swiperList[index].list.push(data)
				}
				// 加载更多
				this.loadStatus = "nomore"
			},
		}
	}
</script>

<style lang="scss" scoped>
	.friend {

		// 小程序导航栏
		/* #ifdef MP-WEIXIN */
		/deep/ .u-navbar {

			.u-navbar__content {
				margin-right: 180rpx !important; // 胶囊按钮
			}

			.nav-center {
				width: 100%;
				margin-left: 80rpx; // 返回按钮
			}
		}
		/* #endif */

		// 导航栏
		.nav-center {
			height: 80rpx;
			width: 100%;
			text-align: center;
			display: flex;
			justify-content: space-evenly;
			align-items: center;
			background-color: #fff;

			.nav-title {
				height: 80rpx;
				line-height: 80rpx;
				width: 120rpx;
				font-size: 30rpx;
				padding: 0 15rpx;
				font-weight: bold;
				color: $uni-text-color-gray;
			}

			.active {
				position: relative;
				display: flex;
				justify-content: center;
				align-items: center;

				.nav-title {
					color: $uni-color-green;
				}
			}

		}
	}
</style>
