<?php
header('Content-Type: application/json');
require 'db_connection.php';

// SQL query to fetch feedback data where status is 'allowed'
$sql = "SELECT uName AS Name, email, feedback AS review FROM feedback WHERE status = 'allowed'";
$result = $conn->query($sql);

$reviews = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $row['rating'] = "5"; // Dummy rating, adjust based on your database schema
        $reviews[] = $row;
    }
}

$conn->close();

echo json_encode($reviews);
?>
