<template>
	<!-- 新鲜事/话题列表 -->
	<view class="topic-list flex" @click="goTopicDetail(item)">
		<image :src="item.img" lazy-load mode="heightFix"></image>
		<view class="my-20 flex-1">
			<view class="text-black text-32">#{{item.title}}#</view>
			<view class="text-gray-400 text-26 my-10">{{item.desc}}</view>
			<view class="text-gray-400 text-24 my-10 flex w-full">
				<view class="w-1-2 text-left">热度：{{item.totalNum}}</view>
				<view class="w-1-2 text-left">今日：{{item.todayNum}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	/*
	 * newsTopicList 新鲜事页话题列表
	 * @description 用于新鲜事页中话题栏下面的话题列表
	 * @author MrThinco
	 * @property {Object} item 信息
	 */
	export default {
		props: {
			item: {
				type: Object,
				default: () => ({})
			}
		},
		data() {
			return {

			}
		},
		methods: {
			// 话题详情
			goTopicDetail(item) {
				this.$u.route({
					url: '/pages/news/news-topic-detail',
					params: item
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.topic-list {
		image {
			width: 150rpx;
			height: 150rpx;
			border-radius: 10rpx;
			margin-right: 20rpx;
		}
	}
</style>
