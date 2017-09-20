DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
	item_id INT (11) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(50) NULL,
	department_name VARCHAR(50) NOT NULL,
	price FLOAT(10,2) NOT NULL,
	stock_quantity INT DEFAULT 0,
	PRIMARY KEY (item_id)
);


-- Creates new rows
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Pampers", "Baby", 25, 25),
		("Samsung 52-in TV", "Electronics", 525, 2),
		("Babywipes", "Baby", 10, 125),
		("Royal Bath Towels", "Bath", 8, 50),
		("Royal Hand Towels", "Bath", 5, 50),
		("Royal Washcloths", "Bath", 2.50, 75),
		("HP Laptop", "Electronics", 349.99, 10),
		("Alarm Clock", "Electronics", 10, 25),
		("Hover Board", "Toys", 25, 25),
		("BMX Bicycle", "Toys", 25, 25),
		("Barbie", "Toys", 25, 25);
        
select * from products;