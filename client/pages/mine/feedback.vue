<template>
	<!-- 我的/设置/意见反馈 -->
	<view class="feedback">
		<u-collapse accordion :border="false" @change="change" @close="close" @open="open">
			<u-collapse-item v-for="(item,index) in list" :key="index" :title="item.name">
				<text class="u-collapse-content">{{item.content}}</text>
			</u-collapse-item>
		</u-collapse>
		<!-- 底部操作 -->
		<view class="wrap-bottom-bar">
			<view class="bar-placeholder"></view>
			<view class="bar-content">
				<u-button :customStyle="btnStyle" :ripple="true" shape="circle">意见反馈
				</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		feedbackList
	} from "@/utils/data/data.js"
	export default {
		data() {
			return {
				list: feedbackList,
				// 按钮配置
				btnStyle: {
					width: "90%",
					height: "75rpx",
					background: "linear-gradient(-45deg,#01906c,#34D399)",
					color: "#FFFFFF",
					fontSize: "30rpx",
				},
			}
		},
	}
</script>

<style lang="scss" scoped>
	.feedback {}
</style>
