const  Tables = [
     `CREATE TABLE IF NOT EXISTS roles (
        id INT(255) PRIMARY KEY AUTO_INCREMENT ,
        name varchar(45) UNIQUE,
        description TEXT 
    );
    `,
    `CREATE TABLE IF NOT EXISTS accounts (
        id INT(255)  AUTO_INCREMENT PRIMARY KEY , 
        username VARCHAR(45) UNIQUE NOT NULL ,
        password VARCHAR(45) NOT NULL ,
        nickname VARCHAR(45) NOT NULL DEFAULT 'anonymous',
        role_id INT(255) default 1 ,
        phone VARCHAR(45) NOT NULL ,
        super_admin BOOLEAN DEFAULT FALSE,
        last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
        FOREIGN KEY (role_id) REFERENCES roles(id)  ON DELETE RESTRICT

    );
    `,
   
    `CREATE TABLE IF NOT EXISTS permissions (
        id INT  PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,      
        description TEXT NOT NULL ,
        category VARCHAR (45) not null default 'general',
        ar_name VARCHAR(45) NOT NULL default 'صلاحية غير محددة الأسـم'
    );
    `,
    `CREATE TABLE IF NOT EXISTS role_permissions(
        role_id int (255) NOT NULL,
        permission_id int (255) NOT NULL ,
        PRIMARY KEY (role_id , permission_id),
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE ,
        FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE 

    );
    `,
    `CREATE TABLE IF NOT EXISTS extra_permissions(
        id INT (255) AUTO_INCREMENT PRIMARY KEY,
        user_id INT(255) NOT NULL,
        permission_id INT(255) NOT NULL , 
        type ENUM('allow' , 'deny') NOT NULL ,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
        FOREIGN KEY (user_id) REFERENCES accounts(id) ON DELETE CASCADE ,
        FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
        UNIQUE(user_id , permission_id)

    );
    `
    
    
]
export default Tables