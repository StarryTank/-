<template>
	<!-- 小纸条/聊天列表 -->
	<view class="chat">
		<!-- 聊天列表 -->
		<!-- 方式一：通过js计算高度控制：scroll-view高度 -->
		<!-- <scroll-view :style="`height:${scrollHeight}px;`" scroll-y="true"> -->
		<!-- 方式二：通过css布局控制：scroll-view高度 -->
		<scroll-view class="chat-scroll" scroll-y="true" :scroll-into-view="scrollInto" scroll-with-animation>
			<!-- 消息列表：绑定id，用于滚动到该元素  -->
			<chat-list v-for="(item,index) in list" :key="index" :item="item"
				:pretime="index > 0 ? list[index-1].createTime : 0"></chat-list>
		</scroll-view>
		<!-- 底部操作栏 -->
		<bottom-input @submit="submit"></bottom-input>
	</view>
</template>

<script>
	import {
		chatList
	} from "@/utils/data/data.js"
	import ChatList from "@/pages/paper/cpns/chat-list.vue"
	import BottomInput from "@/components/bottom-input/bottom-input.vue"
	export default {
		components: {
			ChatList,
			BottomInput
		},
		data() {
			return {
				scrollInto: '',
				scrollHeight: 0,
				list: chatList,
			}
		},
		onLoad() {
			// 设置scrollHeight
			uni.getSystemInfo({
				success: (res) => {
					// 屏幕高度（screenHeight) = 手机状态栏的高度(statusBarHeight) + 导航栏高度(44px) + 可使用窗口高度(windowHeight)
					// 可使用窗口高度 = scroll-view高度 + 其他组件高度
					this.scrollHeight = res.windowHeight - uni.upx2px(82)
				}
			})
		},
		// 页面加载完成
		onReady() {
			// 滚动到底部
			this.scrollToBottom()
		},
		methods: {
			// 发送消息
			submit(data) {
				const obj = {
					userid: 1,
					avatar: '/static/img/header/a.svg',
					username: 'jay',
					data,
					type: 'text',
					createTime: this.$u.timeFormat(new Date(), 'yyyy-mm-dd hh:MM:ss')
				}
				this.list.push(obj)
				// 滚动到底部
				setTimeout(() => {
					this.scrollToBottom()
				}, 500)
			},
			// 滚动到底部
			scrollToBottom() {
				const lastIndex = this.list.length - 1
				if (lastIndex < 0) return
				this.scrollInto = 'chat' + lastIndex
			}
		}
	}
</script>

<style lang="scss" scoped>
	.chat {

		// 通过绝对定位控制scroll-view高度
		.chat-scroll {
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 85rpx;
		}

		.bottom-handle {
			border-top: 2rpx solid $uni-border-color1;
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			height: 85rpx;
			background-color: #fff;
			display: flex;
			align-items: center;

			.send-btn {
				width: 80rpx;
				text-align: center;
			}
		}
	}
</style>
