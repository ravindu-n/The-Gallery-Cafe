<?php
header('Content-Type: application/json');
include 'db_connection.php';

$query = "SELECT * FROM reservations";
$result = mysqli_query($conn, $query);

if (!$result) {
    echo json_encode(['error' => 'Query failed: ' . mysqli_error($conn)]);
    exit;
}

$reservations = array();
while ($row = mysqli_fetch_assoc($result)) {
    $reservations[] = array(
        'id' => $row['id'],
        'customerName' => $row['name'],
        'date' => $row['rDate'],
        'time' => $row['rTime'],
        'guests' => $row['guests'],
        'status' => $row['status'] // Using 'status' column for reservation status
    );
}

echo json_encode($reservations);
mysqli_close($conn);
?>
