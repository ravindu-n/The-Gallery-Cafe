<?php
// Include database connection
require_once 'db_connection.php';

// Fetch all food items
$sql = "SELECT fType, fName, fPrice, fImage FROM foodmenu";
$result = $conn->query($sql);

$foodItems = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $foodItems[] = array(
            'fType' => $row['fType'],
            'fName' => $row['fName'],
            'fPrice' => $row['fPrice'],
            'fImage' => $row['fImage']
        );
    }
}

echo json_encode($foodItems);

// Close the database connection
$conn->close();
?>
