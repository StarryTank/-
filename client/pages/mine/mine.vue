<template>
	<!-- 我的 -->
	<view class="my">
		<!-- 状态栏 -->
		<view class="status-bar bg-white pt-30"></view>
		<!-- 头像栏 -->
		<view class="flex items-center wrap-card" hover-class="bg-gray-100" @click="$u.route('/pages/mine/set')">
			<image class="header-img" src="/static/img/header/d.svg" mode=""
				@click.stop="$u.route('/pages/mine/user-space')"></image>
			<view class="flex flex-col flex-1 px-20">
				<text class="text-32 font-bold">{{ userInformation.user_name }}</text>
				<text class="text-28 text-gray-500 mt-10">总帖子&nbsp;38&nbsp;&nbsp;今日发帖&nbsp;2</text>
			</view>
			<text class="iconfont iconqianjin"></text>
		</view>
		<!-- 统计栏 -->
		<view class="wrap-card flex items-center">
			<view v-for="(item,index) in countList" :key="index"
				class="flex-1 flex flex-col items-center justify-center">
				<view class="text-32 font-bold">
					{{item.num}}
				</view>
				<view class="text-28 text-gray-500 mt-10">
					{{item.name}}
				</view>
			</view>
		</view>
		<!-- 广告位 -->
		<view class="wrap-card">
			<image class="adv-img rounded-20" src="../../static/img/list/05.svg" mode="aspectFill"></image>
		</view>
		<!-- 设置 -->
		<u-cell-group :border='false'>
			<u-cell v-for="(item,index) in setList" :key="index" :title="item.name" isLink size="large" :border='false'
				@click="goPage(item.url)">
				<text slot="icon" class="iconfont" :class="item.icon"></text>
			</u-cell>
		</u-cell-group>
	</view>
</template>

<script>
	import request from '../../api/request.js';
	export default {
		data() {
			return {
				// 统计列表
				countList: [{
						num: 12,
						name: '帖子'
					},
					{
						num: 278,
						name: '动态'
					},
					{
						num: 369,
						name: '评论'
					},
					{
						num: 750,
						name: '粉丝'
					}
				],
				// 设置列表
				setList: [
					{
						icon: 'iconhuiyuan',
						name: '个人空间',
						url: 'user-space'
					},
					{
						icon: 'iconliulan',
						name: '浏览历史'
					},
					{
						icon: 'iconrenzheng',
						name: '社区认证'
					},
					{
						icon: 'iconshenhe',
						name: '审核帖子'
					},
					// #ifdef MP-WEIXIN
					{
						icon: 'iconshezhi1',
						name: '我的设置',
						url: 'set'
					}
					// #endif
				],
				userInformation:'',
				userN:''
			}
		},
		// 监听导航栏按钮点击
		onNavigationBarButtonTap() {
			this.goSet()
		},
		onShow() {
			console.log(1)
			try {
				var that = this
				uni.getStorage(
				{
					key:"userN",
					success:function(res){
						console.log((res.data))
						that.userN=res.data
					}
				}
				);
				if (this.userN) {
					console.log(this.userN);
				}
				} catch (e) {
				 //error
				}
			uni.request({
				header: {
					'content-type': 'application/x-www-form-urlencoded', 
				},
				url:"http://192.168.31.135:9090/user/init",
				method:'POST',
				data:{
					"user_name":this.userN,
				},
				success:(res)=>{
					//console.log(res.data.data);
					this.userInformation=res.data.data;
					uni.setStorage({
						key:'userInformation',
						data:res.data.data
					},
					)
					//this.userInformation= uni.getStorageSync('user_id')
					console.log(this.userInformation)
				}
			})
			//console.log(this.userInformation)
		},
		methods: {
			goSet() {
				this.$u.route('/pages/mine/set')
			},
			goPage(url) {
				if (url) this.$u.route('/pages/mine/' + url)
			},				
			/*async getUserinformation(){
				let res = await request({
					url: '/user/init',
					data: {
						user_name: this.userN,
					},
					method: 'POST'
				});
				console.log(res.data);
				this.userInformation=res.data
			}*/
		}
	}
</script>

<style lang="scss" scoped>
	.my {

		.header-img {
			width: 100rpx;
			height: 100rpx;
			border-radius: 100%;
		}

		.adv-img {
			height: 200rpx;
			width: 100%;
		}
	}
</style>
