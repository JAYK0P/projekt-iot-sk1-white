/*
    Type formulář
    */
    const typeModal = Modal.register('Type');
    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toast-message");
    // id of type being edited (null when creating)
    let editTypeId = null;

    
    if(typeModal){
        const {openModal, submitBtn, showError, hideError } = typeModal;
        
        // akce pro zobrazování (otevření modalu pro přidání)
        if(typeModal.openModal){
            typeModal.openModal.addEventListener('click', () => {
                editTypeId = null; // ensure we're in create mode
                document.getElementById('typeName')?.value = '';
                submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Type';
                typeModal.open();
                hideError();
            });
        }

        // pokud existuje tlačítko pro editaci, připojíme handler
        const editBtn = document.getElementById('TypeEdit');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                const sel = document.getElementById('typeSelector');
                if (!sel) return alert('Select not found');
                const id = sel.value;
                if (!id) return alert('Vyberte typ k editaci.');
                const name = sel.options[sel.selectedIndex]?.text || '';
                editTypeId = id;
                document.getElementById('typeName').value = name;
                submitBtn.innerHTML = '<i class="fas fa-pencil-alt"></i> Upravovat';
                typeModal.open();
                hideError();
            });
        }


        if(typeModal.submitBtn){
           typeModal.submitBtn.addEventListener('click', async (e) =>{
              e.preventDefault();

                const formData = {
                    type: document.getElementById('typeName').value,
                };

                try {
                    submitBtn.disabled = true;
                    if (editTypeId) {
                        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Upravuji...';
                    } else {
                        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Přidávám...';
                    }

                    let response;
                    if (editTypeId) {
                        response = await fetch(`/type/types/${editTypeId}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(formData)
                        });
                    } else {
                        response = await fetch('/type/add', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(formData)
                        });
                    }

                    const data = await response.json();

                    if (data.success) {
                        // Úspěch - zobraz zprávu a zavři modal
                        if(toast && toastMsg){
                            openToast(data.message);
                        }
                        else{
                            showError("nebylo možné zobrazit alert");
                        }
                        typeModal.close();
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Type';
                        // refresh types once after add/edit
                        const result = await fetchData('/type/types');
                        if (result) {
                            populateSelector(result);
                            // clear selection after update
                            const sel = document.getElementById('typeSelector');
                            if (sel) sel.value = '';
                        } else {
                            console.warn('Žádná data nebyla načtena.');
                        }
                        // reset edit state
                        editTypeId = null;
                        
                    } else {
                        // Chyba - zobraz chybovou hlášku
                        showError(data.message);
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Type';
                    }
                    
                } catch (error) {
                    console.log(error)
                    typeModal.showError(error);
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add Type';
                }
            });
        }
    }
    /*
    Type formulář - konec
    */