const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load Idea Model
require('../models/Ticket');
const Ticket = mongoose.model('tickets');


// Login Route
router.get('/login',(req,res)=>{
    res.render('admin/adminLogin');
});

// Register form POST
router.post('/login',(req,res)=>{
    let errors = [];

    if(req.body.adminId != '9443885024'){
        errors.push({text:"Invalid Admin Id"})
    }
    if(req.body.adminPassword != '8124016427'){
        errors.push({text:"Invalid Admin Password"})
    }

    if(errors.length > 0){
        res.render('admin/adminLogin',{
            errors: errors
        });
    } else {
        res.redirect('/admin/selectDate');
    }
});

router.get('/selectDate',(req,res)=>{
    res.render('admin/selectDate');
});

router.post('/viewBookings',(req,res)=>{
    let errors = [];
    
    if(req.body.departureDate.length == 1){
        errors.push({text:'Please select Departure Date'});
    }
    
    if(errors.length > 0){
        res.render('admin/selectDate',{
            errors:errors
        })
    } else {
        Ticket.find({'departureDate':req.body.departureDate})
        .sort({seatNumber:1})
        .then(bookings => {
            res.render('admin/viewBookings',{
                bookings:bookings
            })
        })
    }
    
})

module.exports = router;