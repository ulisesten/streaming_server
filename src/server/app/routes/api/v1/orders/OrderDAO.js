const Connection = require('../../../../../model/connectionV2.js');
const { v4: uuidV4 } = require('uuid');

class OrderDAO {
    constructor(){
        this.setConnection(new Connection());
    }

    setConnection(conn){
        this.setInfo('Orders', conn);
    }

    setInfo(table_name, conn){
        this.table_name = table_name;
        this.conn = conn;
        this.conn.connect();
    }

    renameTable(new_name){
        this.conn.getConnection().query(`ALTER TABLE ${this.table_name} RENAME TO ${new_name}`);
        this.table_name = new_name;
        //this.conn.getConnection().query(`ALTER TABLE Orders RENAME COLUMN idProduct TO idOrder`);
    }

    createTable(){
        this.conn.getConnection().query(`CREATE TABLE ${this.table_name} (idOrder VARCHAR(36) NOT NULL, product_desc VARCHAR(8), length double, manufacturer VARCHAR(64), price double, qty int, order_number int NOT NULL AUTO_INCREMENT, date VARCHAR(12), customer VARCHAR(64), top_choice VARCHAR(3), PRIMARY KEY(order_number));`);
    }

    insertOrder( order, payment , cb){

        if(this.conn.getConnection()){
            try{

                let idOrder = uuidV4();
                let date = new Date();
                let query = '';

                order.forEach( p => {
                    query+= `INSERT INTO ${this.table_name} (idOrder, idProduct, qty, order_date, customer, top_choice) VALUES("${idOrder}", "${p.idProduct}", "${p.qty}", CURRENT_DATE(),"${p.customer}", "${p.top_choice}");`
                });

                this.conn.getConnection().query( query , function (error, results, fields) {
                    if (error) throw new Error(error);
                    cb(results);
                });

            } catch(exception) {

                console.log('OrderDAO Exception:', exception);
                cb([]);

            }

        }
    }

    updateOrder(id, p, cb){
        
        if(this.conn.getConnection()){
            try{

                this.conn.getConnection().query(`UPDATE ${this.table_name}
                SET product_desc='${p.product_desc}', length='${p.length}', manufacturer='${p.manufacturer}', price='${p.price}', qty='${p.qty}', customer='${p.customer}', top_choice='${p.top_choice}'
                WHERE idOrder="${id}";`, function (error, results, fields) {
                    if (error) throw error;
                    cb(results);
                });

            } catch(exception) {

                console.log('OrderDAO Exception:', exception);
                cb([]);

            }

        }

    }

    getOrder(id, cb){
        let query = `SELECT Orders.idOrder,
        Products.product_desc,
        Products.length,
        Products.manufacturer,
        Products.price,
        Orders.qty,
        Orders.order_number,
        Orders.order_date,
        Orders.customer,
        Orders.top_choice
        FROM Orders
        INNER JOIN Products ON Products.idProduct=Orders.idProduct WHERE order_number=${id};`

        if(this.conn.getConnection()){
            try{

                this.conn.getConnection().query( query , function (error, results, fields) {
                    if (error) throw new Error(error);
                    cb(results);
                });

            } catch(exception) {

                console.log('OrderDAO Exception:', exception);
                cb([]);

            }

        }
    }

    getOrders(cb){

        let query = `SELECT Orders.idOrder,
            Products.product_desc,
            Products.length,
            Products.manufacturer,
            Products.price,
            Orders.qty,
            Orders.order_number,
            Orders.order_date,
            Orders.customer,
            Orders.top_choice
            from Orders
            inner join Products on Products.idProduct=Orders.idProduct;`

        if(this.conn.getConnection()){
            try{

                this.conn.getConnection().query( query , function (error, results, fields) {
                    if (error) throw new Error(error);
                    cb(results);
                });

            } catch(exception) {

                console.log('OrderDAO Exception:', exception);
                cb([]);

            }
        }
    }

    getOrdersInRangeOfDays(days, cb){

        if(this.conn.getConnection()){

            let query = `SELECT Orders.idOrder,
                Products.product_desc,
                Products.length,
                Products.manufacturer,
                Products.price,
                Orders.qty,
                Orders.order_number,
                Orders.order_date,
                Orders.customer,
                Orders.top_choice
                from Orders
                inner join Products on Products.idProduct=Orders.idProduct WHERE DATEDIFF(CURRENT_DATE(), Orders.order_date) <= ${days};`

            try{

                this.conn.getConnection().query( query , function (error, results, fields) {
                    if (error) throw new Error(error);
                    cb(results);
                });

            } catch(exception) {

                console.log('OrderDAO Exception:', exception);
                cb([]);

            }
        }
    }

    deleteOrder(id, cb){

        if(this.conn.getConnection()){
            try{

                this.conn.getConnection().query(`DELETE FROM ${this.table_name} WHERE idOrder="${id}"`, function (error, results, fields) {
                    if (error) throw new Error(error);
                    cb(results);
                });

            } catch(exception) {

                console.log('OrderDAO Exception:', exception);
                cb({});

            }

        }
    }

}

module.exports = OrderDAO;