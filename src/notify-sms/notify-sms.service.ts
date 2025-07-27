import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { Connection } from "typeorm";
import { map } from 'rxjs/operators';

@Injectable()
export class NotifySmsService {
  private logger = new Logger("NotifySmsService");
  constructor(
    private readonly http: HttpService,
    private readonly conn: Connection
  ) {}

  public async sendSMS(pCompCode, pTranId, pAPI):  Promise<any> {
    try {
      return this.http.post(pAPI).subscribe((res) => {
        let query = `CALL spUpdtNotificationTransaction (?,?,?,?)`;
        this.conn.query(query, [pCompCode, pTranId, "SENT", "event"]);
        this.logger.log(res.data);
      });

      // return this.http.post(pAPI).pipe(map(response => response.data))

    } catch (err) {
      let query = `CALL spUpdtNotificationTransaction (?,?,?,?)`;
      this.conn.query(query, [pCompCode, pTranId, "FAIL", "event"]);
      this.logger.error(err);
    }
  }

  public async sendSMSPromotional(
    pCompCode, 
    pTranId,
    pAPI,
    pMessage,
    pSenderId,
    pTo
  ): Promise<any> {
    try {
      return this.http
        .post(pAPI, { From: pSenderId, Msg: pMessage, To: pTo })
        .subscribe((res) => {
          let query = `CALL spUpdtNotificationTransaction (?,?,?,?)`;
          this.conn.query(query, [pCompCode, pTranId, "SENT", "event"]);
          this.logger.log(res.data);
        });
    } catch (err) {
      let query = `CALL spUpdtNotificationTransaction (?,?,?,?)`;
      this.conn.query(query, [pCompCode, pTranId, "FAIL", "event"]);
      this.logger.error(err);
    }
  }
}
