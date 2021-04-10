import axios from 'axios'


export function request (config) {

  //1.创建axios的实例
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:7878/api/m5',
    timeout: 5000
  })
  //2.1请求拦截器
  //2.2拦截器
  instance.interceptors.request.use(res => {
    return res
  }, err => {
    // console.log(err)
  })
  //2.2响应拦截器
  instance.interceptors.response.use(res => {
    return res
  }, err => {
    // console.log(err)
  })

  //发送真正的网络请求
  return instance(config)   //instance 返回的是Promise,可以交给外部调用
}

