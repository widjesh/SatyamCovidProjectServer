const mongoose = require('mongoose');

var user = mongoose.model('Stmaarten', {
    lastName: { type: String },
    firstName: { type: String },
    dateOfBirth: {type: String},
    nationality: { type: String },
    countryStranded: { type: String },
    originalTravelDate: { type: String },
    airlineTraveled: {type: String},
    phoneNo: { type: String },
    email: { type: String }, 
    comment: {type: String}
});

module.exports = user;
