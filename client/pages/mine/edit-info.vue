<template>
	<!-- 我的/设置/修改资料 -->
	<view class="edit-info wrap-card">
		<u-cell-group :border='false'>
			<u-cell title="头像" size="large" :border='false' :titleStyle="{fontSize:'32rpx',color:'#9CA3AF'}"
				@click="handleHeader">
				<image slot="value" class="header-img" :src="form.avatar" mode="aspectFill"></image>
				<u-icon slot="right-icon" name="edit-pen" size="30" color="#9CA3AF"></u-icon>
			</u-cell>
			<u-cell title="用户名" size="large" :border='false' :titleStyle="{fontSize:'32rpx',color:'#9CA3AF'}"
				@click="handleName()">
				<view slot="value">
					{{userInformation.user_name}}
				</view>
				<u-icon slot="right-icon" name="edit-pen" size="30" color="#9CA3AF"></u-icon>
			</u-cell>
			<u-cell title="性别" size="large" :border='false' :titleStyle="{fontSize:'32rpx',color:'#9CA3AF'}"
				@click="handleSex">
				<view slot="value">
					{{sexList[form.sex]}}
				</view>
				<u-icon slot="right-icon" name="edit-pen" size="30" color="#9CA3AF"></u-icon>
			</u-cell>
			<u-cell title="年龄" size="large" :border='false' :titleStyle="{fontSize:'32rpx',color:'#9CA3AF'}"
				@click="handleAge()">
				<view slot="value">
					{{userInformation.user_age}}
				</view>
				<u-icon slot="right-icon" name="edit-pen" size="30" color="#9CA3AF"></u-icon>
			</u-cell>
			<u-cell title="电话" size="large" :border='false' :titleStyle="{fontSize:'32rpx',color:'#9CA3AF'}"
				@click="handlePhone()">
				<view slot="value">
					{{userInformation.user_phone}}
				</view>
				<u-icon slot="right-icon" name="edit-pen" size="30" color="#9CA3AF"></u-icon>
			</u-cell>
			<u-cell title="级别" size="large" :border='false' :titleStyle="{fontSize:'32rpx',color:'#9CA3AF'}"
				>
				<view slot="value">
					{{this.userInformation.user_level}}
				</view>
			</u-cell>
			<u-cell title="访问公共聊天室" size="large" :border='false' :titleStyle="{fontSize:'32rpx',color:'#9CA3AF'}"
			>
				<view slot="value">
					{{userInformation.isvisit}}
				</view>
			</u-cell>
		</u-cell-group>
		<!-- 底部操作 -->
		<view class="wrap-bottom-bar">
			<view class="bar-placeholder"></view>
			<view class="bar-content">
				<u-button :customStyle="btnStyle" :ripple="true" shape="circle" @click="submit">完成</u-button>
			</view>
		</view>
		<!-- 昵称 -->
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose" mode="input" title="输入昵称" :value="userInformation.user_name" placeholder="请输入内容"
				@confirm="nameConfirm"></uni-popup-dialog>
		</uni-popup>
		<!--年龄 -->
		<uni-popup ref="inputAge" type="dialog">
			<uni-popup-dialog ref="inputClose" mode="input" title="输入年龄" :value="userInformation.user_age" placeholder="请输入内容"
				@confirm="ageConfirm"></uni-popup-dialog>
		</uni-popup>
		<!--电话号码 -->
		<uni-popup ref="inputPhone" type="dialog">
			<uni-popup-dialog ref="inputClose" mode="input" title="输入电话号码" :value="userInformation.user_phone" placeholder="请输入内容"
				@confirm="phoneConfirm"></uni-popup-dialog>
		</uni-popup>
		<!-- 城市选择 -->
		<city-picker themeColor="#007AFF" ref="cityPicker" :pickerValueDefault="cityDefault" @onConfirm="confirmCity">
		</city-picker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					avatar: '/static/img/header/a.svg',
					username: 'MrThinco',
					sex: 0,
					emotion: 1,
					job: 0,
					birth: '2020-10-10',
					city: '四川成都'
				},
				sexList: ['男', '女', '保密'],
				emoList: ['未婚', '已婚', '离异', '保密'],
				jobList: ['软件工程师', '维修工程师', '运维工程师', '测试工程师'],
				cityDefault: [0, 0, 1],
				// 按钮配置
				btnStyle: {
					width: "90%",
					height: "75rpx",
					background: "linear-gradient(-45deg,#01906c,#34D399)",
					color: "#FFFFFF",
					fontSize: "30rpx",
				},
				userInformation:''
			}
		},
		onShow(){
			//this.userInformation = uni.getStorage('userInformation');
			var that = this
			uni.getStorage({
				key:"userInformation",
				success:function(res){
					console.log(res.data)
					that.userInformation=res.data
			if(that.userInformation.user_permission.can_visit_public_chatroom==true)
			{
				that.userInformation.isvisit='是'
			}else{
				that.userInformation.isvisit='否'
			}
				}
			})
		},
		methods: {
			// 修改头像
			handleHeader() {
				// 选择图片
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: function(res) {
						this.form.avatar = res.tempFilePaths[0]
					}
				})
			},
			// 修改昵称
			handleName() {
				this.$refs.inputDialog.open()
			},
			nameConfirm(val) {
				this.userInformation.user_name = val
			},
			ageConfirm(val) {
				this.userInformation.user_age = val
			},
			phoneConfirm(val) {
				this.userInformation.user_phone = val
			},
			// 修改性别
			handleSex() {
				const _this = this
				uni.showActionSheet({
					itemList: this.sexList,
					success: function(res) {
						_this.form.sex = res.tapIndex
					},
					fail: function(res) {
						console.log(res.errMsg);
					}
				})
			},
			// 修改年龄
			handleAge() {
				this.$refs.inputAge.open()
			},
			//修改电话
			handlePhone(){
				this.$refs.inputPhone.open()
			},
			// 修改城市
			confirmCity(e) {
				console.log('e', e)
				this.form.city = e.label
			},
			showCity() {
				this.$refs.cityPicker.show()
			},
			// 提交
			submit() {
				console.log(this.userInformation.user_name)
				uni.setStorage({
					key:"userInformation",
					data:this.userInformation
				})
				uni.request({
					header: {
						'content-type': 'application/x-www-form-urlencoded', 
					},
					url:"http://192.168.31.135:9090/user/updateInformation",
					method:'POST',
					data:{
						"user_id":this.userInformation.user_id,
						"update":JSON.stringify({
							"user_name":this.userInformation.user_name,
							"user_age":this.userInformation.user_age,
							"user_phone":this.userInformation.user_phone
						})
					},
					success:(res)=>{
						console.log(res)
						//console.log(data)
					}
					})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.edit-info {
		.header-img {
			width: 100rpx;
			height: 100rpx;
			border-radius: 100%;
			margin-right: 10rpx;
		}
	}
</style>
