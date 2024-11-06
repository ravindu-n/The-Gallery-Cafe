# The Gallery Cafe Website
A dynamic website for an online cafe, built with HTML, JavaScript, PHP, and CSS, using a MySQL database.
# About the Project
The Gallery Cafe is a web application designed to provide an easy-to-use online platform for customers to order food, make reservations, and submit feedback. The application also provides separate interfaces for admins and staff, allowing them to manage orders, users, and menu items. This project is built with PHP, HTML, JavaScript, and CSS, with a MySQL database handled through phpMyAdmin.
# Features
### Admin Features
* User Management: Create new users (admin and staff).
* Menu Management: Add, edit, and delete food items.
* Feedback Management: View customer feedback.
* Account Management: Change password.
### Staff Features
* Order Management: Process and manage customer orders.
* Reservation Management: Manage customer reservations.
### Customer Features
* Reservations: Make reservations online.
* Order Food: Select and order food items from the menu.
* Feedback: Submit feedback regarding food and service.
# Food Categories
The menu is organized into the following categories:<br>
* Sri Lankan
* Chinese
* Italian
* Desserts
* Beverages
# Navigation
The website includes six main navigation buttons:<br>
* Home
* Menu (with a search bar)
* Events & Promotions
* Login
* About Us
* Contact
# Technologies Used
* Frontend: HTML, JavaScript, CSS
* Backend: PHP
* Database: MySQL, managed via phpMyAdmin (XAMPP)
# Installation 
##### 1 Set Up XAMPP:
* Start Apache and MySQL in the XAMPP control panel.<br>
##### 2 Database Configuration:
* Open phpMyAdmin and create a new database, e.g., gallery_cafe_db.
* Import the provided SQL file into the database to set up tables and initial data.<br>
##### 3 Configure Database Connection:
* Edit the database configuration in the PHP files (e.g., config.php) to match your database credentials.<br>
##### 4 Launch the Application:
* Place the project files in the htdocs folder in XAMPP.
* Access the site by navigating to http://localhost/The_Gallery_Cafe/html/index.html in your browser.
# Usage
##### 1 Admin Login:
* Admins can create users, manage the menu, view feedback, and change their password.<br>
##### 2 Staff Login:
* Staff can log in to manage orders and reservations.<br>
##### 3 Customer Registration and Login:
* Customers must register to make reservations, order food, and leave feedback.<br>
##### 4 Navigation Buttons:
* Each user role has access to specific pages through the main navigation.
