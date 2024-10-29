document.addEventListener('DOMContentLoaded', function() {
    displayMenu();
    displayCurrentOrder();
    displayReviews();
});

let order = []; // Define the order array
let reviews = []; // Define the reviews array

function displayParkingAvailability() {
    const mainContent = document.querySelector('.main-content');
    const parkingMessage = document.createElement('p');
    parkingMessage.textContent = 'Parking is available.';
    mainContent.insertBefore(parkingMessage, mainContent.firstChild);
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.customer-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
}

function displayMenu() {
    fetch('../php/load_food_customer.php')
        .then(response => response.json())
        .then(menuData => {
            console.log('Received menuData:', menuData); // Log received data

            const foodMenu = document.getElementById('food-menu');
            foodMenu.innerHTML = '';

            menuData.forEach(food => {
                const foodItem = document.createElement('div');
                foodItem.classList.add('food-item');
                const price = parseFloat(food.fPrice); // Convert fPrice to a number
                
                // Determine the image type from the base64 data
                const imageType = food.fImage.startsWith('/9j/') ? 'image/jpeg' : 'image/png';

                foodItem.innerHTML = `
                    <img src="data:${imageType};base64,${food.fImage}" alt="${food.fName}">
                    <div>
                        <h4>${food.fName}</h4>
                        <p><strong>Price: $${price.toFixed(2)}</strong></p>
                        <button onclick="addToOrder('${food.fName}', ${price})">Add to Order</button>
                    </div>
                `;
                foodMenu.appendChild(foodItem);
            });
        })
        .catch(error => console.error('Error fetching food items:', error));
}

function addToOrder(foodName, foodPrice) {
    const foodItem = order.find(item => item.food === foodName);
    if (foodItem) {
        foodItem.quantity++;
    } else {
        order.push({ food: foodName, price: foodPrice, quantity: 1 });
    }
    displayCurrentOrder();
}

function displayCurrentOrder() {
    const currentOrderList = document.getElementById('currentOrder');
    currentOrderList.innerHTML = '';
    let total = 0;

    order.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.quantity} x ${item.food} - $${(item.quantity * item.price).toFixed(2)}`;
        currentOrderList.appendChild(listItem);
        total += item.quantity * item.price;
    });

    const totalPrice = order.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalItem = document.createElement('li');
    totalItem.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
    currentOrderList.appendChild(totalItem);
}

function submitOrder() {
    alert('Order submitted!');
    order = [];
    displayCurrentOrder();
}

function reserve(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const guests = document.getElementById('guests').value;
    const tableCapacity = document.getElementById('tableCapacity').value;

    const errorMessage = document.getElementById('reservationError');

    errorMessage.textContent = '';

    if (name === '' || date === '' || time === '' || guests === '' || tableCapacity === '') {
        errorMessage.textContent = 'Please fill in all fields.';
        return;
    }

    const currentDate = new Date();
    const selectedDate = new Date(date + 'T' + time);

    if (selectedDate < currentDate) {
        errorMessage.textContent = 'Selected date and time cannot be in the past.';
        return;
    }

    // Prepare data to send via AJAX
    const formData = new FormData();
    formData.append('name', name);
    formData.append('date', date);
    formData.append('time', time);
    formData.append('guests', guests);
    formData.append('tableCapacity', tableCapacity);

    // AJAX request to send reservation data
    fetch('../php/process_reservation.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Reservation made successfully!');
            document.getElementById('reservationForm').reset();
        } else {
            errorMessage.textContent = 'Failed to make reservation. Please try again later.';
        }
    })
    .catch(error => {
        console.error('Error making reservation:', error);
        errorMessage.textContent = 'Failed to make reservation. Please try again later.';
    });
}

function completeCheckout(event) {
    event.preventDefault();

    const deliveryOption = document.getElementById('deliveryOption').value;
    const paymentMethod = document.getElementById('paymentMethod').value;
    const address = document.getElementById('address').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;

    if (deliveryOption === 'delivery' && address === '') {
        alert('Please enter a delivery address.');
        return;
    }

    if (paymentMethod === 'card' && (cardNumber === '' || expiryDate === '' || cvv === '')) {
        alert('Please enter card details.');
        return;
    }

    // Prepare data to send via AJAX
    const formData = new FormData();
    formData.append('orderOption', deliveryOption);
    formData.append('paymentMethod', paymentMethod);
    formData.append('address', address);
    formData.append('totalAmount', order.reduce((total, item) => total + (item.price * item.quantity), 0));

    // Add order items to formData
    order.forEach((item, index) => {
        formData.append(`items[${index}][fName]`, item.food);
        formData.append(`items[${index}][quantity]`, item.quantity);
        formData.append(`items[${index}][price]`, item.price);
    });

    fetch('../php/process_order.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Order completed successfully!');
            order = [];
            displayCurrentOrder();
            document.getElementById('checkoutSection').style.display = 'none';
        } else {
            alert('Failed to complete order. Please try again later.');
        }
    })
    .catch(error => {
        console.error('Error processing order:', error);
        alert('Failed to complete order. Please try again later.');
    });
}

function initiateCheckout() {
    const checkoutSection = document.getElementById('checkoutSection');
    checkoutSection.style.display = 'block';

    const deliveryOption = document.getElementById('deliveryOption');
    deliveryOption.removeEventListener('change', deliveryOptionChangeHandler);
    deliveryOption.addEventListener('change', deliveryOptionChangeHandler);

    const paymentMethod = document.getElementById('paymentMethod');
    paymentMethod.removeEventListener('change', paymentMethodChangeHandler);
    paymentMethod.addEventListener('change', paymentMethodChangeHandler);

    deliveryOptionChangeHandler();
    paymentMethodChangeHandler();
}

function deliveryOptionChangeHandler() {
    const deliveryOption = document.getElementById('deliveryOption').value;
    const deliveryAddressSection = document.getElementById('deliveryAddressSection');
    const paymentMethod = document.getElementById('paymentMethod');
    
    deliveryAddressSection.style.display = (deliveryOption === 'delivery') ? 'block' : 'none';

    const cashOption = paymentMethod.querySelector('option[value="cash"]');
    cashOption.textContent = (deliveryOption === 'takeaway') ? 'Cash' : 'Cash on Delivery';
}

function paymentMethodChangeHandler() {
    const paymentMethod = document.getElementById('paymentMethod').value;
    const cardDetailsSection = document.getElementById('cardDetailsSection');
    cardDetailsSection.style.display = (paymentMethod === 'card') ? 'block' : 'none';
}

function submitFeedback(event) {
    event.preventDefault();
    const name = document.getElementById('Name').value;
    const email = document.getElementById('email').value;
    const rating = document.getElementById('rating').value;
    const review = document.getElementById('review').value;

    // Prepare data to send via AJAX
    const formData = new FormData();
    formData.append('Name', name);
    formData.append('email', email);
    formData.append('rating', rating);
    formData.append('review', review);

    // AJAX request to send feedback data
    fetch('../php/add_feedback.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Feedback submitted successfully!');
            document.getElementById('feedbackForm').reset();
            displayReviews(); // Refresh reviews after submission
        } else {
            alert('Failed to submit feedback. Please try again later.');
        }
    })
    .catch(error => {
        console.error('Error submitting feedback:', error);
        alert('Failed to submit feedback. Please try again later.');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    displayReviews(); // Display initial reviews when the page loads
});

function displayReviews() {
    fetch('../php/load_customer_feedback.php')
        .then(response => response.json())
        .then(data => {
            const reviewSection = document.getElementById('reviewSection');
            reviewSection.innerHTML = '';

            if (data.length === 0) {
                const noReviewsMessage = document.createElement('p');
                noReviewsMessage.textContent = 'No reviews yet.';
                reviewSection.appendChild(noReviewsMessage);
            } else {
                data.forEach(review => {
                    const reviewDiv = document.createElement('div');
                    reviewDiv.classList.add('review');

                    const namePara = document.createElement('p');
                    namePara.textContent = `Name: ${review.Name}`;
                    reviewDiv.appendChild(namePara);

                    const emailPara = document.createElement('p');
                    emailPara.textContent = `Email: ${review.email}`;
                    reviewDiv.appendChild(emailPara);

                    const ratingPara = document.createElement('p');
                    ratingPara.textContent = `Rating: ${review.rating}`;
                    reviewDiv.appendChild(ratingPara);

                    const reviewPara = document.createElement('p');
                    reviewPara.textContent = `Review: ${review.review}`;
                    reviewDiv.appendChild(reviewPara);

                    reviewSection.appendChild(reviewDiv);
                });
            }
        })
        .catch(error => console.error('Error fetching reviews:', error));
}
