# 🍳 Cookbook

A beautiful static cookbook website with step-by-step recipe guides. Designed to be hosted on GitHub Pages.

![Cookbook Preview](https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80)

## ✨ Features

- 🎨 **Beautiful Design** - Modern glassmorphism UI with smooth animations
- 🌙 **Dark Mode** - Automatic theme detection with manual toggle
- 🔍 **Search** - Real-time recipe search
- 🏷️ **Categories** - Filter by Breakfast, Lunch, Dinner, Dessert
- 📖 **Step-by-Step** - Detailed instructions with images for each step
- ✅ **Ingredient Checkboxes** - Track your progress (saved in browser)
- 📱 **Responsive** - Works on all devices
- ⚡ **Fast** - Pure HTML/CSS/JS, no build tools needed

## 🚀 Quick Start

### Local Development

1. Clone this repository
2. Start a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```
3. Open `http://localhost:8000` in your browser

### Deploy to GitHub Pages

1. Push this code to a GitHub repository
2. Go to **Settings** → **Pages**
3. Set Source to **Deploy from a branch**
4. Select `main` branch and `/ (root)` folder
5. Click **Save**

Your site will be live at `https://yourusername.github.io/repository-name`

## 📁 Project Structure

```
cookbook/
├── index.html          # Homepage with recipe grid
├── recipe.html         # Recipe detail page
├── css/
│   └── styles.css      # All styles & design tokens
├── js/
│   ├── app.js          # Main app logic
│   └── recipe.js       # Recipe page logic
├── data/
│   └── recipes.json    # Recipe database
└── README.md
```

## 🍽️ Adding New Recipes

Edit `data/recipes.json` and add a new recipe object:

```json
{
  "id": "unique-recipe-id",
  "title": "Recipe Title",
  "description": "Short description",
  "category": "breakfast|lunch|dinner|dessert",
  "difficulty": "easy|medium|hard",
  "prepTime": "10 mins",
  "cookTime": "20 mins",
  "totalTime": "30 mins",
  "servings": 4,
  "image": "URL to hero image",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "steps": [
    {
      "step": 1,
      "title": "Step Title",
      "description": "Detailed instructions...",
      "image": "URL to step image",
      "tip": "Optional pro tip"
    }
  ]
}
```

## 🎨 Customization

### Colors
Edit CSS variables in `css/styles.css`:

```css
:root {
  --color-primary: #e67e22;      /* Main accent color */
  --color-secondary: #2c3e50;    /* Dark color */
  --color-bg: #faf8f5;           /* Background */
}
```

### Dark Mode Colors
```css
[data-theme="dark"] {
  --color-bg: #1a1a2e;
  --color-bg-card: #16213e;
}
```

## 📝 License

MIT License - feel free to use for personal or commercial projects.

---

Made with ❤️ | [View Demo](https://yourusername.github.io/cookbook)
