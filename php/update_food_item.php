<?php
include 'db_connection.php';  // Adjust the path as needed

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = intval($_POST['id']);
    $fType = $_POST['fType'];
    $fName = $_POST['fName'];
    $fDescription = $_POST['fDescription'];
    $fPrice = floatval($_POST['fPrice']);
    $quantity = intval($_POST['quantity']);

    $stmt = $conn->prepare("UPDATE foodmenu SET fType = ?, fName = ?, fDescription = ?, fPrice = ?, quantity = ? WHERE id = ?");
    $stmt->bind_param("sssdii", $fType, $fName, $fDescription, $fPrice, $quantity, $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update food item.']);
    }
    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
}

$conn->close();
?>
