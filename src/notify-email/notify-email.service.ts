import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";
import { resolve } from "dns";
// import * as EmailValidator from "email-validator";
import * as EmailValidator from "email-validator"

const nodemailer = require("nodemailer");

@Injectable()
export class NotifyEmailService {
  private logger = new Logger("NotifyEvNotifyEmailServiceentsService");
  constructor(private readonly conn: Connection) { }

  public async sendEmail(
    pCompCode,
    pTranId,
    pHost,
    pPort,
    pAuthUserName,
    pAuthPassword,
    pSenderEmail,
    pEmailBody,
    pRecipientEmail,
    pSubject
  ): Promise<any> {
    
    if (EmailValidator.validate(pRecipientEmail) === false) {
      let query = `CALL spUpdtNotificationTransaction (?,?,?,?)`;
      this.conn.query(query, [pCompCode,pTranId, "FAIL", "event"]);
      this.logger.error("Invalid email id");
      return;
    }
    try {
      let transporter = nodemailer.createTransport({
        host: pHost,
        port: pPort,
        secure: false, // true for 465, false for other ports
        auth: {
          user: pAuthUserName,
          pass: pAuthPassword,
        },
      });

      // send mail with defined transport object
      transporter
        .sendMail({
          from: pSenderEmail, // sender address
          to: pRecipientEmail, // list of receivers
          subject: pSubject, // Subject line
          // text: "Hello world?", // plain text body
          html: pEmailBody, // html body
        })
        .then((dd) => {
          let query = `CALL spUpdtNotificationTransaction (?,?,?,?)`;
          this.conn.query(query, [pCompCode, pTranId, "SENT", "event"]);
          this.logger.log(dd.messageId);
        })
        .catch((ee) => {
          let query = `CALL spUpdtNotificationTransaction (?,?,?,?)`;
          this.conn.query(query, [pCompCode, pTranId, "FAIL", "event"]);
          this.logger.error(ee);
        });
    } catch (error) {
      this.logger.error('onemail send',error)
    }

  }
}
