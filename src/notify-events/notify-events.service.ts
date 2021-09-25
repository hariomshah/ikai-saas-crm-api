import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";
import _ = require("lodash");
import { NotifyEmailService } from "../notify-email/notify-email.service";
import { NotifySmsService } from "../notify-sms/notify-sms.service";
import { NotifyPushNotificationService } from "../notify-push-notification/notify-push-notification.service";
import moment = require("moment");

@Injectable()
export class NotifyEventsService {
  private logger = new Logger("NotifyEventsService");
  constructor(
    private readonly conn: Connection,
    private readonly email: NotifyEmailService,
    private readonly sms: NotifySmsService,
    private readonly pushNotification: NotifyPushNotificationService
  ) { }

  insertNotificationTran(
    pEventCode,
    pNotificationTranId,
    pNotificationTranDtlId,
    pNotificationType,
    pDeliveryType,
    pWaitInSeconds,
    pDataValue1,
    pDataValue2,
    pDataValue3,
    pDataValue4,
    pDataValue5,
    pDataValue6,
    pDataValue7,
    pConfigValue1,
    pConfigValue2,
    pConfigValue3,
    pConfigValue4,
    pConfigValue5,
    pConfigValue6,
    pConfigValue7,
    pSendDTTM,
    pStatus,
    pUpdtUsr
  ): Promise<any> {
    let PkNo;
    try {
      return;
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async NotificationTranSend(pTranCode): Promise<any> {
    try {
      let query = `CALL spGetNotificationTranRows (?)`;
      return this.conn.query(query, [pTranCode]);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async NotificationTranFailed(): Promise<any> { }
  async NotificationTranInvalidData(): Promise<any> { }

  async savePromoNotificationTran(pData, CompCode): Promise<any> {
    try {
      pData.map(async (row) => {
        let query = `CALL spInsNotification_Transactions(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        let dataDiff = `SELECT TIMESTAMPDIFF(SECOND,now(),?) as sec`;
        let res;
        if (row.WaitInSeconds !== 0) {
          res = await this.conn.query(dataDiff, [row.WaitInSeconds]);
        } else {
          res = [{ sec: 0 }];
        }
        this.conn.query(query, [
          CompCode,
          "P",
          null,
          null,

          row.TemplateId,
          row.NotificationType,
          row.DeliveryType,
          res[0].sec,
          row.DataValue1,
          row.DataValue2,
          row.DataValue3,
          row.DataValue4,
          row.DataValue5,
          row.DataValue6,
          row.DataValue7,
          row.ConfigValue1,
          row.ConfigValue2,
          row.ConfigValue3,
          row.ConfigValue4,
          row.ConfigValue5,
          row.ConfigValue6,
          row.ConfigValue7,
          null,
          "PND",
          row.UpdtUserId,
        ]);
      });

      return { message: "successful" };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async processEvents(CompCode, EventCode, Data): Promise<any> {
    try {
      console.log(CompCode, EventCode, Data)
      let query = `CALL spGetNotificationTranRows (?,?)`;
      this.conn
        .query(query, [CompCode, EventCode])
        .then((res) => {
          // console.log(res[0]);
          res[0].map((rowEvents) => {
            // console.log(
            //   rowEvents.NotificationTranId,
            //   rowEvents.fetchDataSource
            // );
            // console.log(Data, "Data");
            let arr = Object.keys(Data).map((k) => Data[k]);
            let qjjj = "?,".repeat(arr.length);
            qjjj = qjjj.substring(0, qjjj.length - 1);

            // console.log(`Call ${rowEvents.fetchDataSource} (?,${qjjj})`, [
            //   CompCode,
            //   ...arr,
            // ]);
            this.conn
              .query(`Call ${rowEvents.fetchDataSource} (?,${qjjj})`, [
                CompCode,
                ...arr,
              ])
              .then((result) => {
                // console.log("result from dynamic data", result[0][0]);
                if (result[0].length > 0) {
                  let l_NotificationTranId = rowEvents.NotificationTranId;
                  this.conn
                    .query("CALL spGetNotificationTranDtl (?,?)", [
                      CompCode,
                      l_NotificationTranId,
                    ])
                    .then((dtl) => {
                      dtl[0].map((row) => {
                        if (row.IsEnabled === "Y") {
                          // console.log(row)
                          res[0][0].KeyValuesHelp.split(",").map((iii) => {
                            iii = iii.trim();
                            row.DataValue1 = _.replace(
                              row.DataValue1,
                              `<<${iii}>>`,
                              result[0][0][`${iii}`]
                            );
                            row.DataValue2 = _.replace(
                              row.DataValue2,
                              `<<${iii}>>`,
                              result[0][0][`${iii}`]
                            );
                            row.DataValue3 = _.replace(
                              row.DataValue3,
                              `<<${iii}>>`,
                              result[0][0][`${iii}`]
                            );
                            row.DataValue4 = _.replace(
                              row.DataValue4,
                              `<<${iii}>>`,
                              result[0][0][`${iii}`]
                            );
                            row.DataValue5 = _.replace(
                              row.DataValue5,
                              `<<${iii}>>`,
                              result[0][0][`${iii}`]
                            );
                            row.DataValue6 = _.replace(
                              row.DataValue6,
                              `<<${iii}>>`,
                              result[0][0][`${iii}`]
                            );
                            row.DataValue7 = _.replace(
                              row.DataValue7,
                              `<<${iii}>>`,
                              result[0][0][`${iii}`]
                            );

                            row.ConfigValue1 = _.replace(
                              row.ConfigValue1,
                              `<<${iii}>>`,
                              result[0][0][`${iii}`]
                            );

                            row.ConfigValue2 = _.replace(
                              row.ConfigValue2,
                              `<<${iii}>>`,
                              result[0][0][`${iii}`]
                            );

                            row.ConfigValue3 = _.replace(
                              row.ConfigValue3,
                              `<<${iii}>>`,
                              result[0][0][`${iii}`]
                            );

                            row.ConfigValue4 = _.replace(
                              row.ConfigValue4,
                              `<<${iii}>>`,
                              result[0][0][`${iii}`]
                            );

                            row.ConfigValue5 = _.replace(
                              row.ConfigValue5,
                              `<<${iii}>>`,
                              result[0][0][`${iii}`]
                            );

                            row.ConfigValue6 = _.replace(
                              row.ConfigValue6,
                              `<<${iii}>>`,
                              result[0][0][`${iii}`]
                            );

                            row.ConfigValue7 = _.replace(
                              row.ConfigValue7,
                              `<<${iii}>>`,
                              result[0][0][`${iii}`]
                            );
                          });

                          let query = `CALL spInsNotification_Transactions(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                          this.conn
                            .query(query, [
                              CompCode,
                              "T",
                              EventCode,
                              l_NotificationTranId,
                              row.PkId,
                              row.NotificationType,
                              row.DeliveryType,
                              row.WaitInSeconds,
                              row.DataValue1,
                              row.DataValue2,
                              row.DataValue3,
                              row.DataValue4,
                              row.DataValue5,
                              row.DataValue6,
                              row.DataValue7,
                              row.ConfigValue1,
                              row.ConfigValue2,
                              row.ConfigValue3,
                              row.ConfigValue4,
                              row.ConfigValue5,
                              row.ConfigValue6,
                              row.ConfigValue7,
                              null,
                              "PND",
                              "event",
                            ])
                            .then((kkkk) => {
                              let TranId = kkkk[0][0].PkNo;
                              if (row.NotificationType === "P") {
                                this.pushNotification.sendNotification(row.CompCode,
                                  TranId,
                                  row.DataValue3,
                                  row.DataValue2,
                                  row.DataValue1
                                );
                              } else if (row.NotificationType === "E") {
                                this.email.sendEmail(row.CompCode,
                                  TranId,
                                  row.ConfigValue1,
                                  row.ConfigValue2,
                                  row.ConfigValue3,
                                  row.ConfigValue4,
                                  row.ConfigValue5,
                                  row.DataValue1,
                                  row.DataValue2,
                                  row.DataValue3
                                );
                              } else if (row.NotificationType === "S") {
                                this.sms.sendSMS(row.CompCode,TranId, row.DataValue1);
                              }
                            })
                            .catch((err) => this.logger.error(err, "3"));

                          // console.log(row);
                        }
                      });
                      return dtl;
                    })
                    .catch((err) => this.logger.error(err, "4"));
                }
              })
              .catch((err) => {
                console.error(err, "5");
              });
          });
        })
        .catch((err) => {
          this.logger.error(err, "6");
          throw new InternalServerErrorException();
        });
      return { message: "successful" };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
