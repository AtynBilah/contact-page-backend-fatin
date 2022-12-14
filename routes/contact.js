
module.exports = app => {
    const contact = require("../controllers/contact.js");

    var router = require("express").Router();

    // Create a new Contact
    router.post("/create", contact.create);

    //Show All Contact
    router.get("/showAll", contact.showAll);

    //Update contact
    router.post("/update/:id", contact.update);

    //Delete contact
    router.delete("/delete/:id", contact.delete);

    //Get Contact By Id
    router.get("/getOne/:id", contact.getOne);

    app.use('/api/contacts', router);

    app.post("/login", contact.login);
    
}