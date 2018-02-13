var plugdata = null,
query = [];
window.addEventListener("message", function(a) {
if (a.data != undefined) {
    plugdata = a.data;
    if (plugdata.Action != undefined)
        if (plugdata.Action == "GETCOOKIE") chrome.extension.sendRequest(plugdata, function() {});
        else if (plugdata.Action != "VERSION") {
        if (plugdata.background == undefined || plugdata.background == false) $("#divDetail").html("<br/><center>notifications with some message.</center>");
        chrome.extension.sendRequest(plugdata, function() {})
    }
}
});

chrome.extension.onRequest.addListener(function(a, b, c) {
switch (a.Action) {
    case "FAREResult":
    case "ONRESULT":
        typeof a.Data.Data === "string" ? $("#IRData").val(a.Data.Data) : $("#IRData").val(JSON.stringify(a.Data.Data));
        $("#Message").html(a.Data.Message);
        $("#Command").html(a.Data.Action);
        break;
}
c({})
});

function PerformAction() {
if (plugdata != null) {
    var a = plugdata.Action;
    switch (plugdata.Method) {
        case "POST":
            $.post(plugdata.URL, plugdata.post, function(b) {
                if (plugdata.SetBodyText == true) try {
                    $("body").html(b)
                } catch (c) {}
                chrome.extension.sendRequest({
                    Action: "ONRESULT",
                    Data: {
                        Action: a,
                        Data: b
                    }
                }, function() {
                    plugdata = null
                })
            }).error(function() {
                chrome.extension.sendRequest({
                    Action: "ONRESULT",
                    Data: {
                        Action: a,
                        Data: "Error"
                    }
                }, function() {})
            });
            break;
        case "GET":
            plugdata.Data = document.body.innerHTML;
            chrome.extension.sendRequest({
                Action: "ONRESULT",
                Data: plugdata
            });
            plugdata.Action = ""
    }
}
}

$(document).ready(function() {

    if (location.href.indexOf("?") > 0) {
        var a = location.href.split("?")[1].split("&");
        $(a).each(function() {
            var b = this.split("=");
            query[b[0]] = b[1]
        })
    }

    $("#Version").html("5.10");
    chrome.extension.sendRequest({
        Action: "ONLOAD"
    }, function(b) {
        plugdata = b;
        PerformAction()
    });

});

