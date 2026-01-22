const  Tables = [
    `CREATE TABLE IF NOT EXISTS accounts (
        id INT(255)  AUTO_INCREMENT PRIMARY KEY , 
        username VARCHAR(45) UNIQUE NOT NULL ,
        password VARCHAR(45) NOT NULL ,
        nickname VARCHAR(45) UNIQUE NOT NULL DEFAULT 'user',
        role VARCHAR(45) NOT NULL DEFAULT 'normal',
        phone VARCHAR(45) NOT NULL ,
        last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP()

    );
    `,
    `CREATE TABLE IF NOT EXISTS  products (
        id SERIAL PRIMARY KEY,           
        code VARCHAR(50) NOT NULL,      
        name VARCHAR(255) NOT NULL,       
        barcode VARCHAR(100),            
        category_id INT,                  
        brand VARCHAR(100),            
        unit VARCHAR(20) DEFAULT 'pcs',    
        tax_rate DECIMAL(5,2) DEFAULT 0, 
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );
    `,
    `CREATE TABLE IF NOT EXISTS permessions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,      
        category VARCHAR(50) NOT NULL    
    );
    `
    
    
]
export default Tables