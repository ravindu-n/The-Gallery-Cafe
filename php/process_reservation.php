<?php
// Include your database connection
require_once 'db_connection.php';

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate and sanitize inputs
    $name = $_POST['name'];
    $date = $_POST['date'];
    $time = $_POST['time'];
    $guests = $_POST['guests'];
    $tableCapacity = $_POST['tableCapacity'];

    // Validate inputs (additional validation can be added as per your requirements)
    if (empty($name) || empty($date) || empty($time) || empty($guests) || empty($tableCapacity)) {
        echo json_encode(['success' => false, 'message' => 'Please fill in all fields.']);
        exit;
    }

    // Example SQL query to insert into reservations table
    $sql = "INSERT INTO reservations (name, rDate, rTime, guests, tableCapacity) 
            VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssi", $name, $date, $time, $guests, $tableCapacity);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to make reservation.']);
    }

    // Close statement and database connection
    $stmt->close();
    $conn->close();
}
?>
