<?php
require 'db_connection.php';
header('Content-Type: application/json');

$response = ['success' => false];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $orderOption = $_POST['orderOption'];
    $paymentMethod = $_POST['paymentMethod'];
    $address = $_POST['address'];
    $totalAmount = $_POST['totalAmount'];
    $items = $_POST['items'];

    // Validate the received data
    if (empty($orderOption) || empty($paymentMethod) || empty($totalAmount) || empty($items)) {
        $response['error'] = 'Missing required fields';
        echo json_encode($response);
        exit;
    }

    // Insert order into orders table
    $insertOrderQuery = "INSERT INTO orders (orderOption, customerAddress, paymentMethod, totalAmount) VALUES (?, ?, ?, ?)";
    $stmtOrder = $conn->prepare($insertOrderQuery);
    $stmtOrder->bind_param("sssd", $orderOption, $address, $paymentMethod, $totalAmount);

    if ($stmtOrder->execute()) {
        $orderId = $stmtOrder->insert_id;

        // Insert each item into orderitems table
        $insertItemQuery = "INSERT INTO orderitems (fName, quantity, price, orderId) VALUES (?, ?, ?, ?)";
        $stmtItem = $conn->prepare($insertItemQuery);

        foreach ($items as $item) {
            $stmtItem->bind_param("sidi", $item['fName'], $item['quantity'], $item['price'], $orderId);
            if (!$stmtItem->execute()) {
                error_log("Failed to insert order item: " . $stmtItem->error);
                $response['error'] = 'Failed to insert order item';
                echo json_encode($response);
                exit;
            }
        }

        $response['success'] = true;
    } else {
        error_log("Failed to insert order: " . $stmtOrder->error);
        $response['error'] = 'Failed to insert order';
    }

    $stmtOrder->close();
    $stmtItem->close();
    $conn->close();
} else {
    $response['error'] = 'Invalid request method';
}

echo json_encode($response);
?>
