<?php
header('Content-Type: application/json');
require 'db_connection.php';

$feedbackId = $_GET['id'];

$response = [];

// Update feedback status to 'denied' in the database
$sql = "UPDATE feedback SET status = 'denied' WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $feedbackId);

if ($stmt->execute()) {
    $response['success'] = true;
} else {
    $response['success'] = false;
    $response['message'] = "Failed to deny feedback.";
}

$stmt->close();
$conn->close();

echo json_encode($response);
?>
