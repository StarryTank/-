<template>
	<!-- 资讯列表 -->
	<view class="info-list wrap-card border-b animate__animated animate__fadeInLeft animate__fast">
		<!-- 头像栏 -->
		<view class="flex flex-row justify-between items-center">
			<!-- 头像 -->
			<view class="flex flex-row justify-center items-center">
				<image class="img-header mr-10" :src="info.userPic" mode="widthFix" lazy-load
					@click.stop="$u.route('/pages/mine/user-space')"></image>
				<view class="flex justify-center items-center text-gray-500 text-30">{{item.username}}
					<view class="iconfont iconxingbie-nan tag-age"
						:class="[item.sex == 0 ? 'iconxingbie-nan' :'iconxingbie-nv girl']">
						<text class="ml-10">{{item.age}}</text>
					</view>
				</view>
			</view>
			<!-- 关注 -->
			<view class="flex flex-row justify-center items-center bg-gray-100 rounded-10 px-10 py-5 text-28">
				<template v-if="info.isFollow">
					<text @click="follow(false)">
						已关注
					</text>
				</template>
				<template v-else>
					<view class="flex items-center" @click="follow(true)">
						<text class="iconfont iconjia mr-10 text-24"></text>关注
					</view>
				</template>
			</view>
		</view>
		<!-- 标题 -->
		<view class="w-100 line-1 text-32 my-10" @click="goDetail()">{{info.title}}</view>
		<!-- 插槽：图片、视频 -->
		<slot>
			<view class="relative flex flex-row justify-center items-center">
				<!-- 图片 -->
				<image class="w-full rounded-20" :src="info.coverPic" mode="widthFix" lazy-load @click="goDetail()">
				</image>
				<template v-if="info.type === 'video'">
					<!-- 视频 -->
					<view class="icon-play iconfont iconbofang"></view>
					<view class="play-info">
						{{info.playNum}}次播放 {{info.playLong}}
					</view>
				</template>
			</view>
		</slot>
		<!-- 点赞、评论 -->
		<view class="flex flex-row justify-between items-center text-gray-500 my-10">
			<view class="flex flex-row justify-center items-center">
				<view class="flex flex-row justify-center items-center mr-20" @click.stop="handleMark('smile')">
					<view class="iconfont mr-10 text-36" :class="[handleIcon('smile',info.infoNum)]"></view>
					{{info.infoNum.smileNum}}
				</view>
				<view class="flex flex-row justify-center items-center" @click.stop="handleMark('cry')">
					<view class="iconfont mr-10 text-36" :class="[handleIcon('cry',info.infoNum)]"></view>
					{{info.infoNum.cryNum}}
				</view>
			</view>
			<view class="flex flex-row justify-center items-center">
				<view class="flex flex-row justify-center items-center mr-20" @click="handleComment()">
					<view class="iconfont iconliaotian mr-10 text-36"></view>
					{{info.commentNum}}
				</view>
				<view class="flex flex-row justify-center items-center" @click="handleShare()">
					<view class="iconfont iconfenxiang mr-10 text-36"></view>
					{{info.shareNum}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	/*
	 * InfoList 内容列表
	 * @description 用于首页图文列表信息
	 * @author MrThinco
	 * @property {Object} item 列表信息
	 * @property {Number} index 列表信息索引
	 * @property {Boolean} isDetail 是否详情页
	 */
	export default {
		props: {
			item: Object,
			index: {
				type: [Number, String],
				default: -1
			},
			isDetail: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				info: null
			}
		},
		watch: {
			item: {
				handler(val) {
					this.info = val
				},
				immediate: true
			}
		},
		methods: {
			// 关注
			follow(value) {
				this.$emit('follow', {
					value,
					index: this.index
				})
			},
			// 表情处理
			handleIcon(type, item = null) {
				if (!item) return
				let index = item.index
				if (type === 'smile') {
					if (index === 1) {
						return 'active,icondianzan'
					} else {
						return 'iconthumbsup'
					}
				} else {
					if (index === 2) {
						return 'active,iconz-nolikeFill'
					} else {
						return 'iconz-nolike'
					}
				}
			},
			// 操作表情
			handleMark(value) {
				this.$emit('mark', {
					value,
					index: this.index
				})
			},
			// 评论
			handleComment() {
				if (!this.isDetail) return this.goDetail()
				this.$emit('comment')
			},
			// 分享
			handleShare() {
				if (!this.isDetail) return this.goDetail()
				this.$emit('share')
			},
			// 进入详情页
			goDetail() {
				if (this.isDetail) return // 详情页，不跳转
				this.$u.route('pages/home/detail', {
					data: JSON.stringify(this.info)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.info-list {
		.img-header {
			width: 100rpx;
			height: 100rpx;
			border-radius: 100%;
		}

		.tag-age {
			background-color: $uni-color-blue;
			color: #FFFFFF;
			font-size: 24rpx;
			padding: 2rpx 10rpx;
			margin-left: 10rpx;
			border-radius: 20rpx;

			&.girl {
				background-color: $uni-color-pink;
			}
		}

		.icon-play {
			position: absolute;
			font-size: 120rpx;
			color: #FFF;
		}

		.play-info {
			position: absolute;
			right: 10rpx;
			bottom: 10rpx;
			color: #FFF;
			background-color: rgba(153, 153, 153, 0.75);
			border-radius: 50rpx;
			padding: 5rpx 20rpx;
			font-size: 25rpx;
		}

		.active {
			color: #19be6b;

			view {
				color: #19be6b;
			}
		}
	}
</style>
