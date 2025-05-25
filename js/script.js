var hide = document.getElementById("hide-side")
let width = screen.width;

if (width < 425) {
    hide.innerHTML = "ViewSideBar()";
}
hide.addEventListener("click", function () {


    var sidebar = document.getElementById("side-bar")
    var content = document.getElementById("content-container")
    if (width > 425) {
        if (hide.innerHTML == "HideSideBar()") {
            sidebar.classList.add("hide-side-bar");

            content.classList.add("expanded-content")
            hide.innerHTML = "ViewSideBar()";
        }
        else {

            setTimeout(function () {
                sidebar.classList.remove("hide-side-bar");

            }, 300);
            content.classList.remove("expanded-content")
            hide.innerHTML = "HideSideBar()";
        }
    }
    else {
        sidebar.classList.add("displaySide")

    }




});
var sidebar = document.getElementById("mobile-menu")
function mobileMenu() {
    sidebar.classList.toggle("openMenu")

}
function hideMenu() {
    sidebar.classList.remove("openMenu")
}
function hideSideBar() {
    var mainSidebar = document.getElementById("side-bar")
    mainSidebar.classList.remove("displaySide")
}

emailjs.init('qCfbYORIGMdCq2HAl');

// Reference the form
const form = document.getElementById('contact-form');

form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    // Send email using EmailJS
    emailjs.send('service_4g3puod', 'template_zhugs6c', {
        from_name: form.from_name.value,
        to_email: 'rdjavier0303@gmail.com',
        email: form.email.value,
        message: form.message.value
    }).then(function (response) {
        alert('Email sent successfully!');
        console.log('SUCCESS!', response.status, response.text);
        form.reset(); // Optional: Clear the form
    }, function (error) {
        alert('Failed to send email. Please try again.');
        console.error('FAILED...', error);
    });
});