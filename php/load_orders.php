<?php
header('Content-Type: application/json');
include 'db_connection.php';

$response = [];

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    // Fetch all orders along with their items
    $query = "
        SELECT 
            o.orderId, 
            o.orderOption, 
            o.customerAddress, 
            o.paymentMethod, 
            o.totalAmount, 
            o.status,
            oi.fName, 
            oi.quantity, 
            oi.price 
        FROM 
            orders o
        LEFT JOIN 
            orderitems oi 
        ON 
            o.orderId = oi.orderId
        ORDER BY 
            o.orderId
    ";
    $result = $conn->query($query);

    $orders = [];
    
    while ($row = $result->fetch_assoc()) {
        $orderId = $row['orderId'];

        if (!isset($orders[$orderId])) {
            $orders[$orderId] = [
                'orderId' => $row['orderId'],
                'orderOption' => $row['orderOption'],
                'customerAddress' => $row['customerAddress'],
                'paymentMethod' => $row['paymentMethod'],
                'totalAmount' => $row['totalAmount'],
                'status' => $row['status'],
                'items' => []
            ];
        }

        $orders[$orderId]['items'][] = [
            'fName' => $row['fName'],
            'quantity' => $row['quantity'],
            'price' => $row['price']
        ];
    }

    $response = array_values($orders);

} catch (mysqli_sql_exception $e) {
    error_log($e->getMessage(), 0);
    $response = ['error' => 'Database error: ' . $e->getMessage()];
} finally {
    $conn->close();
}

echo json_encode($response);
?>
