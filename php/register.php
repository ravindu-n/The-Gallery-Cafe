<?php
require_once 'db_connection.php';

$fullName = $_POST['fullName'];
$username = $_POST['username'];
$email = $_POST['email'];
$password = $_POST['password'];

// Hash the password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Define the user role
$userRole = 'customer';

$sql = "SELECT * FROM user WHERE uName = ? OR email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('ss', $username, $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $response = ['status' => 'error', 'message' => 'Username or Email already exists.'];
} else {
    $sql = "INSERT INTO user (fName, email, uName, uRole, pWord) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sssss', $fullName, $email, $username, $userRole, $hashedPassword);
    
    if ($stmt->execute()) {
        $response = ['status' => 'success', 'message' => 'User registered successfully.'];
    } else {
        $response = ['status' => 'error', 'message' => 'Failed to register user.'];
    }
}

header('Content-Type: application/json');
echo json_encode($response);

$conn->close();
?>
