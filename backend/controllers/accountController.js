const twilio = require('twilio');
const logger = require('../logger');

class AccountController {
    constructor(){
        this.accountSid = process.env.TWILIO_ACCOUNT_SID;
        this.authToken = process.env.TWILIO_AUTH_TOKEN;
        this.client = twilio(this.accountSid, this.authToken);
    }

    async getAccountBalance(){
        if (!this.accountSid || !this.authToken) {
            logger.error('Twilio credentials not set.');
            throw new Error('Twilio credentials not set.');
        }
        try{
            const account = await this.client.accounts(this.accountSid).fetch();
            return {
                accountSid: account.sid,
                balance: account.balance,
                currency: account.currency,
            }
        } catch (error){
            logger.error('Error getting account balance', error);
            throw error;
        }
    }
}

module.exports = AccountController;
