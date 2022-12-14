const sql = require("./db.js");

// constructor
const Contact = function(contact) {
  this.name = contact.name;
  this.email = contact.email;
  this.phone = contact.phone;
  this.address = contact.address;
  this.gender = contact.gender;
  this.password = contact.password;
  this.date_added = contact.date_added;
  this.date_modified = contact.date_modified;
};

Contact.create = (newContact, result) => {
  newContact.date_added = new Date();
  sql.query("INSERT INTO contacts SET ?", newContact, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created contact: ", { id: res.insertId, ...newContact });
    result(null, { id: res.insertId, ...newContact });
  });
};

Contact.showAll = (name, result) => {
  let query = "SELECT * FROM contacts";

  if (name) {
    query += ` WHERE name LIKE '%${name}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("contacts: ", res);
    result(null, res);
  });
};

Contact.getOne = (id, result) => {
  let query = "SELECT * FROM contacts WHERE id = ?";

  sql.query(query, id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("contacts: ", res);
    result(null, res[0]);
  });
};

Contact.getbyemail = (email, result) => {
  let query = "SELECT * FROM contacts WHERE email = ?";

  sql.query(query, email, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("contacts: ", res);
    result(null, res[0]);
  });
};

Contact.update = (id, contact, result) => {
  sql.query(
    "UPDATE contacts SET name = ?, email = ?, phone = ?, address = ?, gender = ?, password = ?, date_modified = CURRENT_TIMESTAMP() WHERE id = ?",
    [contact.name, contact.email, contact.phone, contact.address, contact.gender, contact.password, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found contact with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated contact: ", { id: id, ...contact });
      result(null, { id: id, ...contact });
    }
  );
};

Contact.delete = (id, result) => {
  sql.query("DELETE FROM contacts WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Contact with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted Contact with id: ", id);
    result(null, res);
  });
};



module.exports = Contact;