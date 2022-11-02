$(document).ready(function() {
    const [spinner, iframe] = $(".iframe-with-spinner").children();
    $(spinner).show()
    $(iframe).on("load", (function() {
        $(spinner).hide()
        $(iframe).removeAttr('hidden');
    }))
})