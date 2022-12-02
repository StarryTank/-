<template>
	<!-- 小纸条页 -->
	<view class="paper">
		<!-- 小程序导航栏 -->
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar placeholder>
			<view class="flex" slot="left">
				<view class="iconfont iconduoren" @click="handleFirend()">
				</view>
				<view class="iconfont iconcaidan ml-20" @click="showPopup = true">
				</view>
			</view>
			<view slot="center" class="nav-center">
				小纸条
			</view>
		</u-navbar>
		<!-- #endif -->
		<paper-list v-for="(item,index) in list" :key="index" :item="item"></paper-list>
		<!-- 空数据 -->
		<u-empty v-if="list.length === 0" text="本来无一物,何处惹尘埃" icon="/static/img/demo/spring.svg" textSize="16"
			marginTop='25%' mode="list"></u-empty>
			<button @click="goChatall()">公共聊天室</button>
		<!-- 底部弹窗 -->
		<u-popup :show="showPopup" @close="showPopup = false" mode="top" :safeAreaInsetTop="true">
			<view class="flex justify-center items-center text-30 py-20 border-b" hover-class="bg-gray"
				@click="popupHandle('friend')">
				<text class="iconfont iconsousuo mr-20"></text>添加好友
			</view>
			<view class="flex justify-center items-center text-30 py-20" hover-class="bg-gray"
				@click="popupHandle('clear')">
				<text class="iconfont iconshanchu mr-20"></text>清空消息
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		paperList
	} from '@/utils/data/data.js'
	import PaperList from '@/pages/paper/cpns/paper-list.vue'
	export default {
		components: {
			PaperList
		},
		data() {
			return {
				list: paperList,
				showPopup: false,
			}
		},
		// 监听下拉动作
		onPullDownRefresh() {
			// 下拉刷新
			this.refresh()
		},
		// 监听原生标题栏按钮点击事件
		onNavigationBarButtonTap(e) {
			switch (e.index) {
				case 0:
					// 打开好友列表
					this.handleFirend()
					break
				case 1:
					// 打开菜单功
					this.showPopup = true
					break
			}
		},
		methods: {
			// 下拉刷新
			refresh() {
				setTimeout(() => {
					this.list = []
					// 停止下拉刷新
					uni.stopPullDownRefresh()
				}, 1000)
			},
			// 好友列表
			handleFirend() {
				this.$u.route('pages/paper/friend')
			},
			// 弹窗操作
			popupHandle(type) {
				const _this = this
				if (type === 'friend') {
					this.$u.route('pages/paper/friend')
				} else {
					uni.showModal({
						title: '提示',
						content: '您确定要清空所有消息吗？',
						success(res) {
							if (res.confirm) {
								_this.list = []
								_this.$u.toast('消息已清空')
							}
						}
					})
				}
				this.showPopup = false
			},
			goChatall(){
				this.$u.route('/pages/paper/chatall');
			}
		}
	}
</script>

<style lang="scss" scoped>
	.paper {

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

			.nav-center {
				font-size: 30rpx;
				text-align: center;
				font-weight: bold;
				margin-left: 200rpx;
				width: calc(100% - 200rpx);
			}
		}

		/* #endif */
	}
</style>
