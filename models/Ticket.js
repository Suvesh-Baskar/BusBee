const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const TicketSchema = new Schema({
    
    user:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    registerNumber:{
        type: Number,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    mobile:{
        type: Number,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    departureDate:{
        type: String,
        required: true
    },
    pickup:{
        type: String,
        required: true
    },
    dropoff:{
        type: String,
        required: true
    },
    seatNumber:{
        type: Number,
        required: true
    },
    total:{
        type: Number,
        required: true
    },
    seatLabel:{
        type: String,
        required: true
    },
    bookedDate:{
        type: Date,
        default: Date.now
    }
});

mongoose.model('tickets',TicketSchema);