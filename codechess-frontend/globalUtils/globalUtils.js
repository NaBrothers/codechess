
var rootUrl = "http://1.116.208.91/";
var loginUrl = "login/login.html";

export function httpRequest(url, params, callback, type="GET") {
    var token = localStorage.getItem('Authorization');
    if (token == null){
        var e = document.createEvent('MouseEvents'),
        a = document.createElement('a');
        a.href = loginUrl;
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
        return;
    }
    $.ajax({
        url: url,
        contentType: "application/json",
        headers: {
            Accept: "application/json",
            Authorization: token
        },
        data: JSON.stringify(params),
        type: type,
        success: callback,
    });
}