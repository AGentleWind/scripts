const readTimebodyKey = 'senku_readTimebody_midu'
// 账号一
const signbodyKey = 'senku_signbody_midu'
// 账号二
const signbodyKey2 = 'senku_signbody_midu2'
const senku = init()
const DeleteCookie = false
const requrl = $request.url

if (DeleteCookie) {
    if (senku.getdata(signbodyKey)) {
        senku.setdata("", "senku_signbody_midu")
        senku.setdata("", "senku_signbody_midu2")
        senku.setdata("", "tokenMidu")
        senku.setdata("", "tokenMidu2")
        senku.msg("米读Cookie清除成功 !", "", '请手动关闭脚本内"DeleteCookie"选项')
    } else {
        senku.msg("米读->签到无可清除的Cookie !", "", '请手动关闭脚本内"DeleteCookie"选项')
    }
}
if ($request && $request.method != 'OPTIONS' && requrl.match(/\/user\/readTimeBase\/readTime/)) {
    try {
        const readTimebodyVal = $request.body
        if (readTimebodyVal) {
            if (readTimebodyVal.indexOf('EncStr=') > 0) {
                senku.setdata(readTimebodyVal, readTimebodyKey)
                senku.msg(cookieName, `阅读时长,获取Cookie: 成功`, ``)
                senku.log(`🔔${readTimeheaderVal}`)
            }
        }
    } catch (error) {
        senku.log(`❌error:${error}`)
    }
}

if ($request && $request.method != 'OPTIONS' && requrl.match(/\/wz\/task\/listV2/)) {
    try {
        const CookieValue = $request.body
        const account = senku.getdata(signbodyKey) ? senku.getdata(signbodyKey).match(/token=[a-zA-Z0-9._-]+/)[0] : null
        const account2 = senku.getdata(signbodyKey) ? senku.getdata(signbodyKey).match(/token=[a-zA-Z0-9._-]+/)[0] : null
        const tokenVal = CookieValue.match(/token=[a-zA-Z0-9._-]+/)[0]
        if (!account || tokenVal == account) {
            var CookieName = '【账号一】'
            var CookieKey = 'senku_signbody_midu'
            var tokenKey = 'tokenMidu'
        } else if (!account2 || tokenVal == account2) {
            var CookieName = '【账号二】'
            var CookieKey = 'senku_signbody_midu2'
            var tokenKey = 'tokenMidu2'
        } else {
            senku.msg("米读", "更新米读->签到Cookie失败", '非历史写入账号 ‼️')
        }
        senku.log(`🍎${senku.getdata(tokenKey)}`)
        if (senku.getdata(tokenKey)) {
            if (senku.getdata(tokenKey) != tokenVal) {
                var token = senku.setdata(tokenVal.substring(6, tokenVal.length), tokenKey)
                var body = senku.setdata(CookieValue, CookieKey)
                senku.log(`🍎${tokenVal}`)
                if (!body && !token) {
                    senku.msg("米读", "签到", "更新" + CookieName + "Cookie失败 ‼️")
                } else {
                    senku.msg("米读", "签到", "更新" + CookieName + "Cookie成功 🎉")
                }
            }
        } else {
            var token = senku.setdata(tokenVal.substring(6, tokenVal.length), tokenKey)
            var body = senku.setdata(CookieValue, CookieKey)
            senku.log(`🍎${tokenVal}`)
            if (!body && !token) {
                senku.msg("米读", "签到", "首次写入" + CookieName + "Cookie失败 ‼️")
            } else {
                senku.msg("米读", "签到", "首次写入" + CookieName + "Cookie成功 🎉")
            }
        }
    } catch (error) {
        senku.log(`❌error:${error}`)
    }
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
            $task.fetch(url).then((resp) => cb(null, {}, resp.body))
        }
    }
    post = (url, cb) => {
        if (isSurge()) {
            $httpClient.post(url, cb)
        }
        if (isQuanX()) {
            url.method = 'POST'
            $task.fetch(url).then((resp) => cb(null, {}, resp.body))
        }
    }
    done = (value = {}) => {
        $done(value)
    }
    return { isSurge, isQuanX, msg, log, getdata, setdata, get, post, done }
}
senku.done()
