/*systém pro registraci modalů pro jednoduchou správu*/

const Modal = {


    register(name){
        const modal = document.getElementById(`${name}Modal`)
        const form = document.getElementById(`${name}Form`)
        const closeBtn = document.getElementById(`${name}Close`)
        const cancelBtn = document.getElementById(`${name}Cancel`)
        const submitBtn = document.getElementById(`${name}Submit`)
        const errorDiv = document.getElementById(`${name}Error`);
        const errorText = errorDiv.querySelector('p');


        if (!modal) {
            console.warn(`Modal #${name}Modal nenalezen`);
            return;
        };

        // otevření formuláře
        const open = () => {
            modal.classList.remove('hidden')
        }               
        
        // zavření formuláře a jeho reset
        const close = () => {
            modal.classList.add('hidden');
            if(form){
                form.reset();
            };
        };


        // zavření formuláře a jeho reset
        const cancel = () => {
            modal.classList.add('hidden');
            if(form){
                form.reset();
            };
        };


        const showError = (message) => {
            errorText.textContent = message;
            errorDiv.classList.remove('hidden');
        };

        const hideError = () =>{
            errorText.textContent = '';
            errorDiv.classList.add('hidden');
        }


        // registrace uživatelského vstupu
        if(closeBtn){
            closeBtn.addEventListener("click", close);
        }

        if(cancelBtn){
            cancelBtn.addEventListener("click", close);
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                close();
            }
        });

        return { open, close, modal, form, submitBtn, showError, hideError};
    }
}

window.Modal = Modal;