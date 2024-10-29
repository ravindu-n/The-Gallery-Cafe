<?php
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['id'])) {
include 'database_connection.php';

    $id = $_GET['id'];

    // Prepare SQL query to select food item by id
    $query = "SELECT * FROM foodmenu WHERE id = $id";
    $result = mysqli_query($conn, $query);

    if ($result) {
        $foodItem = mysqli_fetch_assoc($result);
        echo json_encode(['success' => true, 'foodItem' => $foodItem]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to retrieve food item']);
    }

    mysqli_close($conn);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}
?>
