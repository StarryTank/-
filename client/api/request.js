export default function(options) {
	var baseUrl = "http://192.168.31.135:9090"
	// var baseUrl ="http://www.yemengs.cn"
	console.log(baseUrl + options.url)
	return uni.request({
		url: baseUrl + options.url,
		data: options.data || {},
		method: options.method || "GET"
	})
}
