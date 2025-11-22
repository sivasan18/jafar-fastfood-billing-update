// ===== Image Helper Utility =====
// This utility helps fetch food images from free open-source APIs

class FoodImageHelper {
    constructor() {
        // Free image sources
        this.sources = {
            unsplash: 'https://source.unsplash.com/400x300/?',
            foodish: 'https://foodish-api.com/api/images/',
            picsum: 'https://picsum.photos/400/300'
        };

        // Common food keywords for better image results
        this.foodKeywords = {
            'biryani': 'biryani,rice,indian food',
            'chicken': 'chicken,food,dish',
            'mutton': 'mutton,lamb,meat',
            'prawn': 'prawn,shrimp,seafood',
            'fish': 'fish,seafood',
            'soup': 'soup,bowl',
            'rice': 'fried rice,rice dish',
            'noodles': 'noodles,asian food',
            'parota': 'paratha,bread,indian bread',
            'egg': 'egg,breakfast',
            'omelette': 'omelette,egg dish',
            'tea': 'tea,beverage',
            'coffee': 'coffee,beverage'
        };
    }

    /**
     * Get image URL for a food item
     * @param {string} itemName - Name of the food item
     * @param {string} source - Image source ('unsplash', 'foodish', or 'picsum')
     * @returns {string} Image URL
     */
    getImageUrl(itemName, source = 'unsplash') {
        const keywords = this.findKeywords(itemName);

        switch (source) {
            case 'unsplash':
                return `${this.sources.unsplash}${keywords}`;
            case 'foodish':
                return this.sources.foodish + this.getFoodishCategory(itemName);
            case 'picsum':
                return this.sources.picsum;
            default:
                return `${this.sources.unsplash}${keywords}`;
        }
    }

    /**
     * Find relevant keywords for the food item
     * @param {string} itemName - Name of the food item
     * @returns {string} Keywords for image search
     */
    findKeywords(itemName) {
        const lowerName = itemName.toLowerCase();

        // Check if any keyword matches
        for (const [key, keywords] of Object.entries(this.foodKeywords)) {
            if (lowerName.includes(key)) {
                return keywords;
            }
        }

        // Default to the item name + 'food'
        return `${itemName},food,dish`;
    }

    /**
     * Get Foodish API category
     * @param {string} itemName - Name of the food item
     * @returns {string} Foodish category
     */
    getFoodishCategory(itemName) {
        const lowerName = itemName.toLowerCase();

        if (lowerName.includes('biryani') || lowerName.includes('rice')) {
            return 'biryani';
        } else if (lowerName.includes('burger')) {
            return 'burger';
        } else if (lowerName.includes('pizza')) {
            return 'pizza';
        } else if (lowerName.includes('dessert') || lowerName.includes('sweet')) {
            return 'dessert';
        } else if (lowerName.includes('pasta')) {
            return 'pasta';
        } else if (lowerName.includes('dosa')) {
            return 'dosa';
        } else if (lowerName.includes('idly') || lowerName.includes('idli')) {
            return 'idly';
        } else if (lowerName.includes('samosa')) {
            return 'samosa';
        }

        return 'biryani'; // Default
    }

    /**
     * Generate multiple image URLs for selection
     * @param {string} itemName - Name of the food item
     * @returns {object} Object with different image source URLs
     */
    getMultipleOptions(itemName) {
        return {
            unsplash1: this.getImageUrl(itemName, 'unsplash'),
            unsplash2: `https://source.unsplash.com/400x300/?${this.findKeywords(itemName)}&sig=${Date.now()}`,
            foodish: this.getImageUrl(itemName, 'foodish'),
            picsum: this.sources.picsum
        };
    }
}

// ===== Curated Food Images =====
// High-quality Unsplash images for common Indian food items

const CURATED_FOOD_IMAGES = {
    // Biryani
    'Chicken Biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop',
    'Mutton Biryani': 'https://images.unsplash.com/photo-1633945274309-2c8c2b0e5e0e?w=400&h=300&fit=crop',
    'Prawn Biryani': 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=400&h=300&fit=crop',
    'Fish Biryani': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop',
    'Veg Biryani': 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=400&h=300&fit=crop',

    // Rice Dishes
    'Chicken Fried Rice': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    'Veg Fried Rice': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&h=300&fit=crop',
    'Egg Fried Rice': 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=400&h=300&fit=crop',

    // Noodles
    'Chicken Noodles': 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=300&fit=crop',
    'Veg Noodles': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
    'Hakka Noodles': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop',

    // Soups
    'Chicken Soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
    'Mutton Soup': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=300&fit=crop',
    'Veg Soup': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop',
    'Tomato Soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',

    // Breads
    'Parota': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop',
    'Naan': 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop',
    'Roti': 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=300&fit=crop',
    'Chapati': 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=300&fit=crop',

    // Egg Items
    'Egg Omelette': 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&h=300&fit=crop',
    'Half Boil Egg': 'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=400&h=300&fit=crop',
    'Egg Podimas': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
    'Boiled Egg': 'https://images.unsplash.com/photo-1587486937820-4d58e6e5e3f7?w=400&h=300&fit=crop',
    'Egg Curry': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop',

    // Chicken Dishes
    'Chicken 65': 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400&h=300&fit=crop',
    'Butter Chicken': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop',
    'Chicken Curry': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&h=300&fit=crop',
    'Grilled Chicken': 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&h=300&fit=crop',

    // Beverages
    'Tea': 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=300&fit=crop',
    'Coffee': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
    'Chai': 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400&h=300&fit=crop',

    // Desserts
    'Gulab Jamun': 'https://images.unsplash.com/photo-1589119908995-c6c1f4f2d724?w=400&h=300&fit=crop',
    'Ice Cream': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop',
    'Kheer': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&h=300&fit=crop'
};

/**
 * Get curated image for a food item
 * @param {string} itemName - Name of the food item
 * @returns {string} Image URL or null if not found
 */
function getCuratedImage(itemName) {
    return CURATED_FOOD_IMAGES[itemName] || null;
}

/**
 * Get image for any food item (curated or generated)
 * @param {string} itemName - Name of the food item
 * @returns {string} Image URL
 */
function getFoodImage(itemName) {
    // First try curated images
    const curated = getCuratedImage(itemName);
    if (curated) return curated;

    // Otherwise generate from Unsplash
    const helper = new FoodImageHelper();
    return helper.getImageUrl(itemName);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FoodImageHelper, CURATED_FOOD_IMAGES, getCuratedImage, getFoodImage };
}
