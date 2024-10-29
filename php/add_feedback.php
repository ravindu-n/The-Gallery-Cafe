<?php
header('Content-Type: application/json');
require 'db_connection.php';

$name = $_POST['Name'];
$email = $_POST['email'];
$rating = $_POST['rating'];
$review = $_POST['review'];

$response = [];

if (empty($name) || empty($email) || empty($rating) || empty($review)) {
    $response['success'] = false;
    echo json_encode($response);
    exit;
}

$sql = "INSERT INTO feedback (uName, email, feedback) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $name, $email, $review);

if ($stmt->execute()) {
    $response['success'] = true;
} else {
    $response['success'] = false;
}

$stmt->close();
$conn->close();

echo json_encode($response);
?>
