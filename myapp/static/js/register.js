document.addEventListener("DOMContentLoaded", function() {
    const messagesDiv = document.getElementById('django-messages');
    if (messagesDiv) {
        const messages = JSON.parse(messagesDiv.dataset.messages);
        messages.forEach(msg => {
            let icon = "info"; // default

            if (msg.tags.includes("success")) icon = "success";
            else if (msg.tags.includes("error")) icon = "error";

            Swal.fire({
                title: icon === "success" ? "Success!" : "Oops!",
                text: msg.text,
                icon: icon,
                timer: 3000,
                showConfirmButton: false,
                background: 'rgba(53, 52, 52, 0.8)', // matches your glassy theme
                color: '#fff'
            });
        });
    }
});

function togglePassword(fieldId) {
    const input = document.getElementById(fieldId);
    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}