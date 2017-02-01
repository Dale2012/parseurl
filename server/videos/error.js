
var Error = {
	msg_url_not_right:'URL地址不正确',
	msg_can_not_get_source:'无法获取源代码',
	msg_can_not_get_keyword:'无法获取关键字',
	msg_service_not_availiable:'服务暂时不可用',
	msg_sohu_not_started : '搜狐服务未启动',
	msg_net_problem 	:	'服务器无法连接网络',
	msg_ed2k_not_availiable : '该链接第一次出现在服务器，无法立即观看。',
	msg_json_package_error:'传入的json数据不正确'
}

var ErrorCode = {
	msg_url_not_right:'3000',
	msg_can_not_get_source:'3001',
	msg_can_not_get_keyword:'3002',
	msg_service_not_availiable :'3003',
	msg_sohu_not_started : '3004',
	msg_net_problem : '3005',
	msg_ed2k_not_availiable:'3006',
	msg_json_package_error:'3007'
}

exports.errorMsg = Error;
exports.errorCode = ErrorCode;