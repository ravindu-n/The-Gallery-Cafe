<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    include 'db_connection.php';

    $uName = $_POST['uName'];
    $oldPassword = $_POST['oldPassword'];
    $newPassword = $_POST['newPassword'];
    $confirmNewPassword = $_POST['confirmNewPassword'];

    // Validate inputs
    if (empty($uName) || empty($oldPassword) || empty($newPassword) || empty($confirmNewPassword)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required.']);
        exit;
    }

    if ($newPassword !== $confirmNewPassword) {
        echo json_encode(['success' => false, 'message' => 'New password and confirm password do not match.']);
        exit;
    }

    // Retrieve current password hash from database
    $stmt = $conn->prepare("SELECT pWord FROM user WHERE uName = ?");
    $stmt->bind_param("s", $uName);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 1) {
        $stmt->bind_result($hashedPassword);
        $stmt->fetch();

        // Verify old password
        if (password_verify($oldPassword, $hashedPassword)) {
            // Hash new password
            $newHashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

            // Update password in database
            $updateStmt = $conn->prepare("UPDATE user SET pWord = ? WHERE uName = ?");
            $updateStmt->bind_param("ss", $newHashedPassword, $uName);

            if ($updateStmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Password changed successfully.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Failed to update password.']);
            }
            $updateStmt->close();
        } else {
            echo json_encode(['success' => false, 'message' => 'Old password is incorrect.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'User not found.']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
