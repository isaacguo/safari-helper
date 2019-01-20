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
    if (document.selection) { // IE
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementsByClassName(containerid)[0]);
        range.select();

        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } else if (window.getSelection) {
        console.log('here')


        var selection = document.getSelection();
        var range = document.createRange();
//  range.selectNodeContents(textarea);
        range.selectNode(document.getElementsByClassName(containerid)[0]);
        selection.removeAllRanges();
        selection.addRange(range);

        //copyToClipboard(selection.toString());
        console.log('copy success', document.execCommand('copy'));
        selection.removeAllRanges();
    }
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

    //content.insertBefore(button, content.firstChild)
    //content.appendChild(button);


// 3. Add event handler
    button.addEventListener("click", function () {
        console.log(nextLink.href);
        location.href = nextLink.href;
    });
    //},1000)
};


(function () {


    var addCopyButton = function () {
//setTimeout(function(){
        var button = document.createElement("button");
        button.innerHTML = "Copy";
        button.id = "btnCopy";
        var content = document.getElementById("sbo-rt-content");
        //content.insertBefore(button, content.childNodes[0])
        content.insertBefore(button, content.firstChild)
        //content.appendChild(button);

// 3. Add event handler
        button.addEventListener("click", function () {
            selectText('annotator-wrapper')
         });
        //},1000)
    };

    var simulateClick = function () {
        var button = document.getElementById("btnCopy");
        button.click();
    }


    /*
  setInterval(function () {

      console.log('executing');
      var nextLink = document.querySelectorAll(".next,.nav-link")[0];
      nextLink.click();
      //location.href = nextLink.href;

  }, 1000);
  */
    //console.log('executing');

    var imported = document.createElement('script');
    imported.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js';
    document.head.appendChild(imported);

    setTimeout(function () {

        addCopyButton();
        console.log("simulating");
        $("#btnCopy").trigger("click");
    }, 1000)
    //var button = document.getElementById("btnCopy");
    //button.click();
    //addNextPageButton();

    //selectText('annotator-wrapper')


})();


