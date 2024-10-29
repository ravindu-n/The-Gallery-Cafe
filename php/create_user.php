<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    include 'db_connection.php';

    $fName = $_POST['fName'];
    $email = $_POST['email'];
    $uName = $_POST['uName'];
    $uRole = $_POST['uRole'];
    $pWord = password_hash($_POST['pWord'], PASSWORD_BCRYPT);

    $stmt = $conn->prepare("INSERT INTO user (fName, email, uName, uRole, pWord) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $fName, $email, $uName, $uRole, $pWord);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => $stmt->error]);
    }
    $stmt->close();
    $conn->close();
}
?>
