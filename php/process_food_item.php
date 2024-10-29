<?php
// Connect to database (assuming you have a db_connection.php or similar)
require_once 'db_connection.php';

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate and sanitize inputs (simplified example)
    $fType = $_POST['fType'];
    $fName = $_POST['fName'];
    $fDescription = $_POST['fDescription'];
    $fPrice = $_POST['fPrice'];
    $quantity = $_POST['quantity'];

    // File upload handling
    $fImage = $_FILES['fImage']['name'];
    $targetDir = "uploads/"; // Directory where images will be stored
    $targetFile = $targetDir . basename($_FILES["fImage"]["name"]);
    move_uploaded_file($_FILES["fImage"]["tmp_name"], $targetFile);

    // Insert into database
    $sql = "INSERT INTO foodmenu (fType, fName, fDescription, fPrice, quantity, fImage) 
            VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$fType, $fName, $fDescription, $fPrice, $quantity, $targetFile]);

    // Redirect or display success message
    header("Location: admin_dashboard.html");
    exit();
}
?>
