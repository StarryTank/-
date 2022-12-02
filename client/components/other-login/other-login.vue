<template>
	<!-- 三方登录 -->
	<view class="other-login">
		<!-- #ifdef APP-PLUS -->
		<template v-if="providerList.length > 0">
			<u-divider text="社交账号登录"></u-divider>
			<view class="login-method flex justify-evenly">
				<image v-for="(item,index) in providerList" :key="item.id" class="method-img" :src="item.icon"
					mode="aspectFit" @click="tologin(item)">
				</image>
			</view>
		</template>
		<!-- #endif -->
		<!-- #ifdef MP-WEIXIN -->
		<view class="login-wx">
			<button type="primary" open-type="getUserInfo" @getuserinfo="getUserInfo" size="mini">微信登录</button>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				providerList: [],
			}
		},
		mounted() {
			// #ifdef APP-PLUS
			this.getProvider()
			// #endif
		},
		methods: {
			// 获取登录服务提供商
			getProvider() {
				uni.getProvider({
					service: 'oauth',
					success: (result) => {
						for (let value of result.provider) {
							console.log('value', value)
							let providerName = '';
							let providerIcon = ''
							switch (value) {
								case 'weixin':
									providerName = '微信登录'
									providerIcon = '/static/img/share/wx.svg'
									break;
								case 'qq':
									providerName = 'QQ登录'
									providerIcon = '/static/img/share/qq.svg'
									break;
								case 'sinaweibo':
									providerName = '新浪微博登录'
									providerIcon = '/static/img/share/wb.svg'
									break;
									// case 'xiaomi':
									// 	providerName = '小米登录'
									// 	break;
									// case 'alipay':
									// 	providerName = '支付宝登录'
									// 	break;
									// case 'baidu':
									// 	providerName = '百度登录'
									// 	break;
									// case 'jd':
									// 	providerName = '京东登录'
									// 	break;
									// case 'toutiao':
									// 	providerName = '头条登录'
									// 	break;
									// case 'apple':
									// 	providerName = '苹果登录'
									// 	break;
									// case 'univerify':
									// 	providerName = '一键登录'
									// 	providerIcon = '/static/img/share/rz.svg'
									// 	break;
							}
							if (providerName) {
								this.providerList.push({
									name: providerName,
									icon: providerIcon,
									id: value
								})
							}
						}
					},
					fail: (error) => {
						console.log('获取登录通道失败', error);
					}
				})
			},
			// 登录
			tologin(provider) {
				// 一键登录已在APP onLaunch的时候进行了预登陆，可以显著提高登录速度。登录成功后，预登陆状态会重置
				uni.login({
					provider: provider.id,
					// #ifdef MP-ALIPAY
					scopes: 'auth_user', //支付宝小程序需设置授权类型
					// #endif
					success: async (res) => {
						console.log('login success:', res);
						this.Toast({
							title: '登录成功'
						})
						// 更新保存在 store 中的登录状态
						this.login(provider.id);

						// #ifdef APP-PLUS
						this.setUniverifyLogin(provider.id === 'univerify')
						// switch (provider.id) {
						// 	case 'univerify':
						// 		this.loginByUniverify(provider.id, res)
						// 		break;
						// 	case 'apple':
						// 		this.loginByApple(provider.id, res)
						// 		break;
						// }
						// #endif

						// #ifdef MP-WEIXIN
						console.warn('如需获取openid请参考uni-id: https://uniapp.dcloud.net.cn/uniCloud/uni-id')
						uni.request({
							url: 'https://97fca9f2-41f6-449f-a35e-3f135d4c3875.bspapp.com/http/user-center',
							method: 'POST',
							data: {
								action: 'loginByWeixin',
								params: {
									code: res.code,
									platform: 'mp-weixin'
								}
							},
							success(res) {
								console.log(res);
								if (res.data.code !== 0) {
									console.log('获取openid失败：', res.data.errMsg);
									return
								}
								uni.setStorageSync('openid', res.data.openid)
							},
							fail(err) {
								console.log('获取openid失败：', err);
							}
						})
						// #endif
					},
					fail: (err) => {
						console.log('login fail:', err);

						// 一键登录点击其他登录方式
						if (err.code == '30002') {
							uni.closeAuthView();
							this.Toast({
								title: '其他登录方式'
							})
							return;
						}

						// 未开通
						if (err.code == 1000) {
							uni.showModal({
								title: '登录失败',
								content: `${err.errMsg}\n，错误码：${err.code}`,
								confirmText: '开通指南',
								cancelText: '确定',
								success: (res) => {
									if (res.confirm) {
										setTimeout(() => {
											plus.runtime.openWeb(
												'https://ask.dcloud.net.cn/article/37965'
											)
										}, 500)
									}
								}
							});
							return;
						}

						// 一键登录预登陆失败
						if (err.code == '30005') {
							uni.showModal({
								showCancel: false,
								title: '预登录失败',
								content: this.univerifyErrorMsg || err.errMsg
							});
							return;
						}

						// 一键登录用户关闭验证界面
						if (err.code != '30003') {
							uni.showModal({
								showCancel: false,
								title: '登录失败',
								content: JSON.stringify(err)
							});
						}
					},
					complete: () => {
						this.univerifyBtnLoading = false;
					}
				})
			},
			// 小程序获取用户信息
			getUserInfo(res) {
				uni.showLoading({
					title: '登录中...',
					mask: true
				})
				// 失败
				if (res.detail.errMsg !== 'getUserInfo:ok') {
					uni.hideLoading()
					return uni.showModal({
						title: '获取用户信息失败',
						content: '错误原因' + result.detail.errMsg,
						showCancel: false
					})
				}
				// 成功
				let userInfo = res.detail.userInfo
				uni.login({
					provider:'weixin',
					success(res){
						console.log(res)
						// 请求后端接口
						const params = {
							code: res.code,
							nickName: userInfo.nickName,
							avatarUrl:userInfo.avatarUrl
						}
					},
					complete() {
						uni.hideLoading()
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.other-login {
		.login-method {
			padding-top: 30rpx;

			.method-img {
				width: 80rpx;
				height: 80rpx;
			}
		}
		.login-wx {
			flex: 1;
			margin: 0 auto;
			width: 200rpx;
		}
	}
</style>
