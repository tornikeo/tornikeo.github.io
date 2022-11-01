$(document).ready(function() {
    const [spinner, iframe] = $(".iframe-with-spinner").children();
    console.log( spinner, iframe )
    $(spinner).show()
    $(iframe).on("load", (function() {
        console.log("Load ended");
        $(spinner).hide()
        $(iframe).removeAttr('hidden');
    }))
})