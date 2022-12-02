<template>
	<!-- 首页/详情页 -->
	<!-- h5 滚动穿透不需要处理，wx、app 需要 使用 page-meta 组件配合阻止滚动穿透 -->
	<page-meta :page-style="'overflow:'+(showShare?'hidden':'visible')"></page-meta>
	<view class="detail">
		<!-- 详细信息 -->
		<info-list :item="info" isDetail @mark="handleMark" @comment="handleComment" @share="handleShare"
			@follow="handleFollow">
			<view class="text-30 my-20 text-gray-600">{{info.content}}</view>
			<view>
				<image class="w-full" v-for="(item,index) in info.images" :key="index" :src="item" mode="aspectFill"
					@click="handlePreview(index)"></image>
			</view>
		</info-list>
		<u-gap height="20" bgColor="#F9FAFB"></u-gap>
		<view class="p-20 text-30 font-bold">
			最新评论<text class="ml-10">3</text>
		</view>
		<!-- 评论列表 -->
		<view class="comment">
			<!-- 头像 -->
			<image class="rounded-full mr-20" src="../../static/img/header/a.svg" mode="aspectFill"
				style="width: 100rpx;height: 100rpx;"></image>
			<view class="flex-1 flex flex-col">
				<view class="text-28 font-bold text-blue">
					Jay
				</view>
				<view class="comment-text text-26 line-1 my-10">
					天青色等烟雨，而我在等你。
				</view>
				<view class="comment-replay text-blue flex items-center">
					2条回复<text class="iconfont iconqianjin"></text>
				</view>
				<view class="flex justify-between text-24 my-10">
					<view class="text-gray-500">
						2022-10-09 10:08
					</view>
					<view class="text-blue">
						回复
					</view>
				</view>
			</view>
		</view>
		<!-- 分享功能 -->
		<popup-share :show.sync="showShare"></popup-share>
		<!-- 底部操作栏 -->
		<view class="bottom-input">
		</view>
		<bottom-input v-if="showComment" @submit="submit"></bottom-input>
	</view>
</template>

<script>
	import {
		detailInfo
	} from "@/utils/data/data.js"
	import InfoList from "@/pages/home/cpns/info-list.vue"
	export default {
		components: {
			InfoList,
		},
		data() {
			return {
				showComment: false, // 评论
				showShare: false, // 分享
				info: {},
			}
		},
		onLoad(e) {
			e.data && this.init(JSON.parse(e.data))
		},
		// 监听原生标题栏按钮点击事件
		onNavigationBarButtonTap(e) {
			switch (e.index) {
				case 0:
					// 分享
					this.showShare = true
					break;
			}
		},
		onBackPress() {
			this.showShare = false
		},
		// 监听：小程序中用户点击分享
		onShareAppMessage() {
			return {
				title: this.info.title,
				path: '/pages/home/detail?data=' + JSON.stringify(this.info)
			}
		},
		methods: {
			// 初始化
			init(data) {
				// 增加字段
				const result = {
					content: detailInfo,
					images: [
						'/static/img/list/06.svg', '/static/img/list/07.svg', '/static/img/list/08.svg'
					]
				}
				this.info = {
					...data,
					...result
				}
				uni.setNavigationBarTitle({
					title: data.title
				})
			},
			// 表情
			handleMark(item) {
				switch (item.value) {
					case 'smile':
						if (this.info.infoNum.index == 1) return // 微笑
						else if (this.info.infoNum.index == 2) this.info.infoNum.cryNum--
						this.info.infoNum.index = 1
						this.info.infoNum.smileNum++
						break;
					case 'cry':
						if (this.info.infoNum.index == 2) return // 踩
						else if (this.info.infoNum.index == 1) this.info.infoNum.smileNum--
						this.info.infoNum.index = 2
						this.info.infoNum.cryNum++
						break
				}
				const title = item.value === 'smile' ? '谢谢表扬' : '继续加油'
				uni.showToast({
					title,
					icon: 'none',
				})
			},
			// 评论
			handleComment() {
				this.showComment = true
			},
			// 分享
			handleShare() {
				this.showShare = true
			},
			// 关注
			handleFollow(item) {
				this.info.isFollow = item.value
				const title = item.value ? '关注成功' : '取消成功'
				uni.showToast({
					title,
					icon: 'none',
				})
			},
			// 预览
			handlePreview(current) {
				uni.previewImage({
					urls: this.info.images,
					current
				})
			},
			// 提交评论
			submit(data) {
				this.showComment = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.detail {
		.comment {
			display: flex;
			margin: 20rpx;

			.comment-text {
				max-width: calc(100vw - 160rpx);
			}

			.comment-replay {
				height: 40rpx;
			}
		}

		.bottom-input {
			height: 100rpx;
		}
	}
</style>
