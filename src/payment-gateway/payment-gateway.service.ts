import {
  Injectable,
  InternalServerErrorException,
  Logger,
  HttpService,
} from "@nestjs/common";
import { RecieptService } from "../reciept/reciept.service";
import { SysSequenceConfigmasterService } from "../sys-sequence-configmaster/sys-sequence-configmaster.service";
import { NotifyEventsService } from "../notify-events/notify-events.service";
import { Connection } from "typeorm";
import moment = require("moment");
@Injectable()
export class PaymentGatewayService {
  private logger = new Logger("RecieptService");
  constructor(
    private readonly conn: Connection,
    private readonly http: HttpService,
    private reciept: RecieptService,
    private sequenceConfig: SysSequenceConfigmasterService,
    private notifyEvents: NotifyEventsService
  ) { }

  async GetOnlinePaymentRequest(pCompCode, pPaymentRequestId): Promise<any> {
    try {
      let query = `CALL spGetOnlinePaymentRequest(?,?)`;
      const res = await this.conn.query(query, [pCompCode, pPaymentRequestId]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  //checkServiceOrderPaymentStatus
  async checkServiceOrderPaymentStatus(pCompCode, pOrderId): Promise<any> {
    try {
      let query = `CALL spCheckServiceOrderPaymentStatus(?,?)`;
      const res = await this.conn.query(query, [pCompCode, pOrderId]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  async GetPaymentGatewayOptionsAndConfig(CompCode): Promise<any> {
    try {
      let query = `CALL spGetPaymentGatewayOptionsAndConfig(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async _GetPaymentGatewayConfig(pPaymentCode): Promise<any> {
    try {
      let query = `CALL spGetPaymentModeConfig(?)`;
      const res = await this.conn.query(query, [pPaymentCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  //updtOnlinePaymentRequestResponse
  async updtOnlinePaymentRequestResponse(data): Promise<any> {
    try {
      let query = `CALL spUpdtOnlinePaymentRequestResponse(?,?,?,?,?,?,?,?,?)`;
      const res = await this.conn.query(query, [
        data.CompCode,
        data.RequestId,
        data.ResponseOption1,
        data.ResponseOption2,
        data.ResponseOption3,
        data.ResponseOption4,
        data.ResponseOption5,
        data.RequestStatus,
        data.UpdtUsr,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async razorPayReqGenerate(
    pCompCode,
    pPaymentTypeCode,
    pAmount,
    pRefernceNo
  ): Promise<any> {
    try {
      const config = await this._GetPaymentGatewayConfig(pPaymentTypeCode);
      const res = await this.http
        .post(
          config.data[0].SysOption1,
          {
            amount: pAmount * 100,
            currency: "INR",
            receipt: pRefernceNo,
            payment_capture: 1,
          },
          {
            auth: {
              username: config.data[0].SysOption2,
              password: config.data[0].SysOption3,
            },
          }
        )
        .toPromise();

      return { message: "successful", data: res.data };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async InsOnlinePaymentRequest(data: any): Promise<any> {
    try {
      // console.log(data.Dtl,data.Hdr,"header");
      const dataSource = [data.Dtl];

      let query = `CALL spInsOnlinePaymentRequest(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

      const res = await this.conn.query(query, [
        data.CompCode,
        data.SourceType,
        data.PaymentAmount,
        data.PaymentTitle,
        data.PaymentDesc,
        data.PreFillInfo1,
        data.PreFillInfo2,
        data.PreFillInfo3,
        data.PreFillInfo4,
        data.PreFillInfo5,
        data.SysOption1,
        data.SysOption2,
        data.SysOption3,
        data.SysOption4,
        data.SysOption5,
        data.ResponseOption1,
        data.ResponseOption2,
        data.ResponseOption3,
        data.ResponseOption4,
        data.ResponseOption5,
        data.RequestStatus,
        data.updt_usr,
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async serviceBookingPaymentSuccess(
    CompCode: any,
    orderId: any,
    paymentRequestId: any,
    UpdtUserId: any
  ): Promise<any> {
    // console.log(orderId, UpdtUserId);
    try {
      let query = `CALL spServiceBookingPaymentSuccess (?,?,?)`;
      const orderData = await this.conn.query(query, [CompCode, orderId, UpdtUserId]);
      const payRequest = await this.GetOnlinePaymentRequest(CompCode, paymentRequestId);


      if (payRequest.data.length > 0) {
        const seqData = { CompCode: CompCode, TranType: "RCPT", updt_usr: UpdtUserId };
        await this.sequenceConfig
          .getSequenceNextVal(seqData)
          .then(async (sequence) => {
            let recieptData = {
              Hdr: {
                ReceiptId: 0,
                ReceiptType: "CUST",
                Value1: orderData[0][0].OrderedUserId,
                Value2: "",
                Value3: "",
                Value4: "",
                Value5: "",
                ReceiptDate: moment(payRequest.data[0].crt_dttm).format(
                  "YYYY-MM-DD"
                ),
                ReceiptNo: sequence.data[0].NextVal,
                Amount: parseFloat(payRequest.data[0].PaymentAmount).toFixed(2),
                BalAmount: parseFloat(payRequest.data[0].PaymentAmount).toFixed(
                  2
                ),
                Remark: `#AUTO-RCPT-GENERATED against Order Id ${orderId}`,
                updt_usr: UpdtUserId,
              },
              Dtl: {
                Id: 0,
                ReceiptId: 0,
                PaymentMode: payRequest.data[0].ResponseOption5,
                Amount: parseFloat(payRequest.data[0].PaymentAmount).toFixed(2),
                Remark: `#AUTO-RCPT-GENERATED against ref. ${payRequest.data[0].ResponseOption1} (${payRequest.data[0].ResponseOption3})`,
                SysOption1: null,
                SysOption2: null,
                SysOption3: null,
                SysOption4: null,
                SysOption5: null,
              },
              updt_usr: UpdtUserId,
            };
            // console.log('before receipt inset')
            await this.reciept.InsUpdtRcptHdr(recieptData);
            const dddd = {
              orderId: orderId,
            };
            await this.notifyEvents.processEvents(CompCode, "CRT_ORD", dddd);
          });
      }

      // this.orders.updtPaymentEntry()
      // const sss = await this.sendTranSMS("PAYFAIL", orderId);
      // console.log('return send')
      return { message: "successful" };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
}
