document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.menu-item');
    const foodContainer = document.getElementById('food-container');
    const searchBox = document.getElementById('search');

    // Event listener for search box input
    searchBox.addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();

        fetch(`../php/load_food_items.php?search=${encodeURIComponent(searchTerm)}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayFoods(data.foodItems);
                } else {
                    foodContainer.innerHTML = '<p>No food items found.</p>';
                    console.error('Failed to load food items:', data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    // Event listeners for menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const category = item.getAttribute('name');
            loadFoodItems(category);
        });
    });

    // Function to load food items based on category
    function loadFoodItems(category) {
        fetch(`../php/load_food_items.php?category=${encodeURIComponent(category)}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayFoods(data.foodItems);
                } else {
                    foodContainer.innerHTML = '<p>No food items found in this category.</p>';
                    console.error('Failed to load food items:', data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Function to display food items
    function displayFoods(foodItems) {
        foodContainer.innerHTML = ''; // Clear previous items

        if (foodItems.length === 0) {
            foodContainer.innerHTML = '<p>No food items found.</p>';
            return;
        }

        foodItems.forEach(item => {
            const foodDiv = document.createElement('div');
            foodDiv.classList.add('food-item');

            foodDiv.innerHTML = `
                <h3>${item.fName}</h3>
                <p>${item.fDescription}</p>
                <p>Price: $${item.fPrice}</p>
                <img src="data:image/jpeg;base64,${item.fImage}" alt="${item.fName}">
            `;

            foodContainer.appendChild(foodDiv);
        });
    }

    // Do not load food items initially
});
