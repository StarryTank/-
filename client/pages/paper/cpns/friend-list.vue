<template>
	<!-- 小纸条/好友列表 -->
	<view class="user-list p-20 flex items-center border-b border-gray-100" hover-class="bg-gray-100">
		<image class="user-img mr-20 rounded-full" :src="item.avatar" mode="aspectFill"></image>
		<view class="flex flex-col flex-1">
			<text class="text-30 font-bold mb-10">{{item.name}}</text>
			<view class="iconfont iconxingbie-nan tag-age"
				:class="[item.sex == 0 ? 'iconxingbie-nan' :'iconxingbie-nv girl']">
				<text class="ml-10">{{item.age}}</text>
			</view>
		</view>
		<view class="">
			<text v-if="!item.isFollow" class="iconfont iconxuanze text-38 text-gray-300"></text>
			<text v-if="item.isFollow" class="iconfont iconxuanze1 text-38 text-green"></text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				default: () => ({})
			}
		}
	}
</script>

<style lang="scss" scoped>
	// 用户列表
	.user-list {
		.user-img {
			width: 100rpx;
			height: 100rpx;
		}

		// 性别图标
		.tag-age {
			background-color: $uni-color-blue;
			color: #FFFFFF;
			font-size: 24rpx;
			padding: 2rpx 10rpx;
			border-radius: 20rpx;
			max-width: 60rpx;

			&.girl {
				background-color: $uni-color-pink;
			}
		}
	}
</style>
