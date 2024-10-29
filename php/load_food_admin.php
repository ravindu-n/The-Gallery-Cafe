<?php
// Display errors for debugging purposes
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include your database connection
include 'db_connection.php';

// Check if category parameter is set
$category = isset($_GET['category']) ? $_GET['category'] : '';

// Prepare and execute the SQL query based on category
if ($category) {
    $stmt = $conn->prepare("SELECT id, fType, fName, quantity, fPrice, fDescription, fImage FROM foodmenu WHERE fType = ?");
    $stmt->bind_param("s", $category);
} else {
    $stmt = $conn->prepare("SELECT id, fType, fName, quantity, fPrice, fDescription, fImage FROM foodmenu");
}

$stmt->execute();

// Get the result set
$result = $stmt->get_result();

// Initialize an array to store food items
$foodItems = [];

// Fetch each row as an associative array
while ($row = $result->fetch_assoc()) {
    $foodItems[] = $row;
}

// Close the statement and database connection
$stmt->close();
$conn->close();

// Set response header to JSON
header('Content-Type: application/json');

// Return JSON response
echo json_encode(['success' => true, 'foodItems' => $foodItems]);
?>
