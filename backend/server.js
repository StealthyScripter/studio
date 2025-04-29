require('dotenv').config();

const express = require('express');
const ContactController = require('./controllers/contactController');
const CallController = require('./controllers/callController');
const AccountController = require('./controllers/accountController');
const logger = require('./logger');

const app = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const contactController = new ContactController();
const callController = new CallController();
const accountController = new AccountController();


// Contacts routes
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await contactController.getAllContacts();
    res.json(contacts);
  } catch (error) {
    logger.error('Error getting contacts:', error);
    res.status(500).json({ error: 'Error getting contacts' });
  }
});

app.post('/api/contacts', async (req, res) => {
  const { name, phone } = req.body;
  try {
    const newContact = await contactController.addContact(name, phone);
    res.status(201).json(newContact);
  } catch (error) {
    logger.error('Error adding contact:', error);
    res.status(500).json({ error: 'Error adding contact' });
  }
});

app.put('/api/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone } = req.body;
  try {
    const updatedContact = await contactController.updateContact(id, name, phone);
    res.json(updatedContact);
  } catch (error) {
    logger.error('Error updating contact:', error);
    res.status(500).json({ error: 'Error updating contact' });
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedContact = await contactController.deleteContact(id);
    res.json(deletedContact);
  } catch (error) {
    logger.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Error deleting contact' });
  }
});

// Calls routes
app.get('/api/calls', async (req, res) => {
  try {
    const calls = await callController.getAllCalls();
    res.json(calls);
  } catch (error) {
      logger.error('Error getting calls:', error);
      res.status(500).json({ error: 'Error getting calls' });
  }
});

app.post('/api/calls', async (req, res) => {
  const { to } = req.body;
  try {
    const call = await callController.makeCall(to);
    res.status(201).json(call);
  } catch (error) {
    logger.error('Error making call:', error);
    res.status(500).json({ error: 'Error making call' });
  }
});

//Account routes
app.get('/api/account', async (req, res) => {
    try{
        const accountBalance = await accountController.getAccountBalance();
        res.json(accountBalance)
    }catch(error){
        logger.error('Error getting account balance:', error);
        res.status(500).json({error:'Error getting account balance'});
    }
})

const server = app.listen(port, () => {
  logger.info();
});


const close = () => {
    logger.info('Closing server...')
    contactController.close();
    callController.close();
    server.close();
}

process.on('SIGINT', close);
process.on('SIGTERM', close);
