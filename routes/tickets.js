const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

// Load Idea Model
require('../models/Ticket');
const Ticket = mongoose.model('tickets');


// Get request to bookDate page
router.get('/bookDate', ensureAuthenticated ,(req,res)=>{
    res.render('tickets/bookDate');    
});

// View Ticket Route
router.get('/view', ensureAuthenticated ,(req,res)=>{
    Ticket.find({user: req.user.id})
        .sort({bookedDate:'desc'})
        .then(tickets => {
            res.render('tickets/view',{
                tickets: tickets
            });
        });    
});

// Get Book Tickets Route
router.post('/book',(req,res)=>{
    let errors = [];
    
    if(req.body.departureDate.length == 1){
        errors.push({text:'Please select Departure Date'});
    }
    
    if(errors.length > 0){
        res.render('tickets/bookDate',{
            errors:errors,
        })
    }else{
        Ticket.find({'departureDate':req.body.departureDate})
            .select({"seatLabel" : 1,"_id" : 0 })
            .then(seatLabels => {
                let bookedSeats = [];
                seatLabels.forEach(seatLabel =>{
                    bookedSeats.push(seatLabel.seatLabel);
                });
                res.render('tickets/book',{
                    departureDate : req.body.departureDate,
                    bookedSeats: bookedSeats
                });
             });  
       
    }
});


// Post request from Book page
router.post('/view',(req,res)=>{
    let errors = [];
    if(!(parseInt(req.body.registerNumber) >= 118999999)){
        errors.push({text:'Invalid Register Number'});
    }
    if(req.body.gender.length == 1){
        errors.push({text:'Please select gender'});
    }
    if(req.body.pickUpLocation.length == 1){
        errors.push({text:'Please select Pick Up Location'});
    }
    if(req.body.dropOffLocation.length == 1){
        errors.push({text:'Please select Drop Off Location'});
    }

    if(errors.length > 0){
        res.render('tickets/book',{
            errors:errors,
            name: req.body.name,
            registerNumber: req.body.registerNumber,
            email: req.body.email,
            number: req.body.number,
            departureDate : req.body.departureDate
        })
    }else{
        const newTicket = {
            user: req.user.id,
            name: req.body.name,
            registerNumber: req.body.registerNumber,
            email: req.body.email,
            mobile: req.body.number,
            gender: req.body.gender,
            departureDate: req.body.departureDate,
            pickup: req.body.pickUpLocation,
            dropoff: req.body.dropOffLocation,
            seatNumber: req.body.seatNumber,
            total: req.body.total,
            seatLabel: req.body.seatLabel,
            
        }
        new Ticket(newTicket)
            .save()
            .then(ticket=>{
                res.redirect('/tickets/view'); 
            });
    }
})

module.exports = router;