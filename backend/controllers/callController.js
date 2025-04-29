const Call = require('../models/call');
const twilio = require('twilio');
const logger = require('../logger');

class CallController {
  constructor() {
    this.call = new Call();
        this.accountSid = process.env.TWILIO_ACCOUNT_SID;
        this.authToken = process.env.TWILIO_AUTH_TOKEN;
        this.twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
        this.client = twilio(this.accountSid, this.authToken);
  }

  getAllCalls() {
    return this.call.getAllCalls();
  }

  async makeCall(to) {
        if (!this.accountSid || !this.authToken || !this.twilioPhoneNumber) {
            logger.error('Twilio credentials not set.');
            throw new Error('Twilio credentials not set.');
        }
        try {
            const call = await this.client.calls.create({
                to: to,
                from: this.twilioPhoneNumber,
                url: 'http://demo.twilio.com/docs/voice.xml', // Replace with your TwiML URL
            });
            const date = new Date().toISOString()
            await this.call.addCall(this.twilioPhoneNumber, to, date, call.status);
            return call;
        } catch (error) {
            logger.error('Error making call:', error);
            throw error;
        }
  }

  close(){
    return this.call.close();
  }
}

module.exports = CallController;
