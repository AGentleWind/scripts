// 赞赏:邀请码`A1040276307`
// 链接`http://html34.qukantoutiao.net/qpr2/bBmQ.html?pid=5eb14518`
// 农妇山泉 -> 有点咸
// 本脚本用作曲线双阅读,结合APP:py3使用
// 1、登陆要阅读的账号一、二、三.....,理论无限
// 2、Surge抓包记录找到https://apiwz.midukanshu.com/user/readTimeBase/readTime该记录标记收藏
// 3、从收藏记录中选择该记录导出,使用pythonista3运行midu.py
// 4、在Surge->脚本->新增, 脚本名:自定义不要重复就好, 脚本类型选择Cron, cron表达式: */1 * * * *  脚本位置->本地
// 5、编辑脚本:贴贴py3的结果,换行然后复制本脚本内容
const cookieName = '米读阅读时长'
const signinfo = {}
const senku = init()
// 开启debug模式,每次脚本执行会显示通知,默认false
const debug = true


debug ? senku.setdata('true', 'debug') : senku.setdata('false', 'debug')

;
(sign = async () => {
    senku.log(`🔔 ${cookieName}`)
    await readTime()
    senku.done()
})().catch((e) => senku.log(`❌ ${cookieName} 签到失败: ${e}`), senku.done())


// 阅读时长
function readTime() {
    return new Promise((resolve, reject) => {
        senku.post(request, (error, response, data) => {
            try {
                senku.log(`❕ ${cookieName} readTime - response: ${JSON.stringify(response)}`)
                signinfo.readTime = JSON.parse(data)
                let subTitle = ''
                let detail = ''
                if (signinfo.readTime && signinfo.readTime.code == 0) {
                    const coin = signinfo.readTime.data.coin
                    const readTotalMinute = signinfo.readTime.data.readTotalMinute
                    const total_coin = signinfo.readTime.data.total_coin
                    coin == 0 ? detail += `` : detail += `【阅读时长】获得${coin}💰`
                    if (readTotalMinute % 20 == 0) {
                        readTotalMinute ? detail += ` 阅读时长${readTotalMinute / 2}分钟,该账户:${total_coin}💰` : detail += `该账户:${total_coin}💰`
                        senku.msg(cookieName, subTitle, detail)
                    } else if (senku.getdata('debug') == 'true') {
                        readTotalMinute ? detail += ` 阅读时长${readTotalMinute / 2}分钟,该账户:${total_coin}💰` : detail += `该账户:${total_coin}💰`
                        senku.msg(cookieName, subTitle, detail)
                    }
                } else if (signinfo.readTime.code != 0) {
                    detail += `【阅读时长】错误代码${signinfo.readTime.code},错误信息${signinfo.readTime.message}`
                    senku.msg(cookieName, subTitle, detail)
                } else {
                    detail += '【阅读时长】失败'
                    senku.msg(cookieName, subTitle, detail)
                }
                resolve()
            } catch (e) {
                senku.msg(cookieName, `阅读时长: 失败`, `说明: ${e}`)
                senku.log(`❌ ${cookieName} readTime - 签到失败: ${e}`)
                senku.log(`❌ ${cookieName} readTime - response: ${JSON.stringify(response)}`)
                resolve()
            }
        })
    })
}


function init() {
    isSurge = () => {
        return undefined === this.$httpClient ? false : true
    }
    isQuanX = () => {
        return undefined === this.$task ? false : true
    }
    getdata = (key) => {
        if (isSurge()) return $persistentStore.read(key)
        if (isQuanX()) return $prefs.valueForKey(key)
    }
    setdata = (key, val) => {
        if (isSurge()) return $persistentStore.write(key, val)
        if (isQuanX()) return $prefs.setValueForKey(key, val)
    }
    msg = (title, subtitle, body) => {
        if (isSurge()) $notification.post(title, subtitle, body)
        if (isQuanX()) $notify(title, subtitle, body)
    }
    log = (message) => console.log(message)
    get = (url, cb) => {
        if (isSurge()) {
            $httpClient.get(url, cb)
        }
        if (isQuanX()) {
            url.method = 'GET'
            $task.fetch(url).then((resp) => cb(null, resp, resp.body))
        }
    }
    post = (url, cb) => {
        if (isSurge()) {
            $httpClient.post(url, cb)
        }
        if (isQuanX()) {
            url.method = 'POST'
            $task.fetch(url).then((resp) => cb(null, resp, resp.body))
        }
    }
    done = (value = {}) => {
        $done(value)
    }
    return {
        isSurge,
        isQuanX,
        msg,
        log,
        getdata,
        setdata,
        get,
        post,
        done
    }
}