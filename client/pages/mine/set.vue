<template>
	<!-- 我的/设置页 -->
	<view class="set">
		<u-cell-group :border='false'>
			<u-cell v-for="(item,index) in setList" :key="index" :title="item.name" :value="item.value" isLink
				size="large" :border='false' @click="goPage(item.url)">
			</u-cell>
		</u-cell-group>
		<!-- 底部操作 -->
		<view class="wrap-bottom-bar">
			<view class="bar-placeholder"></view>
			<view class="bar-content">
				<u-button :customStyle="btnStyle" :ripple="true" shape="circle" @click="goPage('logout')">退出</u-button>
			</view>
		</view>
		<!-- 退出 -->
		<u-modal title="提示" @cancel="logoutShow=false" showCancelButton :show="logoutShow" @confirm="logout"
			ref="uModal" :asyncClose="true" content="您是否确定要，退出登录?"></u-modal>
		<!-- 注销 -->
		<u-modal title="提示" @cancel="cancleShow=false" showCancelButton :show="cancleShow" @confirm="cancleShow=false"
			ref="uModal" :asyncClose="true" content="您是否确定要，注销账号?"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				logoutShow: false,
				cancleShow: false,
				// 设置列表
				setList: [{
						name: '账号与安全',
						url: 'edit-pwd'
					},
					{
						name: '绑定邮箱',
						url: 'bind-email'
					},
					{
						name: '修改资料',
						url: 'edit-info'
					},
					{
						name: '清除缓存',
						url: 'clear'
					},
					{
						name: '意见反馈',
						url: 'feedback'
					},
					{
						name: '关于社区',
						url: 'about'
					},
					{
						name: '注销账号',
						url: 'cancle'
					}
				],
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
		onLoad() {
			this.getStorage()
		},
		methods: {
			goPage(url) {
				if (url === 'cancle') return this.cancleShow = true // 注销
				if (url === 'logout') return this.logoutShow = true // 退出
				if (url === 'clear') return this.clearStorage() // 清除缓存
				this.$u.route('/pages/mine/' + url)
			},
			// 退出
			logout() {
				this.logoutShow = false
				this.$u.route('/pages/mine/login')
			},
			// 清除缓存
			clearStorage() {
				const _this = this
				uni.showModal({
					title: '提示',
					content: '是否要清除所有缓存？',
					cancelText: '不清除',
					confirmText: '清除',
					success(res) {
						if (res.confirm) {
							uni.clearStorage()
							_this.getStorage()
							_this.$u.toast('清除成功')
						}
					}
				})
			},
			// 获取缓存
			getStorage() {
				const _this = this
				// 获取缓存信息
				uni.getStorageInfo({
					success: function(res) {
						// 当前占用的空间大小, 单位：kb
						const value = res.currentSize
						const val = value > 1024 ? (value / 1024).toFixed(2) + 'MB' : value
							.toFixed(2) + 'KB'
						_this.$set(_this.setList[3],'value', val)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.set {}
</style>
