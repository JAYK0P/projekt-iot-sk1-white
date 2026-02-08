// načtení select elementu pro Typy MCU
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const jsonData = await response.json();
    
    if (jsonData.result && jsonData.result.length > 0) {
      return jsonData.result;
    }
    return null;

  } catch (error) {
    console.error('Chyba při načítání dat:', error);
    return null;
  }
}

function populateSelector(typesArray) {
  const selectElement = document.getElementById('typeSelector');

  typesArray.forEach(function(item) {
    const option = document.createElement('option');
    
    option.value = item.id; 
    option.textContent = item.type;
    
    selectElement.appendChild(option);
  });
}

document.addEventListener('DOMContentLoaded', async function() {
  const result = await fetchData('/type/types');
  
  if (result) {
    populateSelector(result);
  } else {
    console.warn('Žádná data nebyla načtena.');
  }
});