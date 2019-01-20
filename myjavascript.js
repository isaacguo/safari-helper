'use strict'


function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData("Text", text);

    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        console.log("true");
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {

            console.log("copying", document.execCommand("copy"));  // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}

function selectText(containerid) {

    var iframe = document.querySelector("iframe");
    var innerDoc = iframe.contentWindow.document;


    var selection = innerDoc.getSelection();
    var range = innerDoc.createRange();
//  range.selectNodeContents(textarea);
    range.selectNode(iframe.contentWindow.document.getElementsByClassName(containerid)[0]);
    selection.removeAllRanges();
    selection.addRange(range);

    console.log('copy success', innerDoc.execCommand('copy'));
    console.log(selection);
    selection.removeAllRanges();
}


function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}


var addNextPageButton = function () {
//setTimeout(function(){
    var button = document.createElement("button");
    button.innerHTML = "Next";
    var content = document.getElementById("sbo-rt-content");
    var nextLink = document.querySelectorAll(".next,.nav-link")[0];

// 3. Add event handler
    button.addEventListener("click", function () {
        var nextLink = document.querySelectorAll(".next,.nav-link")[0];
        location.href = nextLink.href;
    });
    //},1000)
};

(function () {

    var docIframe = function () {
        var iframe = document.createElement("iframe");
        iframe.src = document.location;
        var content = document.getElementById("sbo-rt-content");
        content.insertBefore(iframe, content.firstChild)

        iframe.addEventListener("load", function () {
            navigator.clipboard.writeText("loaded").then(()=>{
                console.log("loaded copied to clipboard");
            })
        })
    }


    var addCopyButton = function (name, func) {
        var button = document.createElement("button");
        button.innerHTML = name;
        var content = document.getElementById("sbo-rt-content");
        //content.insertBefore(button, content.childNodes[0])
        content.insertBefore(button, content.firstChild)
        //content.appendChild(button);
        button.addEventListener("click", func);

    };

    var nextButtonListener = function () {

        var iframe = document.querySelector("iframe");
        var innerDoc = iframe.contentWindow.document;

        var nextLink = innerDoc.querySelector("div.sbo-next a.next");
        var iframe = document.querySelector("iframe");
        setTimeout(function () {
            iframe.src = nextLink.href;
        },4000)
    };


    var copyButtonListener = function () {

        selectText('annotator-wrapper')

    }


    var simulateClick = function () {
        var button = document.getElementById("btnCopy");
        button.click();
    }

    var imported = document.createElement('script');
    imported.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js';
    document.head.appendChild(imported);

    setTimeout(function () {
        docIframe();
        addCopyButton("Next", nextButtonListener);
        addCopyButton("Copy", copyButtonListener);
    }, 400)

    /*
    setInterval(function () {
        navigator.clipboard.readText()
            .then(text => {
                if(text==='done!')
                {
                    console.log('pasted done!');

                }
                else {
                    console.log('still not finished yet');
                }
            })
            .catch(err => {
                console.error('Failed to read clipboard contents: ', err);
            });
    }, 2000);
    */

})();


