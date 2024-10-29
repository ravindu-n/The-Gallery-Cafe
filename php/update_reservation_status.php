<?php
header('Content-Type: application/json');
include 'db_connection.php';

$reservationId = $_GET['id'];
$status = $_GET['status'];

if (!isset($reservationId) || !isset($status)) {
    echo json_encode(['error' => 'Missing required parameters.']);
    exit;
}

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $query = "UPDATE reservations SET status = ? WHERE id = ?";
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "si", $status, $reservationId);
    mysqli_stmt_execute($stmt);

    if (mysqli_stmt_affected_rows($stmt) > 0) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Failed to update reservation status.']);
    }
} catch (mysqli_sql_exception $e) {
    error_log($e->getMessage(), 0);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} finally {
    mysqli_close($conn);
}
?>
