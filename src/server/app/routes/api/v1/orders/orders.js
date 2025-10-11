const { Router } = require('express');
const orders = Router();
//const Connection = require('../../../../model/connectionV2.js');
const OrderDao = require('./OrderDAO.js');

const orderDao = new OrderDao();

orders.get('/', function(req, res){

    orderDao.getOrders(function (results) {
     
        res.json({message: 'success', result: results});

    });
    
});


orders.get('/:days', function(req, res){

    orderDao.getOrdersInRangeOfDays( req.params.days, function (results) {
     
        res.json({message: 'success', result: results});

    });
    
});


orders.post('/', function(req, res){
    let payment = 0;

    req.body.order.forEach(p => {
        payment+= p.totalAmount;
    })

    if(payment === req.body.payment) {

        orderDao.insertOrder( req.body.order, req.body.payment, function(results){
            res.json({message: "Order succesfully saved", result: results});
        });

    } else {
        res.json({message: "Error in payment amount", result: {}});
    }

});


orders.put('/', function(req, res){
    orderDao.updateOrder( req.body.id, req.body.product, function(results){
        res.json({message: "success", result: results});
    });
});

orders.delete('/:id', function(req, res){
    orderDao.deleteOrder( req.params.id, function(results){
        res.json({message: "success", result: results});
    });
});

module.exports = orders;