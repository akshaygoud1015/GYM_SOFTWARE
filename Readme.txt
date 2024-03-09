######################  GYM SOFTWARE   ################################

1. npm init ( change entry point to main.js)
2. npm install --save-dev electron
3. npm install bootstrap@5.3.2
4. npm install sqlite3
5. npm install pako


TABLE:|
CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name TEXT,
    mobile TEXT,
    gender TEXT,
    address TEXT,
    age INT,
    fee DECIMAL(10,2),
    payment_duration VARCHAR(50)
);

ALTER TABLE clients
ADD COLUMN date DATE;

ALTER TABLE clients
ADD COLUMN last_payment DATE,
ADD COLUMN validity DATE;

ALTER TABLE clients
ADD COLUMN image_data TEXT; 

CREATE TABLE payments (
    user_id INT NOT NULL,
    payment_date DATE NOT NULL,
    payment_type TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES clients(id)
);


CREATE TABLE staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    phone_number VARCHAR(15),
    alternate_phone_number VARCHAR(15),
    age INT,
    salary DECIMAL(10, 2),
    date_of_joining DATE
);


CREATE TABLE login (
    username TEXT NOT NULL,
    password TEXT NOT NULL
);

INSERT INTO login (username, password) VALUES ('owner', '123');
INSERT INTO login (username, password) VALUES ('trainer', 'trainer123');


CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expense_name VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    made_by VARCHAR(255) NOT NULL,
    expense_date DATE NOT NULL
);

npx electron main.js

