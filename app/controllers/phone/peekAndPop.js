// Assign the 'pop' feature to the button
$.button.previewContext = $.context;

function alertActionTitle(e) {
    alert("Title: " + e.title + " / Style: " + e.style+" / Index: " + e.index);
}

function alertAction(e) {
    alert("Title: " + e.title + " / Style: " + e.style+" / Index: " + e.index);
}

function alertSubAction(e) {
    alert("Title: " + e.title + " / Style: " + e.style+" / Subindex: " + e.index);
}

// Pop the preview
function pop() {
    $.detailWin.add($.detailText);
    $.detailWin.add($.buttonBack);
    $.detailWin.open();
}

function goBack() {
	$.detailWin.close();
}
