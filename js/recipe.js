/**
 * Cookbook Site - Recipe Detail Page Logic
 */

// ========================================
// Recipe Page Rendering
// ========================================

function renderRecipeHero(recipe) {
    const heroImage = document.getElementById('heroImage');
    const heroCategory = document.getElementById('heroCategory');
    const heroTitle = document.getElementById('heroTitle');
    const heroMeta = document.getElementById('heroMeta');

    // Update page title
    document.title = `${recipe.title} | Cookbook`;

    heroImage.src = recipe.image;
    heroImage.alt = recipe.title;
    heroCategory.textContent = recipe.category;
    heroTitle.textContent = recipe.title;

    heroMeta.innerHTML = `
    <span>⏱️ Prep: ${recipe.prepTime}</span>
    <span>🔥 Cook: ${recipe.cookTime}</span>
    <span>👤 Serves: ${recipe.servings}</span>
    <span>📊 ${recipe.difficulty}</span>
  `;
}

function renderIngredients(ingredients) {
    const list = document.getElementById('ingredientsList');

    list.innerHTML = ingredients.map((ingredient, index) => `
    <label class="ingredient-item">
      <input type="checkbox" class="ingredient-checkbox" id="ing-${index}">
      <span class="ingredient-text">${ingredient}</span>
    </label>
  `).join('');

    // Save checked state to localStorage
    const checkboxes = list.querySelectorAll('.ingredient-checkbox');
    const recipeId = getUrlParam('id');
    const saved = JSON.parse(localStorage.getItem(`ingredients-${recipeId}`) || '[]');

    checkboxes.forEach((checkbox, index) => {
        checkbox.checked = saved.includes(index);
        checkbox.addEventListener('change', () => {
            const checked = Array.from(checkboxes)
                .map((cb, i) => cb.checked ? i : null)
                .filter(i => i !== null);
            localStorage.setItem(`ingredients-${recipeId}`, JSON.stringify(checked));
        });
    });
}

function renderSteps(steps, videoUrl) {
    const list = document.getElementById('stepsList');

    list.innerHTML = steps.map(step => {
        // Check if step has video timing
        const hasVideo = videoUrl && step.startTime !== undefined;

        let mediaHtml;
        if (hasVideo) {
            // Create YouTube embed with timestamp
            const videoId = extractYouTubeId(videoUrl);
            const startSeconds = timeToSeconds(step.startTime);
            const endSeconds = step.endTime ? timeToSeconds(step.endTime) : null;

            // Build embed URL with parameters
            let embedUrl = `https://www.youtube.com/embed/${videoId}?start=${startSeconds}`;
            if (endSeconds) {
                embedUrl += `&end=${endSeconds}`;
            }
            embedUrl += '&rel=0&modestbranding=1';

            mediaHtml = `
                <div class="step-video-container">
                    <iframe 
                        class="step-video"
                        src="${embedUrl}"
                        title="Step ${step.step}: ${step.title}"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                    ></iframe>
                    <div class="step-video-time">
                        <span>📍 ${step.startTime}${step.endTime ? ` - ${step.endTime}` : ''}</span>
                    </div>
                </div>
            `;
        } else if (step.image) {
            // Fallback to image
            mediaHtml = `<img src="${step.image}" alt="Step ${step.step}" class="step-image" loading="lazy">`;
        } else {
            mediaHtml = '';
        }

        return `
            <article class="step-card">
                ${mediaHtml}
                <div class="step-content">
                    <span class="step-number">${step.step}</span>
                    <h3 class="step-title">${step.title}</h3>
                    <p class="step-description">${step.description}</p>
                    ${step.tip ? `
                        <div class="step-tip">
                            <strong>💡 Tip:</strong> ${step.tip}
                        </div>
                    ` : ''}
                </div>
            </article>
        `;
    }).join('');
}

// Extract YouTube video ID from various URL formats
function extractYouTubeId(url) {
    if (!url) return null;

    // Handle different YouTube URL formats
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /^([a-zA-Z0-9_-]{11})$/ // Just the ID
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) return match[1];
    }

    return null;
}

// Convert time string (MM:SS or HH:MM:SS) to seconds
function timeToSeconds(timeStr) {
    if (typeof timeStr === 'number') return timeStr;

    const parts = timeStr.split(':').map(Number);
    if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
        return parts[0] * 60 + parts[1];
    }
    return parseInt(timeStr) || 0;
}

function renderRecipe(recipe) {
    if (!recipe) {
        document.body.innerHTML = `
      <div class="empty-state" style="padding: 100px 20px;">
        <div class="empty-state-icon">😕</div>
        <h3 class="empty-state-title">Recipe not found</h3>
        <p>The recipe you're looking for doesn't exist.</p>
        <a href="index.html" class="back-btn" style="margin-top: 20px;">← Back to Recipes</a>
      </div>
    `;
        return;
    }

    renderRecipeHero(recipe);
    renderIngredients(recipe.ingredients);
    renderSteps(recipe.steps, recipe.videoUrl);
}

// ========================================
// Initialize Recipe Page
// ========================================

async function initRecipePage() {
    const recipeId = getUrlParam('id');

    if (!recipeId) {
        window.location.href = 'index.html';
        return;
    }

    await loadRecipes();
    const recipe = getRecipeById(recipeId);
    renderRecipe(recipe);
}

// Run on page load
if (document.getElementById('recipeHero')) {
    initRecipePage();
}
