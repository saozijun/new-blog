import axios from 'axios';
import { errorCodeType } from '../utils/error-code-type';
// 创建axios实例
const service = axios.create({
    // 服务接口请求
    baseURL: 'https://www.saozijun.top',
    // 超时设置
    // timeout: 15000,
    withCredentials: true,
    headers:{
        'Content-Type':'application/json;charset=utf-8'
    }
})
 
// 请求拦截
service.interceptors.request.use(config => {
    if (config.method === 'get' && config.params) {
        let url = config.url + '?';
        for (const propName of Object.keys(config.params)) {
            const value = config.params[propName];
            var part = encodeURIComponent(propName) + "=";
            if (value !== null && typeof(value) !== "undefined") {
                 // 对象处理
                if (typeof value === 'object') {
                    for (const key of Object.keys(value)) {
                        let params = propName + '[' + key + ']';
                        var subPart = encodeURIComponent(params) + "=";
                        url += subPart + encodeURIComponent(value[key]) + "&";
                    }
                } else {
                    url += part + encodeURIComponent(value) + "&";
                }
            }
        }
        url = url.slice(0, -1);
        config.params = {};
        config.url = url;
    }
    return config
}, error => {
    console.log(error)
    Promise.reject(error)
})
 
// 响应拦截器
service.interceptors.response.use((res:any) => {
        // 未设置状态码则默认成功状态
        const code = res.data['code'] || 200;
        // 获取错误信息
        const msg = errorCodeType(code) || res.data['msg'] || errorCodeType('default')
        if(code === 200  || 800 || 801 || 802 || 803){
            return Promise.resolve(res.data)
        }else{
            return Promise.reject(res.data)
        }
    },
    error => {
        // console.log('err' + error)
        let { message } = error;
        if (message == "Network Error") {
            message = "后端接口连接异常";
        }
        else if (message.includes("timeout")) {
            message = "系统接口请求超时";
        }
        else if (message.includes("Request failed with status code")) {
            message = "系统接口" + message.substr(message.length - 3) + "异常";
        }
        return Promise.reject(error)
    }
)
 
export default service;