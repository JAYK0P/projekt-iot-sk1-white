let toastTimeout;
let toastHideTimeout;

function openToast(message, success) {
    let toastElement;
    let toastMessageElement;

    if (success) {
        toastElement = document.getElementById("toast-success");
        toastMessageElement = document.getElementById("toast-message-success");
    } else {
        toastElement = document.getElementById("toast-error");
        toastMessageElement = document.getElementById("toast-message-error");
    }

    if (!toastElement || !toastMessageElement) {
        console.error("Toast elementy nebyly nalezeny v DOM!");
        return;
    }

    toastMessageElement.innerHTML = message;
    clearTimeout(toastTimeout);
    clearTimeout(toastHideTimeout);

    toastElement.classList.remove("hidden");
    
    setTimeout(() => {
        toastElement.classList.remove("opacity-0");
        toastElement.classList.add("opacity-100");
    }, 10);

    // 5. Schování po uplynutí času
    toastTimeout = setTimeout(() => {
        toastElement.classList.replace("opacity-100", "opacity-0");

        toastHideTimeout = setTimeout(() => {
            toastElement.classList.add("hidden");
        }, 1000);
    }, 2500);
}

window.openToast = openToast;