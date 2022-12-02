<template>
	<view class="hot-nav">
		<view class="flex justify-between column-one">
			<view class="">热门分类</view>
			<view class="flex justify-between items-center" @click="goTopicNav()">
				更多<view class="iconfont iconqianjin"></view>
			</view>
		</view>
		<view class="flex column-two">
			<view v-for="(item,index) in list" :key="index" >{{item.title}}</view>
		</view>
	</view>
</template>

<script>
	/*
	 * newsTopicNav 新鲜事页话题导航
	 * @description 用于首页图文列表信息
	 * @author MrThinco
	 * @property {Array} list 列表信息
	 */
	export default {
		props:{
			list: Array
		},
		data() {
			return {
				
			};
		},
		methods: {
			// 话题分类
			goTopicNav() {
				this.$u.route('/pages/news/news-topic-cate');
			}
		}
	}
</script>

<style lang="scss" scoped>
.hot-nav {
	border-top: 1rpx solid #EEEEEE;
	border-bottom: 1rpx solid #EEEEEE;
	padding: 20rpx;
	.column-one {
		margin-bottom: 20rpx;
		& > view:last-child {
			color: #9b9b9b;
		}
		& > view:first-child {
			font-size: 32rpx;
		}
	}
	.column-two > view {
		text-align: center;
		flex: 1;
		background: #f9f9f9;
		color: #9b9b9b;
		border-radius: 10rpx;
		margin: 0 10rpx;
	}
}
</style>
