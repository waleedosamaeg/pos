const records = [
    // add admin permissions 
    // admin_role_id = 3
    `INSERT INTO role_permissions (role_id , permission_id) values (3 , 1)`,
    `INSERT INTO role_permissions (role_id , permission_id) values (3 , 2)`,
    `INSERT INTO role_permissions (role_id , permission_id) values (3 , 3)`,
    `INSERT INTO role_permissions (role_id , permission_id) values (3 , 4)`,
    `INSERT INTO role_permissions (role_id , permission_id) values (3 , 6)`,
    `INSERT INTO role_permissions (role_id , permission_id) values (3 , 7)`,
    `INSERT INTO role_permissions (role_id , permission_id) values (3 , 8)`,
    `INSERT INTO role_permissions (role_id , permission_id) values (3 , 9)`,
    `INSERT INTO role_permissions (role_id , permission_id) values (3 , 10)`,
    
    // add manager permissions


    // add normal user permissions  
    // normal_role_id = 3
    `INSERT INTO role_permissions (role_id , permission_id) values ( 1, 7)`,


]
export default records