$(document).ready(function() {
    // let intervalId;
    // intervalId = setInterval(() => {
    //     console.log('Checking...');
    //     console.log(document.querySelector('#iframe'));
    //     if ($("gradio-app").length > 0) {
    //         console.log('YES');
    //         $("#spinner").hide()
    //         $("#iframe").removeAttr('hidden')
    //         clearInterval(intervalId);
    //     } else {
    //         console.log('Nope');
    //     }
    // }, 500)
    $("#spinner").ready(function() {
        $("#spinner").show()
        function spinner_swap() {
            $("#spinner").hide()
            $("#iframe").removeAttr('hidden')
        }
        $("#iframe").ready(spinner_swap)
        setTimeout(spinner_swap, 20000)
    })
})