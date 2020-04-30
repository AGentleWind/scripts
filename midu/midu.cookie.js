const cookieName = '米读'

const readTimebodyKey = 'senku_readTimebody_midu'
// 账号一
const readTimeheaderKey = 'senku_readTimeheader_midu'
const signbodyKey = 'senku_signbody_midu'
// 账号二
const readTimeheaderKey2 = 'senku_readTimeheader_midu2'
const signbodyKey2 = 'senku_signbody_midu2'
const senku = init()

const requrl = $request.url

if ($request && $request.method != 'OPTIONS' && requrl.match(/\/user\/readTimeBase\/readTime/)) {
    try {

        const readTimebodyVal = $request.body
        const CookieValue = $request.headers
        const account = senku.getdata(readTimeheaderKey) ? senku.getdata(readTimeheaderKey)['token'] : null
        const account2 = senku.getdata(readTimeheaderKey2) ? senku.getdata(readTimeheaderKey2)['token'] : null
        if (!account) {
            var CookieName = '【账号一】'
            var CookieKey = 'senku_readTimeheader_midu'
        } else if (!account2) {
            var CookieName = '【账号二】'
            var CookieKey = 'senku_readTimeheader_midu2'
        } else {
            senku.msg("更新米读阅读Cookie失败", "非历史写入账号 ‼️", '')
        }

        if (senku.getdata(CookieKey)['token']) {
            if (senku.getdata(CookieKey)['token'] != CookieValue['token']) {
                var cookie = senku.setdata(CookieValue, CookieKey);
                if (!cookie) {
                    senku.msg("米读阅读", "", "更新" + CookieName + "Cookie失败 ‼️");
                } else {
                    senku.msg("米读阅读", "", "更新" + CookieName + "Cookie成功 🎉");
                }
            }
        } else {
            var cookie = senku.setdata(CookieValue, CookieKey);
            if (!cookie) {
                senku.msg("米读阅读", "", "首次写入" + CookieName + "Cookie失败 ‼️");
            } else {
                senku.msg("米读阅读", "", "首次写入" + CookieName + "Cookie成功 🎉");
            }
        }

        if (readTimebodyVal) {
            if (readTimebodyVal.indexOf('EncStr=') > 0) {
                senku.setdata(readTimebodyVal, readTimebodyKey)
                senku.setdata(readTimeheaderVal, readTimeheaderKey)
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
        const signbodyVal = $request.body
        if (signbodyVal) {
            senku.setdata(signbodyVal, signbodyKey)
            senku.msg(cookieName, `签到,获取Cookie: 成功`, ``)
            senku.log(`🔔${signbodyVal}`)
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
