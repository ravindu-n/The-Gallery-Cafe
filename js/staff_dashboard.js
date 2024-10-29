document.addEventListener('DOMContentLoaded', function() {
    loadOrders();
    loadReservations();
    setInterval(loadOrders, 30000); // Poll orders every 30 seconds
    setInterval(loadReservations, 30000); // Poll reservations every 30 seconds
});

function showSection(sectionId) {
    const sections = document.querySelectorAll('.staff-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
}

function loadOrders() {
    fetch('../php/load_orders.php')
        .then(response => response.json())
        .then(data => {
            const ordersTableBody = document.getElementById('ordersTable').querySelector('tbody');
            ordersTableBody.innerHTML = '';

            if (data.error) {
                console.error('Error fetching orders:', data.error);
                return;
            }

            data.forEach(order => {
                const orderRow = document.createElement('tr');
                const itemsDetail = order.items.map(item => `${item.quantity} x ${item.fName} - $${(item.price * item.quantity).toFixed(2)}`).join('<br>');
                const totalPrice = order.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
            
                let actionButtons = '';
                if (order.status === 'Pending') {
                    actionButtons = `<button onclick="updateOrderStatus(${order.orderId}, 'Completed')">Mark as Completed</button>`;
                }
            
                orderRow.innerHTML = `
                    <td>${order.orderId}</td>
                    <td>${order.customerAddress}</td>
                    <td>${itemsDetail}</td>
                    <td>$${totalPrice}</td>
                    <td>${order.status}</td>
                    <td>${actionButtons}</td>
                `;
            
                ordersTableBody.appendChild(orderRow);
            });            
        })
        .catch(error => {
            console.error('Error fetching orders:', error);
        });
}

function loadReservations() {
    fetch('../php/load_reservations.php')
        .then(response => response.json())
        .then(data => {
            const reservationsTableBody = document.getElementById('reservationsTable').querySelector('tbody');
            reservationsTableBody.innerHTML = '';

            if (data.error) {
                console.error('Error fetching reservations:', data.error);
                return;
            }

            data.forEach(reservation => {
                let actionButtons = '';
                if (reservation.status === 'Pending') {
                    actionButtons = `
                        <button onclick="updateReservationStatus(${reservation.id}, 'Confirmed')">Confirm</button>
                        <button onclick="updateReservationStatus(${reservation.id}, 'Cancelled')" style="margin-top: 10px;">Cancel</button>
                    `;
                }

                const reservationRow = document.createElement('tr');
                reservationRow.innerHTML = `
                    <td>${reservation.id}</td>
                    <td>${reservation.customerName}</td>
                    <td>${reservation.date}</td>
                    <td>${reservation.time}</td>
                    <td>${reservation.guests}</td>
                    <td>${reservation.status}</td>
                    <td>${actionButtons}</td>
                `;
                reservationsTableBody.appendChild(reservationRow);
            });
        })
        .catch(error => {
            console.error('Error fetching reservations:', error);
        });
}

function updateOrderStatus(orderId, status) {
    fetch(`../php/update_order_status.php?id=${orderId}&status=${status}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`Order ${orderId} marked as ${status}`);
                loadOrders();
            } else {
                alert('Failed to update order status.');
            }
        })
        .catch(error => {
            console.error('Error updating order status:', error);
        });
}

function updateReservationStatus(reservationId, status) {
    fetch(`../php/update_reservation_status.php?id=${reservationId}&status=${status}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`Reservation ${reservationId} marked as ${status}`);
                loadReservations();
            } else {
                alert('Failed to update reservation status.');
            }
        })
        .catch(error => {
            console.error('Error updating reservation status:', error);
        });
}
