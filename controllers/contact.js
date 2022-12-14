const Contact = require("../models/contact.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create and Save a new Contact
exports.create = async (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    // Create a Contact
    console.log("req.body.name = " + req.body.name);
    var enc_password = await bcrypt.hash(req.body.password, 10);
    console.log(enc_password);
    const contact = new Contact({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        gender: req.body.gender,
        password: enc_password,
        date_added: req.body.date_added,
        date_modified: req.body.date_modified
    });
  
    // Save Contact in the database
    Contact.create(contact, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Contact."
        });
      else res.send(data);
    });
  };

  //Show All Contacts
  exports.showAll = (req, res) => {
    const name = req.query.name;
     Contact.showAll(name, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Contacts."
        });
      else res.send(data);
    });
  };

  //Show One Contacts
  exports.getOne = (req, res) => {
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    Contact.getOne(
      req.params.id,
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Contact with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating Contact with id " + req.params.id
            });
          }
        } else res.send(data);
      }
    );
  };

  // Update a selected contact
  exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    console.log(req.body);
  
    Contact.update(
      req.params.id,
      new Contact(req.body),
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Contact with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating Contact with id " + req.params.id
            });
          }
        } else res.send(data);
      }
    );
  };

  // Delete a contact
  exports.delete = (req, res) => {
    Contact.delete(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Contact with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete Contact with id " + req.params.id
          });
        }
      } else res.send({ message: `Contact was deleted successfully!` });
    });
  };

  exports.login = (req, res) => {
      const { email, password } = req.body;
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }

      Contact.getbyemail(
        email,
        async (err, data) => {
          if (err) {
            if (err.kind === "not_found") {
              res.status(404).send({
                message: `Not found Contact with email ${req.params.email}.`
              });
            } else {
              res.status(500).send({
                message: "Error updating Contact with email " + req.params.email
              });
            }
          } else {
            var a = await bcrypt.compare(password, data.password);
            console.log(password);
            console.log(data.password);
            if(a){
              const token = jwt.sign(
                { user_id: data.id, email },
                "1234",
                {
                  expiresIn: "2h",
                }
              );
              const arr_token = {
                "access_token" : token,
              }
              // data.token = token;
              res.status(200).json(arr_token);
            }else{
              res.status(400).send("Invalid Credentials");
            }
          };
        });
  };