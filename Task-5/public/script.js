// Select form and list DOM elements
const createForm = document.getElementById('create-form');
const itemNameInput = document.getElementById('item-name');
const itemsList = document.getElementById('items-list');

// Fetch all items from the API and render them
async function fetchItems() {
    const response = await fetch('http://localhost:3000/api/items');
    const items = await response.json();
    itemsList.innerHTML = '';
    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.name;
        itemsList.appendChild(li);
    });
}

// Add a new item through the API
createForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newItem = { name: itemNameInput.value };

    const response = await fetch('http://localhost:3000/api/items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem),
    });

    if (response.ok) {
        itemNameInput.value = '';  // Clear input after adding
        fetchItems();  // Refresh the list of items
    } else {
        console.error('Failed to add item');
    }
});

// Initial fetch of items when the page loads
fetchItems();
