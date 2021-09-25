import { Injectable, Logger } from "@nestjs/common";
import { Cron, Interval, Timeout } from "@nestjs/schedule";
import mysqldump from "mysqldump";
import * as moment from "moment";
import * as config from "config";
import { Connection } from "typeorm";
import { NotifyEmailService } from "../notify-email/notify-email.service";
import { NotifySmsService } from "../notify-sms/notify-sms.service";
import { NotifyPushNotificationService } from "../notify-push-notification/notify-push-notification.service";

const appConfig = config.get("appConfig");

@Injectable()
export class TaskNotificationsService {
  private readonly logger = new Logger(TaskNotificationsService.name);
  constructor(
    private readonly conn: Connection,
    private readonly email: NotifyEmailService,
    private readonly sms: NotifySmsService,
    private readonly pushNotification: NotifyPushNotificationService
  ) {}
  @Cron("0 0 23 * * 1-7")
  handleCron() {
    this.logger.debug("Backup started as 11:00 PM");
    mysqldump({
      connection: {
        host: appConfig.DB_HOST,
        user: appConfig.DB_USER,
        password: appConfig.DB_PASSWORD,
        database: appConfig.DB_SCHEMANAME,
        port: appConfig.DB_PORT,
      },
      dumpToFile: `./DBBackups/Dump_${
        appConfig.DB_SCHEMANAME
      }_${moment().format("YYYYMMDDHHmmss")}.sql.rar`,
      compressFile: true,
    });
  }

  @Interval(appConfig.PoolNotificationProcessPeriodMins * 60 * 1000)
  handleInterval() {
    try {
      let query = `CALL spGetDataNotificationTranPool ()`;
      this.conn.query(query, []).then((res) => {
        this.logger.debug(
          `Called every ${appConfig.PoolNotificationProcessPeriodMins} minutes, ${res[0].length} rows found to process`
        );

        res[0].map((pRow) => {
         
          if (pRow.Type === "T") {
            if (pRow.NotificationType === "P") {
              this.pushNotification.sendNotification(
                pRow.CompCode,
                pRow.TranId,
                pRow.DataValue3,
                pRow.DataValue2,
                pRow.DataValue1
              );
            } else if (pRow.NotificationType === "E") {
              this.email.sendEmail(
                pRow.CompCode,
                pRow.TranId,
                pRow.ConfigValue1,
                pRow.ConfigValue2,
                pRow.ConfigValue3,
                pRow.ConfigValue4,
                pRow.ConfigValue5,
                pRow.DataValue1,
                pRow.DataValue2,
                pRow.DataValue3
              );
            } else if (pRow.NotificationType === "S") {
              this.sms.sendSMS(pRow.CompCode, pRow.TranId, pRow.DataValue1);
            }
          } else if (pRow.Type === "P") {
            if (pRow.NotificationType === "P") {
              this.pushNotification.sendNotification(
                pRow.CompCode,
                pRow.TranId,
                pRow.DataValue3,
                pRow.DataValue2,
                pRow.DataValue1
              );
            } else if (pRow.NotificationType === "E") {
              this.email.sendEmail(
                pRow.CompCode,
                pRow.TranId,
                pRow.ConfigValue1,
                pRow.ConfigValue2,
                pRow.ConfigValue3,
                pRow.ConfigValue4,
                pRow.ConfigValue5,
                pRow.DataValue1,
                pRow.DataValue2,
                pRow.DataValue3
              );
            } else if (pRow.NotificationType === "S") {
              this.sms.sendSMSPromotional(
                pRow.CompCode,
                pRow.TranId,
                pRow.ConfigValue1,
                pRow.DataValue1,
                pRow.ConfigValue2,
                pRow.DataValue2
              );
            }
          }
          // console.log(tt.TranId);
        });
      });
    } catch (err) {
      console.log(err);
    } finally {
      // appConfig.isScheduleRunning = false;
    }
  }

  @Timeout(1 * 1000 * 60)
  handleTimeout() {
    this.logger.debug("Called once after 5 seconds");
  }
}
