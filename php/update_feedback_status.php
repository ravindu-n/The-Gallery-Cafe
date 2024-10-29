<?php
header('Content-Type: application/json');
require 'db_connection.php';

$feedbackId = $_POST['feedbackId'];
$status = $_POST['status'];

$response = [];

// Update feedback status in the database
$sql = "UPDATE feedback SET status = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $status, $feedbackId);

if ($stmt->execute()) {
    $response['success'] = true;
    $response['message'] = 'Feedback status updated successfully.';
} else {
    $response['success'] = false;
    $response['message'] = 'Failed to update feedback status.';
}

$stmt->close();
$conn->close();

echo json_encode($response);
?>
