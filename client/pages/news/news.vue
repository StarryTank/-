<template>
	<!-- 新鲜事页 -->
	<view class="news">
		<!-- 导航栏 -->
		<u-navbar placeholder>
			<view slot="left"></view>
			<view slot="center" class="nav-center">
				<view :class="{'active':tabIndex === index}" @click="changeTab(index)" v-for="(item,index) in tabList"
					:key="index">
					<view class="nav-title">{{item.name}}</view>
					<view class="active-line"></view>
				</view>
			</view>
		</u-navbar>
		<!-- 信息列表 -->
		<swiper class="bg-white px-20" :style="{height:swiperHeight + 'px'}" :current="tabIndex" @change="changeSwiper">
			<!-- 关注 -->
			<swiper-item>
				<scroll-view scroll-y class="flow h-full" @scrolltolower="reachBottom">
					<!-- 资讯列表 -->
					<info-list v-for="(item,index) in followList.list" :key="index" :item="item">
					</info-list>
					<u-loadmore :status="followList.loadStatus"></u-loadmore>
				</scroll-view>
			</swiper-item>
			<!-- 话题 -->
			<swiper-item>
				<scroll-view scroll-y class="topic h-full">
					<!-- 搜索框 -->
					<view class="search-input" @click="goSearch">
						<u-input type="text" placeholder="请输入搜索内容"
							placeholderClass="iconfont iconsousuo text-28" border="none" inputAlign="center" clearable
							confirmType="search" disabled>
						</u-input>
					</view>
					<!-- 轮播图 -->
					<u-swiper :list="topicList.swiper" keyName="image" indicator indicatorMode="line" circular showTitle
						height="400rpx" previousMargin="30" nextMargin="30" bgColor="#ffffff"></u-swiper>
					<!-- 热门分类 -->
					<news-topic-nav :list="topicList.topic"></news-topic-nav>
					<!-- 最近更新 -->
					<view class="last-update">
						<view class="last-update-name">最近更新</view>
						<topic-list :item="item" v-for="(item,index) in topicList.list" :key="index"></topic-list>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import {
		newsList,
		topicList
	} from "@/utils/data/data.js"
	import InfoList from "@/pages/home/cpns/info-list.vue"
	import NewsTopicNav from "@/pages/news/cpns/news-topic-nav.vue"
	import TopicList from "@/pages/news/cpns/topic-list.vue"
	export default {
		components: {
			InfoList,
			NewsTopicNav,
			TopicList
		},
		data() {
			return {
				// 导航标签
				tabIndex: 1,
				tabList: [{
						name: "关注",
						id: 'follow'
					},
					{
						name: "话题",
						id: 'topic'
					}
				],
				swiperHeight: 0,
				// 关注列表
				followList: {
					// 加载更多
					loadStatus: 'loadmore',
					// 列表数据
					list: newsList[0].list
				},
				// 话题列表
				topicList: {
					swiper: [ // 轮播图
						{
							image: '/static/img/demo/spring.svg',
							title: '迷人的春天是令人欢欣鼓舞的。'
						},
						{
							image: '/static/img/demo/summer.svg',
							title: '一道残阳铺水中，半江瑟瑟半江红。'
						},
						{
							image: '/static/img/demo/autumn.svg',
							title: '金秋的阳光温馨恬静，金秋的微风和煦轻柔。'
						},
						{
							image: '/static/img/demo/winter.svg',
							title: '风吹过，寒气直侵入骨头。'
						}
					],
					topic: [ // 话题
						{
							title: '最新',
							id: 1
						},
						{
							title: '游戏',
							id: 2
						},
						{
							title: '健身',
							id: 3
						},
						{
							title: '情感',
							id: 4
						},
						{
							title: '故事',
							id: 5
						},
						{
							title: '旅游',
							id: 6
						}
					],
					list: topicList[1].list
				}
			}
		},
		onLoad() {
			// 设置swiperHeight
			uni.getSystemInfo({
				success: (res) => {
					// 屏幕高度（screenHeight) = 手机状态栏的高度(statusBarHeight) + 导航栏高度(44px) + 可使用窗口高度(windowHeight)
					// 可使用窗口高度 = swiper高度 + 自定义导航栏高度
					this.swiperHeight = res.windowHeight - 44
				}
			})
		},
		methods: {
			// tabbar点击
			changeTab(index) {
				this.tabIndex = index
			},
			// swiper滑动
			changeSwiper(e) {
				this.tabIndex = e.detail.current
			},
			// scroll-view触底
			reachBottom() {
				// 是否可加载
				if (this.followList.loadStatus !== 'loadmore') return;
				// 加载更多
				this.followList.loadStatus = "loading"
				setTimeout(() => {
					this.getList()
				}, 1000);
			},
			// 获取列表
			getList(idx) {
				// 随机添加5条数据
				for (let i = 0; i < 5; i++) {
					let index = this.$u.random(0, this.followList.list.length - 1)
					let data = JSON.parse(JSON.stringify(this.followList.list[index]))
					this.followList.list.push(data)
				}
				// 更新加载状态
				this.followList.loadStatus = "nomore"
			},
			// 搜索
			goSearch() {
				this.$u.route('/pages/home/search', {
					type: 'topic'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.news {

		// 导航栏
		/deep/ .u-navbar {

			.iconfont {
				font-size: 48rpx;
				color: $uni-color-green;
			}

			.nav-center {
				text-align: center;
				display: flex;
				justify-content: center;
				align-items: center;

				.nav-title {
					width: 60rpx;
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

					.active-line {
						border-bottom: 8rpx solid $uni-color-green;
						border-radius: 20rpx;
						width: 70rpx;
						position: absolute;
						bottom: -10rpx;
						left: 50%;
						margin-left: -35rpx;
					}
				}

			}
		}

		.topic {
			.search-input {
				margin-top: 20rpx;
				margin-bottom: 20rpx;
				height: 70rpx;
				background-color: #F4F4F4;
				border-radius: 10rpx;
				/deep/ .u-input {
					height: 100%;
				}
			}

			.last-update {
				padding: 20rpx;

				.last-update-name {
					font-size: 32rpx;
					padding-bottom: 5rpx;
				}
			}

		}
	}
</style>
