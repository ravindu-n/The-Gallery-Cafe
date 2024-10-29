<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    include 'db_connection.php'; 

    $fType = $_POST['fType'];
    $fName = $_POST['fName'];
    $fDescription = $_POST['fDescription'];
    $fPrice = $_POST['fPrice'];
    $quantity = $_POST['quantity'];
    $fImage = ''; 

    if (isset($_FILES['fImage']) && $_FILES['fImage']['error'] === UPLOAD_ERR_OK) {
        $imageData = file_get_contents($_FILES['fImage']['tmp_name']);
        $fImage = base64_encode($imageData);
    }

    $stmt = $conn->prepare("INSERT INTO foodMenu (fType, fName, fDescription, fPrice, quantity, fImage) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssdis", $fType, $fName, $fDescription, $fPrice, $quantity, $fImage);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => $stmt->error]);
    }
    $stmt->close();
    $conn->close();
}
?>
