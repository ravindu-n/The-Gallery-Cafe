<?php
header('Content-Type: application/json');
require 'db_connection.php';

$response = [];

// SQL query to fetch feedback data
$sql = "SELECT id, uName, email, feedback, status FROM feedback";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $feedbackArray = array();

    while ($row = $result->fetch_assoc()) {
        $feedbackArray[] = $row;
    }

    $response['success'] = true;
    $response['feedback'] = $feedbackArray;
} else {
    $response['success'] = false;
    $response['message'] = "No feedback found";
}

$result->close();
$conn->close();

echo json_encode($response);
?>
