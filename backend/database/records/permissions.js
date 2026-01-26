const records = [
    // admin permissions 
    `INSERT INTO permissions (id , name , description , ar_name , category) values (1, 'create.account' , 'create new account with specific permissions' , "اضــافة مستخدم جديد" , 'employee')` ,
    `INSERT INTO permissions (id , name , description , ar_name , category) values (2, 'delete.account' , 'delete existing account ' , 'حذف مستخدم'  , 'employee')` ,
    `INSERT INTO permissions (id , name , description , ar_name , category) values (3, 'edit.account.settings' , 'edit account profile data ' , 'تعديل البيانات  المستخدم', 'employee') ` ,
    `INSERT INTO permissions (id , name , description , ar_name , category) values (4, 'edit.account.permissions' , 'edit account permissions (add / delete ) permission' , 'تعديل صلاحيات مستخدم' , 'employee') ` ,
    `INSERT INTO permissions (id , name , description , ar_name , category) values (5, 'deactivate.account' , 'deactivate existing account without deleting ' , 'ايقاف نشاط مستخدم' , 'employee')` ,
    `INSERT INTO permissions (id , name , description , ar_name , category) values (6, 'selling.reports' , 'show selling reports' , 'اظهار تقارير البيع' ,'reports')` ,
    `INSERT INTO permissions (id , name , description , ar_name , category) values (7, 'product.add' , 'add new product' , 'اضافة منتج جديد' ,'products')` ,
    `INSERT INTO permissions (id , name , description , ar_name , category) values (8, 'product.remove' , 'remove existing product' , 'حذف منتج ' ,'products')` ,
    `INSERT INTO permissions (id , name , description , ar_name , category) values (9, 'product.edit' , 'edit existing product' , 'تعديل بيانات منتج ' ,'products')` ,
    `INSERT INTO permissions (id , name , description , ar_name , category) values (10, 'product.activate' , 'deactivate existing product' , 'ايقاف منتج' ,'products')` ,
    `INSERT INTO permissions (id , name , description , ar_name , category) values (11, 'batch.add' , 'Add new Batch for product' , 'اضافة كمية جديدة من المنتج' ,'products')` ,

    
    //  manager permissions

    // general permeissions
    // `INSERT INTO permissions (id , name , description , ar_name , category) values ( 7 , 'sell' , 'selling items' , 'السماح بالبيع (بائع)' , 'general');` ,
    // `INSERT INTO permissions (id , name , description , ar_name , category) values ( 100 , 'test' , 'FOR TEST' , '4test' , 'general');` , // FOR TESTING 
 ]
export default records