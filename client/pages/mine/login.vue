<template>
	<!-- 我的/登录 -->
	<view class="login">
		<!-- 登录logo：猫头鹰蒙眼睛 -->
		<blindfold :show.sync="showEye"></blindfold>
		<!-- 登录表单 -->
		<view class="login-form wrap-card">
			<u--input :placeholder="loginType === '1' ? '请输入昵称/手机号/邮箱' : '请输入手机号'" border="bottom"
				v-model="form.username" placeholderStyle="{color:'#808080'}" :customStyle="{height:'80rpx'}" clearable>
			</u--input>
			<!-- 密码登录 -->
			<u-input v-if="loginType === '1'" type="password" placeholder="请输入密码" border="bottom"
				v-model="form.password" placeholderStyle="{color:'#808080'}" :customStyle="{height:'80rpx'}" clearable
				@focus="hideEye(true)" @blur="hideEye(false)">
				<template slot="suffix">
					<text class="text-gray-400">
						忘记密码
					</text>
				</template>
			</u-input>
			<!-- 验证码登录 -->
			<u-input v-if="loginType === '2'" type="password" placeholder="请输入验证码" border="bottom" v-model="form.code"
				placeholderStyle="{color:'#808080'}" :customStyle="{height:'80rpx'}" clearable @focus="hideEye(true)"
				@blur="hideEye(false)">
				<template slot="suffix">
					<u-code ref="uCode" @change="codeChange" seconds="20" changeText="X秒后重新获取" keepRunning
						uniqueKey="login-form"></u-code>
					<u-button @tap="getCode" :text="tips" type="success"></u-button>
				</template>
			</u-input>
		</view>
		<!-- 登录按钮 -->
		<u-button :customStyle="btnStyle" :ripple="true" shape="circle" @click="submit()">登录
		</u-button>
		<!-- 登录切换 -->
		<view class="flex justify-center items-center mt-50 text-green-400">
			<view class="" @click="changeType()">
				{{loginType === '1' ? '验证码登录' : '密码登录'}}
			</view>
			<view class="mx-20">
				<u-line length="20rpx" color="#d6d7d9" direction="col"></u-line>
			</view>
			<view class="" @click="register()">
				注册
			</view>
		</view>
		<!-- 社交账号登录 -->
		<other-login class="px-50"></other-login>
		<!-- 协议 -->
		<view class="text-center fixed bottom-0 left-0 right-0 mb-20">
			<text class="text-gray-400">注册即代表您同意</text><text
				class="text-green-400 underline underline-offset-2">《分享社区协议》</text>
		</view>
	</view>
</template>

<script>
	//import request from '../../api/request.js';
	export default {
		data() {
			return {
				loginType: '1', // 1:密码 2:验证码
				tips: '',
				showEye: false,
				form: {
					username: '',
					password: '',
					code: ''
				},
				btnStyle: {
					width: "90%",
					height: "100rpx",
					marginTop: '50rpx',
					background: "linear-gradient(-45deg,#01906c,#34D399)",
					color: "#FFFFFF",
					fontSize: "30rpx",
				},
				isadmit:false
			}
		},
		methods: {
			// 隐藏眼睛
			hideEye(type) {
				this.showEye = type
			},
			// 切换类型
			changeType() {
				this.loginType = this.loginType === '1' ? '2' : '1'
			},
			// 验证码改变
			codeChange(text) {
				this.tips = text
			},
			// 获取验证码
			getCode() {
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在发送验证码'
					})
					setTimeout(() => {
						uni.hideLoading();
						// 这里此提示会被this.start()方法中的提示覆盖
						uni.$u.toast('验证码已发送')
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start()
					}, 2000)
				} else {
					uni.$u.toast('请倒计时结束后再发送')
				}
			},
			// 提交登录
			submit() {
				console.log(1)
				/*this.$u.router({
					type: 'switchTab',
					url: '/pages/home/home'
				})*/
			uni.request({
				header: {
					'content-type': 'application/x-www-form-urlencoded', 
				},
				url:"http://192.168.31.135:9090/user/login",
				method:'POST',
				data:{
					"user_name":this.form.username,
					"user_password":this.form.password
				},
				success:(res)=>{
					console.log(res.data);
					if(res.data.reply=="success"){
						this.isadmit=true;
					}else{
						this.isadmit=false;
					}
				if(this.isadmit==true){
				uni.showModal({
					title: '提示',
					content: '登录成功',
					}
					);
					uni.setStorage({
						key:"userN",
						data:this.form.username,
						isLogged:true
					});
					uni.switchTab({
							url: '/pages/mine/mine'
						});					
				}else{
				uni.showModal({
					title: '提示',
					content: '登录失败，请修改用户名或密码',
					
					});
				}					
				}
			})
			},
			register(){
			uni.request({
				header: {
					'content-type': 'application/x-www-form-urlencoded', 
				},
				url:"http://192.168.31.135:9090/user/register",
				method:'POST',
				data:{
					"user_name":this.form.username,
					"user_password":this.form.password
				},
				success:(res)=>{
					console.log(res.data);
					if(res.data.reply=="error"){
					uni.showModal({
						title: '提示',
						content: '注册失败，请修改用户名或密码',
						
						});
					}
					if(res.data.reply=="success"){
					uni.showModal({
						title: '提示',
						content: '注册成功，请登录',
					});
					}
				}
			})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login {
		padding-top: 150rpx;

		.login-form {}

	}
</style>
