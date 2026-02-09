document.addEventListener('DOMContentLoaded', () => {
    

    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toast-message");
    window.toast = toast;
    window.toastMsg = toastMsg;


        let toastTimeout;

    function openToast(message) {

        toastMsg.innerHTML = message;
        
        clearTimeout(toastTimeout);

        toast.classList.remove("hidden");

        setTimeout(() => {
            toast.classList.remove("opacity-0");
            toast.classList.add("opacity-100");
        }, 10); 

        toastTimeout = setTimeout(() => {
            
            toast.classList.remove("opacity-100");
            toast.classList.add("opacity-0");

            setTimeout(() => {
                toast.classList.add("hidden");
            }, 1000);
            
        }, 2500);
    }
    window.openToast = openToast;
});