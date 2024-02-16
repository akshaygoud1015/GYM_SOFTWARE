######################  GYM SOFTWARE   ################################

1. npm init ( change entry point to main.js)
2. npm install --save-dev electron
3. npm install bootstrap@5.3.2
4. npm install sqlite3



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


npx electron main.js