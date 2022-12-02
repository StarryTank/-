<template>
	<!-- 首页/搜索页 -->
	<view class="search wrap-card">
		<!-- 小程序导航栏 -->
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar placeholder autoBack>
			<view slot="center" class="nav-center">
				<u-search placeholder="请输入内容" @click="search()" disabled></u-search>
			</view>
		</u-navbar>
		<!-- #endif -->
		<template v-if="list.length === 0">
			<view class="flex items-center">
				<text class="text-30">搜索历史</text>
				<u--text v-if="records.length > 0" prefixIcon="trash" align="right" iconStyle="font-size: 19px"
					text="清空" @click="delRecord('all')"></u--text>
			</view>
			<view class="flex flex-wrap mt-20">
				<view class="mr-20 my-10 p-10 border rounded text-24 text-gray-500 relative"
					v-for="(item,index) in records" :key="index" @longpress="editState(index)">
					<text>{{item.name}}</text>
					<u-icon v-if="item.edit" class="close-tag" name="close-circle" @click="delRecord('single',index)">
					</u-icon>
				</view>
			</view>
		</template>
		<!-- 资讯列表 -->
		<template v-if="type === 'info'">
			<info-list :item="item" v-for="(item,index) in list" :key="index">
			</info-list>
		</template>
		<!-- 话题列表 -->
		<template v-else-if="type === 'topic'">
			<topic-list :item="item" v-for="(item,index) in list" :key="index">
			</topic-list>
		</template>
		<!-- 用户列表 -->
		<template v-else-if="type === 'user'">
			<friend-list :item="item" v-for="(item,index) in list" :key="index">
			</friend-list>
		</template>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		searchList,
		newsList,
		friendList,
		topicList
	} from "@/utils/data/data.js"
	import InfoList from "@/pages/home/cpns/info-list.vue"
	import TopicList from "@/pages/news/cpns/topic-list.vue"
	import FriendList from "@/pages/paper/cpns/friend-list.vue"

	export default {
		components: {
			InfoList,
			TopicList,
			FriendList
		},
		data() {
			return {
				type: '', // user:用户 news:动态 topic:话题
				keyword: '',
				records: searchList,
				list: [],
			}
		},
		// 监听原生标题栏按钮点击事件
		onNavigationBarButtonTap(e) {
			if (e.index == 0) {
				this.search()
			}
		},
		// 监听原生标题栏搜索输入框输入内容变化事件
		onNavigationBarSearchInputChanged(e) {
			this.keyword = e.text
		},
		// 监听原生标题栏搜索输入框搜索事件，用户点击软键盘上的“搜索”按钮时触发
		onNavigationBarSearchInputConfirmed() {
			this.search()
		},
		onLoad(e) {
			this.type = e.type
			// #ifdef APP-PLUS
			this.editNavPlaceholder()
			// #endif
		},
		methods: {
			// 搜索
			search() {
				// 数据校验
				if (this.keyword === '') {
					return this.$refs.uToast.show({
						type: 'error',
						message: '请输入搜索内容'
					})
				}
				// 收起键盘
				uni.hideKeyboard()
				// 加载中
				uni.showLoading({
					title: '加载中',
				})
				setTimeout(() => {
					uni.hideLoading()
					switch (this.type) {
						case 'user':
							this.list = friendList[0].list
							break
						case 'info':
							this.list = newsList[0].list
							break
						case 'topic':
							this.list = topicList[0].list
							break
					}
				}, 1000)
			},
			// 删除记录
			delRecord(type, index = 0) {
				if (type === 'all') return this.records = []
				else return this.records.splice(index, 1)
			},
			// 编辑状态
			editState(index) {
				this.records[index].edit = this.records[index].edit ? !this.records[index].edit : true
			},
			// 修改导航栏输入框占位符
			editNavPlaceholder() {
				// 修改原生导航栏：搜索框占位符
				let pageTitle = '请输入内容'
				switch (this.type) {
					case 'user':
						pageTitle = '请输入昵称'
						break
					case 'info':
						pageTitle = '请输入新鲜事'
						break
					case 'topic':
						pageTitle = '请输入话题'
						break
				}
				const currentWebview = this.$mp.page.$getAppWebview() // 获取当前窗口对象实例
				const tn = currentWebview.getStyle().titleNView // 获取原生导航栏
				tn.searchInput.placeholder = pageTitle // 设置占位符
				currentWebview.setStyle({
					titleNView: tn
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #fff;
	}

	.search {

		// 小程序导航栏
		/* #ifdef MP-WEIXIN */
		/deep/ .u-navbar {

			.u-navbar__content {
				margin-right: 180rpx !important; // 胶囊按钮
			}

			.nav-center {
				width: 100%;
				margin-left: 80rpx; // 返回按钮
			}
		}

		/* #endif */

		.close-tag {
			position: absolute;
			top: -15rpx;
			right: -5px;
		}
	}
</style>
