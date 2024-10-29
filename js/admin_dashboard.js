let foodItems = []; // Define foodItems globally

function showSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';

    if (sectionId === 'customerFeedback') {
        loadCustomerFeedback();
    }
}

function createUser() {
    const form = document.getElementById('createUserForm');
    const formData = new FormData(form);

    // Validation
    const fullName = formData.get('fName');
    const email = formData.get('email');
    const username = formData.get('uName');
    const password = formData.get('pWord');
    const confirmPassword = formData.get('confirmPassword');
    
    // Check if all required fields are filled out
    if (!fullName || !email || !username || !password || !confirmPassword) {
        alert('Please fill out all required fields.');
        return;
    }
    
    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Check if password and confirm password match
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    fetch('../php/create_user.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(text => {
        try {
            const data = JSON.parse(text);
            if (data.success) {
                alert('User created successfully.');
                form.reset();
            } else {
                alert('Failed to create user: ' + data.message);
            }
        } catch (e) {
            console.error('Failed to parse JSON response:', text);
            alert('An error occurred: ' + text);
        }
    })
    .catch(error => console.error('Error:', error));
}

function addFoodItem() {
    const form = document.getElementById('addFoodItemForm');
    const formData = new FormData(form);

    fetch('../php/add_food_item.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Food item added successfully.');
            form.reset();
            loadFoodItems();
        } else {
            alert('Failed to add food item: ' + data.message);
        }
    });
}

function loadFoodItems() {
    fetch('../php/load_food_admin.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                foodItems = data.foodItems; 
                displayFoodItems(data.foodItems);
            } else {
                console.error('Failed to load food items:', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function deleteFoodItem(itemId) {
    fetch(`../php/delete_food_item.php?id=${itemId}`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Food item deleted successfully.');
            loadFoodItems(); // Reload food items after deletion
        } else {
            alert(`Error deleting food item: ${data.message}`);
        }
    })
    .catch(error => {
        console.error('Error deleting food item:', error);
    });
}

function updateFoodItem(itemId) {
    const foodType = document.getElementById('foodType').value;
    const foodName = document.getElementById('foodName').value;
    const foodDescription = document.getElementById('foodDescription').value;
    const foodPrice = document.getElementById('foodPrice').value;
    const foodQuantity = document.getElementById('foodQuantity').value;

    fetch(`../php/update_food_item.php`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `id=${itemId}&fType=${foodType}&fName=${foodName}&fDescription=${foodDescription}&fPrice=${foodPrice}&quantity=${foodQuantity}`,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Food item updated successfully.');
            loadFoodItems(); // Reload food items after update
        } else {
            alert(`Error updating food item: ${data.message}`);
        }
    })
    .catch(error => {
        console.error('Error updating food item:', error);
    });
}

function editFoodItem(itemId) {
    const foodItem = foodItems.find(item => item.id === itemId);

    if (foodItem) {
        document.getElementById('foodType').value = foodItem.fType;
        document.getElementById('foodName').value = foodItem.fName;
        document.getElementById('foodDescription').value = foodItem.fDescription;
        document.getElementById('foodPrice').value = foodItem.fPrice;
        document.getElementById('foodQuantity').value = foodItem.quantity;

        const submitButton = document.querySelector('#submitButton');
        if (submitButton) {
            submitButton.innerText = 'Update Food Item';
            submitButton.onclick = function() {
                updateFoodItem(foodItem.id);
            };
        } else {
            console.error('Submit button not found.');
        }
    } else {
        alert('Food item not found.');
    }
}

function displayFoodItems(foodItems) {
    const foodItemsTable = document.getElementById('foodItemsTable').getElementsByTagName('tbody')[0];
    foodItemsTable.innerHTML = '';

    foodItems.forEach(item => {
        const row = foodItemsTable.insertRow();
        row.insertCell(0).textContent = item.fType;
        row.insertCell(1).textContent = item.fName;
        row.insertCell(2).textContent = item.fDescription;
        row.insertCell(3).textContent = item.fPrice;
        row.insertCell(4).textContent = item.quantity;
        row.insertCell(5).innerHTML = `<img src="data:image/jpeg;base64,${item.fImage}" alt="${item.fName}" style="width: 200px; height: auto;"/>`;

        const actionsCell = row.insertCell(6);
        actionsCell.innerHTML = `
            <button onclick="editFoodItem(${item.id})" style="margin-bottom: 5px;">Update</button>
            <button onclick="deleteFoodItem(${item.id})">Delete</button>
            <button onclick="saveFoodItem(${item.id})" style="display:none;">Save</button>
        `;
    });
}

function loadCustomerFeedback() {
    async function fetchFeedbackData() {
        try {
            const response = await fetch('../php/load_feedback_admin.php');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data.success) {
                displayCustomerFeedback(data.feedback);
            } else {
                console.error('Failed to load customer feedback:', data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    fetchFeedbackData(); 
}

function displayCustomerFeedback(feedbackData) {
    const customerFeedbackTable = document.getElementById('customerFeedbackTable').getElementsByTagName('tbody')[0];
    customerFeedbackTable.innerHTML = '';

    feedbackData.forEach(fb => {
        const row = customerFeedbackTable.insertRow();
        row.setAttribute('data-id', fb.id); 
        row.insertCell(0).textContent = fb.id;
        row.insertCell(1).textContent = fb.uName;
        row.insertCell(2).textContent = fb.email;
        row.insertCell(3).textContent = fb.feedback;

        let statusText;
        let actionsHtml = '';

        if (fb.status === 'allowed') {
            statusText = 'Allowed';
        } else if (fb.status === 'denied') {
            statusText = 'Denied';
        } else {
            statusText = 'Pending';
            actionsHtml = `
                <button onclick="allowFeedback(${fb.id}, this)">Allow</button>
                <button onclick="denyFeedback(${fb.id}, this)">Deny</button>
            `;
        }

        // Display status in Status column
        const statusCell = row.insertCell(4);
        statusCell.textContent = statusText;

        // Actions column with buttons based on status
        const actionsCell = row.insertCell(5);
        actionsCell.innerHTML = actionsHtml;
    });
}

function allowFeedback(feedbackId, button) {
    fetch(`../php/allow_feedback.php?id=${feedbackId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Feedback allowed successfully!');
                updateRowStatus(button, 'Allowed');
            } else {
                alert('Failed to allow feedback. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error allowing feedback:', error);
            alert('Failed to allow feedback. Please try again later.');
        });
}

function denyFeedback(feedbackId, button) {
    fetch(`../php/deny_feedback.php?id=${feedbackId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Feedback denied successfully!');
                updateRowStatus(button, 'Denied');
            } else {
                alert('Failed to deny feedback. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error denying feedback:', error);
            alert('Failed to deny feedback. Please try again later.');
        });
}

function updateRowStatus(button, statusText) {
    const row = button.closest('tr');
    const statusCell = row.cells[4];
    const actionsCell = row.cells[5];
    statusCell.textContent = statusText;
    actionsCell.innerHTML = '';
}

function removeFeedbackButtons(button) {
    const row = button.closest('tr');
    const actionsCell = row.querySelector('td:last-child');
    actionsCell.innerHTML = 'No actions available';
}

function updateFeedbackStatus(feedbackId, status) {
    fetch('../php/update_feedback_status.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `feedbackId=${feedbackId}&status=${status}`,
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            // Optionally update UI or reload feedback list
            loadCustomerFeedback(); // Reload feedback after status update
        } else {
            alert('Failed to update feedback status: ' + data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    // Initially hide all sections except the buttons
    document.querySelectorAll('.admin-section').forEach(section => {
        section.style.display = 'none';
    });
    loadFoodItems();

    const addFoodItemForm = document.getElementById('addFoodItemForm');
    addFoodItemForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const submitButton = document.querySelector('#submitButton');
        if (submitButton.innerText === 'Update Food Item') {
            const itemId = document.getElementById('foodItemId').value;
            updateFoodItem(itemId);
        } else {
            addFoodItem();
        }
    });
});

function changePassword() {
    const form = document.getElementById('changePasswordForm');
    const formData = new FormData(form);

    fetch('../php/change_password.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            form.reset();
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
}

function togglePassword() {
    var showPasswordCheckboxes = document.querySelectorAll('#showPassword, #showPasswordChangePassword');
    
    showPasswordCheckboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
            // Find all password input fields in the form containing the checkbox
            var form = checkbox.closest('form');
            var passwordFields = form.querySelectorAll('input[type="password"]');
            
            // Change the type of each password field to text
            passwordFields.forEach(function (field) {
                field.type = 'text';
            });
        } else {
            // Find all text input fields in the form containing the checkbox
            var form = checkbox.closest('form');
            var textFields = form.querySelectorAll('input[type="text"]');
            
            // Change the type of each text field to password if it has a password name
            textFields.forEach(function (field) {
                if (field.name.toLowerCase().includes('password')) {
                    field.type = 'password';
                }
            });
        }
    });
}
