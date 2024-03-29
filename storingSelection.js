function setCookie (cookieName, cookieValue, expires, path, domain, secure) {
        document.cookie =
            escape(cookieName) + '=' + escape(cookieValue)
            + (expires ? '; EXPIRES=' + expires.toGMTString() : '')
            + (path ? '; PATH=' + path : '')
            + (domain ? '; DOMAIN=' + domain : '')
            + (secure ? '; SECURE' : '');
    }


function getCookie (cookieName) {
    var cookieValue = null;
    var posName = document.cookie.indexOf(escape(cookieName) + '=');
    if (posName != -1) {
        var posValue = posName + (escape(cookieName) + '=').length;
        var endPos = document.cookie.indexOf(';', posValue);
        if (endPos != -1)
            cookieValue = unescape(document.cookie.substring(posValue, endPos));
        else
            cookieValue = unescape(document.cookie.substring(posValue));
    }
    return cookieValue;
}


function makeXPath (node, currentPath) {
    /* this should suffice in HTML documents for selectable nodes, XML with namespaces needs more code */
    currentPath = currentPath || '';
    switch (node.nodeType) {
        case 3:
        case 4:
            return makeXPath(node.parentNode, 'text()[' + (document.evaluate('preceding-sibling::text()', node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength + 1) + ']');
        case 1:
            return makeXPath(node.parentNode, node.nodeName + '[' + (document.evaluate('preceding-sibling::' + node.nodeName, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength + 1) + ']' + (currentPath ? '/' + currentPath : ''));
        case 9:
            return '/' + currentPath;
        default:
            return '';
    }
}


function storeSelection () {
    if (typeof window.getSelection != 'undefined') {
        var selection = window.getSelection();
        var range = selection.getRangeAt(0);
        if (range != null) {
            setCookie('sel', makeXPath(range.startContainer) + '|' + range.startOffset + '|' + makeXPath(range.endContainer) + '|' + range.endOffset);
        }
    }
}


function restoreSelection () {
    var selectionDetails = getCookie('sel');
    if (selectionDetails != null) {
        selectionDetails = selectionDetails.split(/\|/g);
        if (typeof window.getSelection != 'undefined') {
            var selection = window.getSelection();
            selection.removeAllRanges();
            var range = document.createRange();
            range.setStart(document.evaluate(selectionDetails[0], document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue, Number(selectionDetails[1]));
            range.setEnd(document.evaluate(selectionDetails[2], document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue, Number(selectionDetails[3]));
            selection.addRange(range);
        }
    }
}


window.onload = restoreSelection;
