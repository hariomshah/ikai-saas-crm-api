import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";
import { Expo } from "expo-server-sdk";

// Create a new Expo SDK client
let expo = new Expo();

@Injectable()
export class NotifyPushNotificationService {
  private logger = new Logger("NotifyPushNotificationService");
  constructor(private readonly conn: Connection) {}

  async sendNotification(
    pCompCode,
    pTranId,
    pushToken,
    title,
    body
  ): Promise<any> {
    let messages = [];
    // console.log(pTranId, "Step0", pushToken);
    try {
      if (pushToken === "" || pushToken === "null") {
        let query = `CALL spUpdtNotificationTransaction (?,?,?,?)`;
        this.conn.query(query, [pCompCode, pTranId, "FAIL", "event"]);
      }
      if (Expo.isExpoPushToken(pushToken)) {
        messages.push({
          to: pushToken,
          sound: "default",
          title: title,
          body: body,
          //   data: { withSome: "This is a test notification,This is a test notification,This is a test notification,This is a test notification,This is a test notification,This is a test notification,This is a test notification,This is a test notification,This is a test notification," },
        });
      } else {
        let query = `CALL spUpdtNotificationTransaction (?,?,?,?)`;
        await this.conn.query(query, [pCompCode, pTranId, "FAIL", "event"]);
        this.logger.error('invalid push token',pushToken);
      }

      let chunks = expo.chunkPushNotifications(messages);
      let tickets = [];
      (async () => {
        // Send the chunks to the Expo push notification service. There are
        // different strategies you could use. A simple one is to send one chunk at a
        // time, which nicely spreads the load out over time:
        for (let chunk of chunks) {
          try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            this.logger.log(ticketChunk);
            let query = `CALL spUpdtNotificationTransaction (?,?,?,?)`;
            this.conn.query(query, [pCompCode, pTranId, "SENT", "event"]);

            tickets.push(...ticketChunk);
            // NOTE: If a ticket contains an error code in ticket.details.error, you
            // must handle it appropriately. The error codes are listed in the Expo
            // documentation:
            // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
          } catch (error) {
            let query = `CALL spUpdtNotificationTransaction (?,?,?,?)`;
            await this.conn.query(query, [pCompCode, pTranId, "FAIL", "event"]);
            this.logger.error(error);
          }
        }
      })();
      // console.log(pTranId, "Step2", tickets);
      let receiptIds = [];
      for (let ticket of tickets) {
        // NOTE: Not all tickets have IDs; for example, tickets for notifications
        // that could not be enqueued will have error information and no receipt ID.
        if (ticket.id) {
          receiptIds.push(ticket.id);
        }
      }

      let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
      (async () => {
        // Like sending notifications, there are different strategies you could use
        // to retrieve batches of receipts from the Expo service.
        for (let chunk of receiptIdChunks) {
          try {
            let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
            this.logger.log(receipts);

            // The receipts specify whether Apple or Google successfully received the
            // notification and information about an error, if one occurred.
            for (let receiptId in receipts) {
              let { status, details } = receipts[receiptId];
              if (status === "ok") {
                continue;
              } else if (status === "error") {
                let query = `CALL spUpdtNotificationTransaction (?,?,?,?)`;
                this.conn.query(query, [pCompCode, pTranId, "FAIL", "event"]);

                this.logger.error(
                  `There was an error sending a notification: `
                );
                if (details) {
                  // The error codes are listed in the Expo documentation:
                  // https://docs.expo.io/versions/latest/guides/push-notifications/#individual-errors
                  // You must handle the errors appropriately.
                  this.logger.error(`The error code is ${details}`);
                }
              }
            }
          } catch (error) {
            this.logger.error(error);
            let query = `CALL spUpdtNotificationTransaction (?,?,?,?)`;
            this.conn.query(query, [pCompCode, pTranId, "FAIL", "event"]);
          }
        }
      })();

      //   let query = `CALL spGetLocations ()`;
      //   const res = await this.conn.query(query, []);
      //   return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
