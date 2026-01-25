const  Tables = [
     `CREATE TABLE IF NOT EXISTS roles (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT ,
        name varchar(45) UNIQUE,
        description TEXT 
    );
    `,
    `CREATE TABLE IF NOT EXISTS accounts (
        id INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY , 
        username VARCHAR(45) UNIQUE NOT NULL ,
        password VARCHAR(45) NOT NULL ,
        nickname VARCHAR(45) NOT NULL DEFAULT 'anonymous',
        role_id INT UNSIGNED default 1 ,
        phone VARCHAR(45) NOT NULL ,
        super_admin BOOLEAN DEFAULT FALSE,
        last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
        FOREIGN KEY (role_id) REFERENCES roles(id)  ON DELETE RESTRICT

    );
    `,
   
    `CREATE TABLE IF NOT EXISTS permissions (
        id INT UNSIGNED  NOT NULL PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,      
        description TEXT NOT NULL ,
        category VARCHAR (45) not null default 'general',
        ar_name VARCHAR(45) NOT NULL default 'صلاحية غير محددة الأسـم'
    );
    `,
    `CREATE TABLE IF NOT EXISTS role_permissions(
        role_id INT UNSIGNED NOT NULL,
        permission_id INT UNSIGNED NOT NULL ,
        PRIMARY KEY (role_id , permission_id),
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE ,
        FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE 

    );
    `,
    `CREATE TABLE IF NOT EXISTS extra_permissions(
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        permission_id INT UNSIGNED NOT NULL , 
        type ENUM('allow' , 'deny') NOT NULL ,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
        FOREIGN KEY (user_id) REFERENCES accounts(id) ON DELETE CASCADE ,
        FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
        UNIQUE(user_id , permission_id)

    );
    `,
    `CREATE TABLE IF NOT EXISTS products(
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
        name VARCHAR(45) NOT NULL ,
        ar_name VARCHAR(45) NOT NULL , 
        description TEXT ,
        category_id INT UNSIGNED DEFAULT 1 , 
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
        INDEX idx_product_name (name),
        INDEX idx_product_ar_name (ar_name)

    );
    `,
    `CREATE TABLE IF NOT EXISTS product_batches(
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        product_id INT UNSIGNED NOT NULL ,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE, 
        unit_id INT UNSIGNED NOT NULL , 
        expiry_date DATE NOT NULL DEFAULT "2100-01-01",
        cost_price DECIMAL (10,2) NOT NULL , 
        selling_price DECIMAL (10,2) NOT NULL , 
        stock DECIMAL (10,3) NOT NULL DEFAULT 0,
        barcode VARCHAR(45) UNIQUE,
        status ENUM("active" , "sold_out"  , "expired" , "archieved" ) DEFAULT "active",
        created_by INT UNSIGNED ,
        FOREIGN KEY (created_by) REFERENCES accounts(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
        INDEX idx_product_id (product_id),
        INDEX idx_expiry_date (expiry_date),
        INDEX idx_stock (stock),
        INDEX idx_barcode (barcode),
        INDEX idx_selling_price (selling_price)

    ); 
    `,
    `CREATE TABLE IF NOT EXISTS units (
        id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT , 
        name VARCHAR (45) NOT NULL ,
        ar_name VARCHAR(45) NOT NULL , 
        description VARCHAR (255)
    );
    `,
    `CREATE TABLE IF NOT EXISTS product_units (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY ,
        product_id INT UNSIGNED NOT NULL ,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE  ,
        unit_id INT UNSIGNED NOT NULL, 
        FOREIGN KEY (unit_id) REFERENCES units(id)  ON DELETE RESTRICT ,
        quantity_in_base DECIMAL (10 , 3) NOT NULL DEFAULT 1,
        selling_price DECIMAL (10 , 2) NOT NULL,
        UNIQUE(unit_id , product_id)


    );
    `
    
    
]
export default Tables