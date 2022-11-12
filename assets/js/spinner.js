$(document).ready(function() {
    $("#spinner").show()
    $("#iframe").ready(function() {
        $("#spinner").hide()
        $("#iframe").removeAttr('hidden')
    })
})