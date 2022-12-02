<template>
	<!-- 首页/发布页 -->
	<view class="release">
		<!-- 自定义导航栏 -->
		<u-navbar :autoBack="true" placeholder>
			<view slot="center">
				<view class="flex justify-center items-center text-30 w-100" @click="changeAction">
					{{actionCurrent}}
					<view class="iconfont iconxiala2"></view>
				</view>
			</view>
		</u-navbar>
		<view class="wrap-card">
			<!-- 文本域 -->
			<view class="text-gray-500 my-20">
				想说点啥
			</view>
			<u-textarea v-model="textContent" maxlength='100' height="100" placeholder="随便说点儿什么吧..." count
				confirmType="done">
			</u-textarea>
			<!-- 上传多图 -->
			<view class="text-gray-500 my-20">
				分享图片
			</view>
			<u-upload ref="upload" :fileList="imgList" @afterRead="handUpload" @delete="deletePic" name="1" multiple
				:maxCount="9" previewFullImage>
			</u-upload>
		</view>
		<!-- 底部操作栏 -->
		<view class="bottom-handle">
			<view class="iconfont iconcaidan text-50 mx-10 animate__animated" hover-class="animate__jello"></view>
			<view class="iconfont iconhuati text-50 mx-10 animate__animated" hover-class="animate__jello"></view>
			<view class="iconfont icontupian text-50 mx-10 animate__animated" hover-class="animate__jello"
				@click="handleBottom('upload')"></view>
				<view class="ml-auto mr-20">
					<u-button text="发布" color="linear-gradient(to right, #dcc20b, #01906c)"
						:customStyle="{width:'150rpx',height:'60rpx'}" @click="submit"></u-button>
				</view>
		</view>
		<!-- 中间弹出公告栏 -->
		<u-popup :show="popupShow" round="20" mode="center" :customStyle="{width:'80%'}">
			<view class="flex flex-col justify-center items-center m-20">
				<view class="flex justify-center items-center">
					<image class="notice-img" src="/static/img/demo/summer.svg" mode="widthFix"></image>
				</view>
				<view class="flex flex-col my-20">
					<view>严禁发表以下信息：</view>
					<view>1、散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的信息</view>
					<view>2、侮辱或者诽谤他人，侵害他人合法权益的信息</view>
					<view>3、煽动民族仇恨、民族歧视，破坏民族团结的信息</view>
				</view>
				<u-button :customStyle="btnStyle" :ripple="true" shape="circle" @click="closePopup">朕知道了</u-button>
			</view>
		</u-popup>
		<!-- 底部弹出操作菜单 -->
		<u-action-sheet :description="actionDesc" round="20" :actions="actionList" :show="actionShow"
			:safeAreaInsetBottom="true" cancelText="取消" @select="selectAction" @close="actionShow = false">
		</u-action-sheet>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				textContent: '',
				// 操作菜单
				actionCurrent: '所有人可见',
				actionDesc: '请设置您本条信息的访问权限',
				actionList: [{
						name: '所有人可见'
					},
					{
						name: '仅好友可见'
					},
					{
						name: '仅自己可见'
					},
				],
				actionShow: false,
				// 图片列表
				imgList: [{
						url: '/static/img/demo/autumn.svg',
					},
					{
						url: '/static/img/demo/winter.svg',
					}
				],
				// 弹窗公告
				popupShow: true,
				// 按钮配置
				btnStyle: {
					width: "450rpx",
					height: "75rpx",
					background: "linear-gradient(-45deg,#01906c,#34D399)",
					color: "#FFFFFF",
					fontSize: "30rpx"
				},
				// 草稿箱提示
				draftShow: true,
				form: {
					imgs: ''
				}
			}
		},
		// 监听返回按钮
		onBackPress() {
			// 如果有内容
			if ((this.textContent || this.imgList.length) && this.draftShow) {
				this.tipDraft()
				return true // 不执行默认返回
			}
		},
		onLoad() {
			uni.getStorage({
				key: 'releaseDraft',
				success: (res) => {
					const data = JSON.parse(res.data)
					this.textContent = data.textContent
					this.imgList = data.imgList
				}
			})
		},
		methods: {
			// 提示保存为草稿
			tipDraft() {
				uni.showModal({
					content: "是否要保存为草稿",
					cancelText: "不保存",
					confirmText: "保存",
					success: res => {
						// 确定
						if (res.confirm) this.saveDraft()
						// 取消
						else uni.removeStorage({
							key: 'releaseDraft'
						})
						this.draftShow = false
						uni.navigateBack()
					}
				})
			},
			// 保存草稿
			saveDraft() {
				uni.setStorage({
					key: 'releaseDraft',
					data: JSON.stringify({
						textContent: this.textContent,
						imgList: this.imgList
					})
				})
			},
			// 提交
			submit() {
				this.draftShow = false
				this.$u.route({
					type: 'navigateBack'
				})
			},
			// 选择访问
			changeAction() {
				this.actionShow = true
			},
			// 选中操作菜单
			selectAction(e) {
				this.actionCurrent = e.name
				this.actionShow = false
			},
			// 关闭公告
			closePopup() {
				this.popupShow = false
			},
			// 删除图片
			deletePic(event) {
				this.imgList.splice(event.index, 1)
			},
			// 自动上传
			async autoUpload(event) {
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let chooseList = [].concat(event.file) // 当前选中列表
				let fileListLen = this.imgList.length // 原始文件列表
				// 将选中的文件添加到文件列表
				chooseList.map((item) => {
					this.imgList.push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				// 遍历选中的文件依次上传
				for (let i = 0; i < chooseList.length; i++) {
					// 上传成功后返回数据
					const url = await this.uploadFilePromise(chooseList[i].url)
					// 获取当前文件信息：原始文件列表长度，就是当前新增开始的索引
					let item = this.imgList[fileListLen]
					// 改变最后一个文件信息：状态、url
					this.imgList.splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url
					}))
					// 文件索引后移一位
					fileListLen++
				}
			},
			// 手动上传
			async handUpload(event) {
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				let chooseList = [].concat(event.file) // 当前选中列表
				let fileListLen = this.imgList.length // 原始文件列表
				// 将选中的文件添加到文件列表
				chooseList.map((item) => {
					this.imgList.push({
						...item,
						status: '',
						message: ''
					})
				})
			},
			// 手动上传提交
			async handUploadSubmit() {
				if (!this.imgList.length) return uni.showToast({
					title: '请选择文件',
					icon: 'none'
				})
				let imgList = []
				for (let index of this.imgList) {
					let url = this.imgList[index].url
					// 上传本地文件
					if (url.startsWith('blob')) url = await this.uploadFilePromise(url)
					imgList[index] = url
				}
				this.form.imgs = imgList.join(',')
			},
			// 上传图片
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: 'http://192.168.2.21:7001/upload', // 仅为示例，非真实的接口地址
						filePath: url,
						name: 'file',
						formData: {
							user: 'test'
						},
						success: (res) => {
							setTimeout(() => {
								resolve(res.data.url)
							}, 1000)
						}
					})
				})
			},
			// 底部操作
			handleBottom(type) {
				switch (type) {
					case 'upload':
						this.$refs.upload.chooseFile()
						break
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.release {
		.notice-img {
			height: 300rpx;
			width: 300rpx;
		}

		.bottom-handle {
			border-top: 1px solid $uni-border-color1;
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			height: 85rpx;
			background-color: #fff;
			display: flex;
			align-items: center;
		}
	}
</style>
