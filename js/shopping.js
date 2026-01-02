/**
 * Cookbook Site - Shopping List Logic
 */

// ========================================
// Shopping List Manager
// ========================================

const ShoppingList = {
    STORAGE_KEY: 'cookbook-shopping-list',

    // Get all items from localStorage
    getItems() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    // Save items to localStorage
    saveItems(items) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
        this.updateBadge();
    },

    // Add items to the list
    addItems(ingredients, recipeName) {
        const items = this.getItems();
        const timestamp = Date.now();

        ingredients.forEach(ingredient => {
            // Check if item already exists
            const exists = items.some(item =>
                item.text.toLowerCase() === ingredient.toLowerCase()
            );

            if (!exists) {
                items.push({
                    id: `${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
                    text: ingredient,
                    recipe: recipeName,
                    checked: false,
                    addedAt: timestamp
                });
            }
        });

        this.saveItems(items);
        return items;
    },

    // Toggle item checked state
    toggleItem(id) {
        const items = this.getItems();
        const item = items.find(i => i.id === id);
        if (item) {
            item.checked = !item.checked;
            this.saveItems(items);
        }
        return items;
    },

    // Remove single item
    removeItem(id) {
        let items = this.getItems();
        items = items.filter(i => i.id !== id);
        this.saveItems(items);
        return items;
    },

    // Clear all checked items
    clearChecked() {
        let items = this.getItems();
        items = items.filter(i => !i.checked);
        this.saveItems(items);
        return items;
    },

    // Clear all items
    clearAll() {
        this.saveItems([]);
        return [];
    },

    // Get count of unchecked items
    getCount() {
        const items = this.getItems();
        return items.filter(i => !i.checked).length;
    },

    // Update badge on bottom nav
    updateBadge() {
        const badge = document.getElementById('shoppingBadge');
        if (badge) {
            const count = this.getCount();
            badge.textContent = count > 0 ? count : '';
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }
};

// ========================================
// Shopping List Page Rendering
// ========================================

function renderShoppingList() {
    const container = document.getElementById('shoppingList');
    const emptyState = document.getElementById('emptyState');

    if (!container) return;

    const items = ShoppingList.getItems();

    if (items.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    // Group items by recipe
    const grouped = items.reduce((acc, item) => {
        const key = item.recipe || 'Other';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});

    container.innerHTML = Object.entries(grouped).map(([recipe, items]) => `
        <div class="shopping-group">
            <h3 class="shopping-group-title">${recipe}</h3>
            <ul class="shopping-items">
                ${items.map(item => `
                    <li class="shopping-item ${item.checked ? 'checked' : ''}" data-id="${item.id}">
                        <label class="shopping-item-label">
                            <input type="checkbox" class="shopping-checkbox" ${item.checked ? 'checked' : ''}>
                            <span class="shopping-item-text">${item.text}</span>
                        </label>
                        <button class="shopping-item-remove" aria-label="Remove item">✕</button>
                    </li>
                `).join('')}
            </ul>
        </div>
    `).join('');

    // Add event listeners
    container.querySelectorAll('.shopping-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const itemId = e.target.closest('.shopping-item').dataset.id;
            ShoppingList.toggleItem(itemId);
            renderShoppingList();
        });
    });

    container.querySelectorAll('.shopping-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = e.target.closest('.shopping-item').dataset.id;
            ShoppingList.removeItem(itemId);
            renderShoppingList();
        });
    });
}

// ========================================
// Initialize Shopping Page
// ========================================

function initShoppingPage() {
    const shoppingList = document.getElementById('shoppingList');
    if (!shoppingList) return;

    renderShoppingList();
    ShoppingList.updateBadge();

    // Clear checked button
    document.getElementById('clearChecked')?.addEventListener('click', () => {
        ShoppingList.clearChecked();
        renderShoppingList();
    });

    // Clear all button
    document.getElementById('clearAll')?.addEventListener('click', () => {
        if (confirm('Clear all items from your shopping list?')) {
            ShoppingList.clearAll();
            renderShoppingList();
        }
    });
}

// Run on page load
if (document.getElementById('shoppingList')) {
    initShoppingPage();
}

// Update badge on any page
ShoppingList.updateBadge();
