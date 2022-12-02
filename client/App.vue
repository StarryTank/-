<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			// 网络监听
			//this.$tool.getNetwork()
			//this.$tool.onNetwork()
			// #ifdef APP-PLUS
			// 检测更新
			// this.$tool.update()
			// 获取网络状态
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* 每个页面公共css */
	/* uViewUI */
	@import "@/uni_modules/uview-ui/index.scss";
	/* uni-ui库 */
	// @import '/static/css/uni.css';
	/* 图标库 */
	@import "/static/css/iconfont.css";
	/* 动画库 */
	@import "/static/css/animate.css";
	/* 样式库 */
	@import '/static/css/thinco.scss';

	/* #ifdef H5 */
	/* 针对h5页面取消返回按钮 */
	uni-page[data-page="pages/paper/friend"] .uni-page-head-hd {
		display: none;
	}

	/* #endif */
	// 隐藏小程序滚动条（无用）
	/* #ifdef MP-WEIXIN */
	::-webkit-scrollbar {
		display: none;
	}

	/* #endif */
</style>
