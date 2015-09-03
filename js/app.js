var socket = new WebSocket("ws://localhost:8080");
var app = function() {
    var editableTextArea = $("#app-text");

    socket.onopen = function() {
        socket.send("Connected");
        console.log("Connected");
    };

    socket.onclose = function(event) {
        if (event.wasClean) {
            console.log('Connection closed');
        } else {
            console.log('Connection error'); // например, "убит" процесс сервера
        }
        console.log('Code: ' + event.code + ' Reason: ' + event.reason);
    };

    socket.onmessage = function(event) {
        console.log("Data: " + event.data);
    };

    socket.onerror = function(error) {
        console.log("Error: " + error.message);
    };

    $(function() {

        $("#app-text").data("old_value", $("#app-text").val());
        var selection = {start:0, end:0};

        var calculateSelection = function(e) {
            selection = {start:e.target.selectionStart, end:e.target.selectionEnd};
        };
        $("#app-text").bind("select",function(e) {
            calculateSelection(e);
        });

        $("#app-text").bind("input cut put",function(e) {
            var self = this;
            console.log(selection);

            if (typeof $(self).data("old_value") == "undefined") {
                $(self).data("old_value", $(self).val());
            }

            var ot = OT($(self).data("old_value"), $(self).val(), e.target.selectionStart, selection.start, selection.end);
            if (ot.text.length) {
                socket.send(JSON.stringify(ot));

                log("-------------------------");
                log("Changed-text: " + ot.text);
                log("Type: " + ot.type);
                log("Position: " + ot.pos);
            }
            $(self).data("old_value", $(self).val());

            calculateSelection(e);
        });
        var insertText = function(ot) {

        };

        var deleteText = function(ot) {
            val.setSelectionRange(1,3)

            val.setRangeText('')
        };

    });


    return this;
}();


function log(val) {
    console.log(val);
    $("#log").val(val + "\n" + $("#log").val());
}



