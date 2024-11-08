<?php
require 'connect.php'; // Include your connection file

// Check if the form is submitted
if (isset($_POST["submit"])) {
    // Receive form data and sanitize it
    $username = htmlspecialchars(trim($_POST["username"]));
    $password = htmlspecialchars(trim($_POST['password']));

    // Basic validation
    if (empty($username) || empty($password)) {
        echo "<script> alert('Username and password cannot be empty.'); </script>";
        exit;
    }

    // Hash the password before storing it (for security)
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Use a prepared statement to prevent SQL injection
    if ($stmt = $conn->prepare("INSERT INTO tb_data (username, password) VALUES (?, ?)")) {
        $stmt->bind_param("ss", $username, $hashedPassword); // Bind parameters

        // Execute the query
        if ($stmt->execute()) {
            echo "<script> alert('Data Inserted Successfully'); </script>";
        } else {
            echo "<script> alert('Error: " . $stmt->error . "'); </script>";
        }

        // Close the statement
        $stmt->close();
    } else {
        echo "<script> alert('Error preparing statement: " . $conn->error . "'); </script>";
    }

    // Close the database connection
    $conn->close();
}
?>
