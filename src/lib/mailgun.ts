import FormData from "form-data";
import Mailgun from "mailgun.js";

interface Message {
  from: string;
  to: string;
  subject: string;
  text: string;
}

export const mailgunClient = {
  send: async function(message: Message) {
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: "api",
      key: import.meta.env.PUBLIC_MAILGUN_API_KEY,
      // When you have an EU-domain, you must specify the endpoint:
      // url: "https://api.eu.mailgun.net"
    });

    try {
      const data = await mg.messages.create(import.meta.env.PUBLIC_MAILGUN_DOMAIN, {
        from: message.from,
        to: [message.to],
        subject: message.subject,
        text: message.text
      });
      
      return data;
    } catch (error) {
      console.error('Mailgun error:', error);
      throw error;
    }
  }
} 