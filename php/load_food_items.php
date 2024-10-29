<?php
// Display errors for debugging purposes
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include your database connection
include 'db_connection.php';

// Check if category parameter or search term is set
$category = isset($_GET['category']) ? $_GET['category'] : '';
$searchTerm = isset($_GET['search']) ? $_GET['search'] : '';

$foodItems = [];

if (!empty($category)) {
    $stmt = $conn->prepare("SELECT id, fType, fName, quantity, fPrice, fDescription, fImage FROM foodmenu WHERE fType = ?");
    $stmt->bind_param("s", $category);
} else if (!empty($searchTerm)) {
    $stmt = $conn->prepare("SELECT id, fType, fName, quantity, fPrice, fDescription, fImage FROM foodmenu WHERE LOWER(fName) LIKE ? OR LOWER(fDescription) LIKE ?");
    $searchTerm = "%{$searchTerm}%";
    $stmt->bind_param("ss", $searchTerm, $searchTerm);
} else {
    echo json_encode(['success' => false, 'message' => 'No category or search term provided']);
    exit; 
}

$stmt->execute();

$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    $foodItems[] = $row;
}

$stmt->close();
$conn->close();

header('Content-Type: application/json');

echo json_encode(['success' => true, 'foodItems' => $foodItems]);
?>
