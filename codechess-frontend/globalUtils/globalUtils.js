
var rootUrl = "http://1.116.208.91/";
var loginUrl = "login/login.html";

export {rootUrl, loginUrl};

export function httpRequest(url, params, callback, type="GET") {
    $.ajax({
        url: rootUrl+url,
        contentType: "application/json",
        headers: {
            Accept: "application/json"
        },
        data: JSON.stringify(params),
        type: type,
        xhrFields: {
            withCredentials: true,
        },
        crossDomain: true,
        success: callback,
    });
}