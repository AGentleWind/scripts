// 赞赏:邀请码`A1040276307`
// 链接`http://html34.qukantoutiao.net/qpr2/bBmQ.html?pid=5eb14518`
// 农妇山泉 -> 有点咸

const cookieName = '米读阅读时长'
const readTimebodyKey = 'senku_readTimebody_midu'
// 账号一
const signbodyKey = 'senku_signbody_midu'
// 账号二
const signbodyKey2 = 'senku_signbody_midu2'
const tokenKey = 'tokenMidu'
const tokenKey2 = 'tokenMidu2'

const senku = init()
const readTimebodyVal = senku.getdata(readTimebodyKey)
const token = senku.getdata(tokenKey)
const token2 = senku.getdata(tokenKey2)
const readTimeurlVal = 'https://apiwz.midukanshu.com/user/readTimeBase/readTime?' + readTimebodyVal
const signinfo = {}
    ; (sign = async () => {
        senku.log(`🔔 ${cookieName}`)
        if (token) {
            await readTime(token, '账号一')
        }
        if (token2) {
            await readTime(token2, '账号二')
        }
        senku.done()
    })().catch((e) => senku.log(`❌ ${cookieName} 签到失败: ${e}`), senku.done())


// 阅读时长
function readTime(tkPara, account) {
    return new Promise((resolve, reject) => {
        const url = { url: readTimeurlVal, headers: {} }
        url.headers['token'] = tkPara
        url.headers['Host'] = 'apiwz.midukanshu.com'
        url.headers['Content-Type'] = 'application/x-www-form-urlencoded ;charset=utf-8'
        url.headers['User-Agent'] = 'MRSpeedNovel/0423.1424 CFNetwork/1125.2 Darwin/19.5.0'
        senku.post(url, (error, response, data) => {
            try {
                senku.log(`❕ ${cookieName} readTime - response: ${JSON.stringify(response)}`)
                signinfo.readTime = JSON.parse(data)
                let subTitle = ''
                let detail = ''
                if (signinfo.readTime && signinfo.readTime.code == 0) {
                    const coin = signinfo.readTime.data.coin
                    const readTotalMinute = signinfo.readTime.data.readTotalMinute
                    coin == 0 ? detail += `` : detail += `【阅读时长】获得${coin}💰`
                    if (readTotalMinute % 20 == 0) {
                        readTotalMinute ? detail += ` 阅读时长${readTotalMinute / 2}分钟\n` : detail += ``
                        senku.msg(cookieName, account + subTitle, detail)
                    }
                } else if (signinfo.readTime.code != 0) {
                    detail += `【阅读时长】错误代码${signinfo.readTime.code},错误信息${signinfo.readTime.message}\n`
                    senku.msg(cookieName, account + subTitle, detail)
                } else {
                    detail += '【阅读时长】失败\n'
                    senku.msg(cookieName, account + subTitle, detail)
                }
                resolve()
            } catch (e) {
                senku.msg(cookieName, account + `阅读时长: 失败`, `说明: ${e}`)
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
    return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
