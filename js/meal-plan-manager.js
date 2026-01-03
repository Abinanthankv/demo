/**
 * Meal Plan Manager - Data storage and retrieval
 */

const MealPlan = {
    STORAGE_KEY: 'cookbook-meal-plan',

    // Get all planned meals
    getAll() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    },

    // Get plans for a specific date (YYYY-MM-DD)
    getForDate(date) {
        const all = this.getAll();
        return all[date] || { breakfast: [], lunch: [], dinner: [], snack: [] };
    },

    // Add a recipe to a date/meal
    addRecipe(date, mealType, recipeId) {
        const all = this.getAll();
        if (!all[date]) {
            all[date] = { breakfast: [], lunch: [], dinner: [], snack: [] };
        }

        if (!all[date][mealType]) {
            all[date][mealType] = [];
        }

        if (!all[date][mealType].includes(recipeId)) {
            all[date][mealType].push(recipeId);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
        }
        return all[date];
    },

    // Remove a recipe from a date/meal
    removeRecipe(date, mealType, recipeId) {
        const all = this.getAll();
        if (all[date] && all[date][mealType]) {
            all[date][mealType] = all[date][mealType].filter(id => id !== recipeId);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
        }
        return all[date];
    },

    // Get a specific meal's recipes
    getMeal(date, mealType) {
        const day = this.getForDate(date);
        return day[mealType] || [];
    },

    // Clear a whole day
    clearDate(date) {
        const all = this.getAll();
        delete all[date];
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
    }
};

// Make available globally
window.MealPlan = MealPlan;
