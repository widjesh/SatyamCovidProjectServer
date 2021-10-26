const express = require('express');
const  router = express.Router();
const Client = require("../models/clients");
const nodemailer = require("nodemailer");
require('dotenv').config();

//Retrieve all Clients
router.get('/',async (req,res,next)=>{
  res.json({
    message:'Welcome to Satyam Holidays Covid API'
  })
});

//Post a Client
router.post('/',async(req,res,next)=>{
  try{
    const isAvailable = await Client.findOne({lastName:req.body.lastName,firstName:req.body.firstName}, async(err,data)=>{
      if(!err){
        if(data !== null){
          res.status(303).json({
            message:'User already exists'
          });
        }else{
          const incomingClient = new Client({
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            dateOfBirth: req.body.dateOfBirth,
            nationality: req.body.nationality,
            countryStranded: req.body.countryStranded,
            originalTravelDate: req.body.originalTravelDate,
            airlineTraveled: req.body.airlineTraveled,
            phoneNo: req.body.phoneNo,
            email: req.body.email, 
            comment: req.body.comment
          });
          try{
            const savedClient = await incomingClient.save();
            if(!savedClient){
              res.status(500).json({
                message:'Internal Server Error'
              });
            }
            else{
              console.log("SAVED...");
              
              //SEND MAIL
              let transporter = nodemailer.createTransport({
                host: process.env.HOST,
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                  user: process.env.EMAIL, // generated ethereal user
                  pass: process.env.PASSWORD // generated ethereal password
                }
              });
              console.log("AFter setup");
              // send mail with defined transport object
              let info = await transporter.sendMail({
                from: '"Satyam Holidays" <stmaarten@satyamholidays.net>', // sender address
                to: `${savedClient.email}`, // list of receivers
                subject: "Submitted Data on St Maarten Form ✔", // Subject line
                html:`<p> Beste ${savedClient.firstName} ${savedClient.lastName},</br>
                </br>
                Uw registratieaanvraag is ontvangen en zoals toegezegd doorgeleid naar de instanties</br>
                Voor appen en bellen zie onderaan dit bericht </br>
                Wij spreken met u de hoop uit dat u gauw thuis bent</br>
                Satyam Holidays is per mail bereikbaar op satyam@satyamholidays.net</br>
                In Nederland op het nummer 070-7113625 v.a 12:00  t/m 20:00 uur en via whats app op nr.+31707113625.</br>
                In Suriname op het nummer  1611   v.a  11:00  t/m 16:00  uur en  via whats app nr. +597436950</br>
                </br>
                Mvg,</br>
                Satyam Team </br>
                Be safe </p>`
              });
              console.log(`Message sent for ${savedClient.firstName} ${savedClient.lastName} : email = ${savedClient.email}`);
              console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
              res.status(200).json(savedClient);
            }
          }catch(err){
            next(err);
          }
        }
      }else{
        next(err);
      }
    });
  }catch(err){
    next(err)
  }
});



module.exports = router;
