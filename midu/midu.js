// 赞赏:邀请码`A1040276307`
// 链接`http://html34.qukantoutiao.net/qpr2/bBmQ.html?pid=5eb14518`
// 农妇山泉 -> 有点咸

const cookieName = '米读'
const readTimebodyKey = 'senku_readTimebody_midu'
const signbodyKey = 'senku_signbody_midu'
const senku = init()
const signbodyVal = senku.getdata(signbodyKey)
const readTimebodyVal = senku.getdata(readTimebodyKey)
const readTimeurlVal = 'https://apiwz.midukanshu.com/user/readTimeBase/readTime?' + readTimebodyVal
const signurlVal = 'https://apiwz.midukanshu.com/wz/task/signInV2?' + signbodyVal
const signinfo = {}
senku.log(`🍎bodyVal${readTimebodyVal}`)

    ; (sign = async () => {
        senku.log(`🔔 ${cookieName}`)
        //await readTime()
        await signDay()
        showmsg()
        senku.done()
    })().catch((e) => senku.log(`❌ ${cookieName} 签到失败: ${e}`), senku.done())




// 每日签到
function signDay() {
    return new Promise((resolve, reject) => {
        const url = { url: signurlVal, headers: {} }
        url.headers['Host'] = 'apiwz.midukanshu.com'
        url.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        url.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
        senku.post(url, (error, response, data) => {
            try {
                senku.log(`❕ ${cookieName} signDay - response: ${JSON.stringify(response)}`)
                signinfo.signDay = JSON.parse(data)
                resolve()
            } catch (e) {
                senku.msg(cookieName, `签到结果: 失败`, `说明: ${e}`)
                senku.log(`❌ ${cookieName} signDay - 签到失败: ${e}`)
                senku.log(`❌ ${cookieName} signDay - response: ${JSON.stringify(response)}`)
                resolve()
            }
        })
    })
}

// 阅读时长
function readTime() {
    return new Promise((resolve, reject) => {
        const url = { url: readTimeurlVal, headers: {}, body: {} }
        url.headers['Host'] = 'apiwz.midukanshu.com'
        url.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        url.headers['User-Agent'] = 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
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
                    if (readTotalMinute % 40 == 0) {
                        detail += ` 阅读时长${readTotalMinute}分钟\n`
                        senku.msg(cookieName, subTitle, detail)
                    }
                } else if (signinfo.readTime.code != 0) {
                    detail += `【阅读时长】错误代码${signinfo.readTime.code},错误信息${signinfo.readTime.message}\n`
                    senku.msg(cookieName, subTitle, detail)
                } else {
                    detail += '【阅读时长】失败\n'
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

function showmsg() {
    let subTitle = ''
    let detail = ''
    if (signinfo.signDay && signinfo.signDay.code == 0) {
        if (signinfo.signDay.data) {
            const amount = signinfo.signDay.data.amount
            const sign_video_amount = signinfo.signDay.sign_video_amount
            const total = amount + sign_video_amount
            amount == 0 ? subTitle += `签到:重复` : detail += `【签到奖励】获得${total}💰\n`
        }
    } else subTitle += '签到:失败'
    senku.msg(cookieName, subTitle, detail)
    senku.done()
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
