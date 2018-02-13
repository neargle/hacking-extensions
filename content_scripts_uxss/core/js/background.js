var RequestQ = [],
    plugdata = null,
    IRTab = null,
    IRData = null,
    requestFilter = {
        urls: ["<all_urls>"]
    };

chrome.extension.onRequest.addListener(function(a, b, c) {
    $.extend(a, {
        TabID: b.tab.id
    });
    plugdata = a;
    switch (a.Action) {
        case "VERSION":
            break;
        case "ONLOAD":
            c(IRData);
            break;
        case "GETFARE":
            IRData = a;
            $.extend(a, {
                RequesterTabID: b.tab.id
            });
            chrome.tabs.getAllInWindow(null, OngetAllInWindow);
            c({});
            break;
        case "FAREResult":
            SendMessage(a.Action, a.Data, a.Data.RequesterTabID);
            break;
        default:
            RequestQ.push(a);
            c({})
    }
});
