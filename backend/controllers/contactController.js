const Contact = require('../models/contact');
const logger = require('../logger');

class ContactController {
    constructor() {
        this.contact = new Contact();
    }

    getAllContacts() {
        return this.contact.getAllContacts();
    }

    addContact(name, phone) {
        return this.contact.addContact(name, phone);
    }

    updateContact(id, name, phone){
        return this.contact.updateContact(id, name, phone)
    }

    deleteContact(id){
        return this.contact.deleteContact(id)
    }

    close(){
        return this.contact.close();
    }
}

module.exports = ContactController;
