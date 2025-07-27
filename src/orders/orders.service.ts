import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { Connection } from "typeorm";
import { map } from "rxjs/operators";
import { request } from "express";
import { NotifyEventsService } from "../notify-events/notify-events.service";
import { RecieptService } from "../reciept/reciept.service";
import { SysSequenceConfigmasterService } from "../sys-sequence-configmaster/sys-sequence-configmaster.service";
import moment = require("moment");

@Injectable()
export class OrdersService {
  private logger = new Logger("LoginService");

  constructor(
    private readonly conn: Connection,
    private readonly http: HttpService,
    private reciept: RecieptService,
    private notifyEvents: NotifyEventsService,
    private sequenceConfig: SysSequenceConfigmasterService
  ) {}

  async insPaymentEntry(
    CompCode: any,
    OrderId: any,
    PaymentDate: any,
    API_OrderId: any,
    API_PaymentId: any,
    Amount: any,
    userId: any
  ): Promise<any> {
    // console.log(
    //   OrderId,
    //   PaymentDate,
    //   API_OrderId,
    //   API_PaymentId,
    //   Amount,
    //   userId
    // );
    try {
      let query = `CALL spInsUpdtOrders_payment (?,?,?,?,?,?,?,?)`;
      //return await this.conn.query(query);

      const data = await this.conn.query(query, [
        "I",
        CompCode,
        OrderId,
        PaymentDate,
        API_OrderId,
        API_PaymentId,
        Amount,
        userId,
      ]);
      // console.log("i am at insrt");
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async createRazonPaymentId(
    CompCode: any,
    amount: any,
    orderId: any,
    uid: any,
    pswd: any,
    api: any
  ): Promise<any> {
    try {
      const res = await this.http
        .post(
          api,
          {
            amount: +amount * 100,
            currency: "INR",
            receipt: orderId,
            payment_capture: 1,
          },
          {
            auth: {
              username: uid,
              password: pswd,
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

  async updtPaymentEntry(
    CompCode: any,
    OrderId: any,
    API_OrderId: any,
    API_PaymentId: any,
    userId: any,
    SendOrderSMS: any
  ): Promise<any> {
    try {
      let query = `CALL spInsUpdtOrders_payment (?,?,?,?,?,?,?,?)`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query, [
        "U",
        CompCode,
        OrderId,
        null,
        API_OrderId,
        API_PaymentId,
        null,
        userId,
      ]);

      if (SendOrderSMS === true) {
        const sss = await this.sendTranSMS("NEW", OrderId);
      }
      // console.log("i am at update");

      if (data[0]) {
        const seqData = { TranType: "RCPT", updt_usr: userId };
        this.sequenceConfig.getSequenceNextVal(seqData).then((sequence) => {
          // console.log(sequence.data[0].NextVal);

          let recieptData = {
            Hdr: {
              ReceiptId: 0,
              ReceiptType: "CUST",
              Value1: userId,
              Value2: "",
              Value3: "",
              Value4: "",
              Value5: "",
              ReceiptDate: moment(data[0][0].PaymentDate).format("YYYY-MM-DD"),
              ReceiptNo: sequence.data[0].NextVal,
              Amount: parseFloat(data[0][0].Amount).toFixed(2),
              BalAmount: parseFloat(data[0][0].Amount).toFixed(2),
              Remark: `#AUTO-RCPT-GENERATED against Order Id ${OrderId}`,
              updt_usr: userId,
            },
            Dtl: {
              Id: 0,
              ReceiptId: 0,
              PaymentMode: "RAZORPAY",
              Amount: parseFloat(data[0][0].Amount).toFixed(2),
              Remark: `#AUTO-RCPT-GENERATED against ${API_OrderId}`,
              SysOption1: null,
              SysOption2: null,
              SysOption3: null,
              SysOption4: null,
              SysOption5: null,
            },
            updt_usr: userId,
          };
          // console.log(recieptData);
          this.reciept.InsUpdtRcptHdr(recieptData);
        });
      }
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async cancelOrder(
    CompCode: any,
    orderId: any,
    UpdtUserId: any
  ): Promise<any> {
    try {
      let query = `CALL spCancelOrder (?,?,?)`;
      const data = await this.conn.query(query, [
        CompCode,
        orderId,
        UpdtUserId,
      ]);

      const dt = {
        OrderId: orderId,
      };
      this.notifyEvents.processEvents(CompCode,"CNL_ORD", data);

      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async markOrderDelete(
    CompCode: any,
    orderId: any,
    UpdtUserId: any
  ): Promise<any> {
    try {
      let query = `CALL spMarkOrderDelete (?,?,?)`;
      const data = await this.conn.query(query, [
        CompCode,
        orderId,
        UpdtUserId,
      ]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
  async orderReSchedule(
    CompCode: any,
    orderId: any,
    scheduleFrom: any,
    scheduleTo: any,
    slotId: any,
    updtUsrId: any
  ): Promise<any> {
    try {
      let query = `CALL sporderreschedule (?,?,?,?,?,?)`;
      const data = await this.conn.query(query, [
        CompCode,
        orderId,
        scheduleFrom,
        scheduleTo,
        slotId,
        updtUsrId,
      ]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getOrderDetails(CompCode: any, orderId: any): Promise<any> {
    try {
      let query = `CALL spGetOrderDetail (${CompCode},${orderId})`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async createOrder(
    CompCode: any,
    order: any,
    orderDtl: any,
    SendOrderCompleteNotification: any
  ): Promise<any> {
    let orderId = 0;
    try {
      let query = `CALL spInsOrders (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      const res = await this.conn
        .query(query, [
          order.CompCode,
          order.OrderDate,
          order.LocationId,
          order.InvoiceNo,
          order.InvoiceDate,
          order.OrderStatus,
          order.PatientId,
          order.AddressId,
          order.AssignedNurseId,
          order.OrderedUserType,
          order.OrderedUserId,
          order.GrossTotal,
          order.disc,
          order.RoundOff,
          order.NetPayable,
          order.ScheduledFrom,
          order.ScheduledTo,
          order.OrderedUserId,
          order.SlotId,
          order.OrderTitle,
          order.Reference,
          order.orderRemark,
        ])
        .then((res) => {
          orderId = res[0][0].l_OrderId;
          orderDtl.map((item) => {
            const res1 = this.conn.query(
              "CALL spInsOrdersDtl (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              [
                order.CompCode,
                res[0][0].l_OrderId,
                item.SrNo,
                item.ServiceId,
                item.ServiceTitle,
                item.ServiceType,
                item.PackageId,
                item.rate,
                item.unit,
                item.unitDesc,
                item.amount,
                item.discVal,
                item.netValue,
                order.OrderedUserId,
              ]
            );
          });

          // const data = await this.conn.query(query);
          // return  { message: "successful", data: data[0]}
        });
      // if (SendOrderSMS === true) {
      //   const sss = await this.sendTranSMS("NEW", orderId);
      // }
      if (SendOrderCompleteNotification === true) {
        const data = {
          orderId: orderId,
        };
        await this.notifyEvents.processEvents(CompCode,"CRT_ORD", data);
      }

      return {
        message: "successful",
        data: orderId,
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async sendTranSMS(pTranType: any, pOrderId: any): Promise<any> {
    try {
      let query = `CALL spGetSMSAPIData ('${pTranType}',${pOrderId})`;
      const data = await this.conn.query(query);

      // console.log(data[0])
      if (data[0].length > 0) {
        let api = data[0][0].apiData;
        this.http.post(api).subscribe((res) => {
          // console.log(res.data);
        });
      }

      return { message: "successful" };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async sendScheduleSMS(
    CompCode: any,
    ScheduleId: any,
    UpdtUsr: any
  ): Promise<any> {
    try {
      let query = `CALL spGetDataScheduleSMS (?,?,?)`;
      const data = await this.conn.query(query, [
        CompCode,
        ScheduleId,
        UpdtUsr,
      ]);

      const dt = {
        ScheduleId: ScheduleId,
      };
      this.notifyEvents.processEvents(CompCode,"SCH_ORD", dt);
      // // console.log(data[0])
      // if (data[0].length > 0) {
      //   data[0].map((ii) => {
      //     let api = ii.apiData;
      //     this.http.post(api).subscribe((res) => {
      //       // console.log(res.data);
      //     });
      //   });
      // }

      return { message: "successful" };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getDataScheduleAddOnCost(CompCode: any, ScheduleId: any): Promise<any> {
    try {
      let query = `CALL spGetDataScheduleAddOnCost (?,?)`;
      const data = await this.conn.query(query, [CompCode, ScheduleId]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getDataScheduleCheckIn(CompCode: any, ScheduleId: any): Promise<any> {
    try {
      let query = `CALL spGetDataScheduleCheckIn (?,?)`;
      const data = await this.conn.query(query, [CompCode, ScheduleId]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getDataScheduleCheckOut(CompCode: any, ScheduleId: any): Promise<any> {
    try {
      let query = `CALL spGetDataScheduleCheckOut (?,?)`;
      const data = await this.conn.query(query, [CompCode, ScheduleId]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getOrders(userType: any, userId: any): Promise<any> {
    try {
      let query = `CALL spGetOrders ('${userType}',${userId})`;
      const data = await this.conn.query(query);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async bookingPaymentCancel(
    CompCode: any,
    orderId: any,
    UpdtUserId: any
  ): Promise<any> {
    try {
      let query = `CALL spBookingPaymentFailed (?,?,?)`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query, [
        CompCode,
        orderId,
        UpdtUserId,
      ]);

      const sss = await this.sendTranSMS("PAYFAIL", orderId);

      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
  async bookingAccept(
    CompCode: any,
    orderId: any,
    UpdtUserId: any
  ): Promise<any> {
    try {
      let query = `CALL spBookingAccept (?,?,?)`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query, [
        CompCode,
        orderId,
        UpdtUserId,
      ]);

      // const sss = await this.sendTranSMS("ACCEPT", orderId);
      const dt = {
        orderId: orderId,
      };
      this.notifyEvents.processEvents(CompCode,"ACPT_ORD", dt);

      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
  async bookingReject(
    CompCode: any,
    orderId: any,
    UpdtUserId: any
  ): Promise<any> {
    try {
      let query = `CALL spBookingReject (?,?,?)`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query, [
        CompCode,
        orderId,
        UpdtUserId,
      ]);
      //const sss = await this.sendTranSMS("REJECT", orderId);
      const dt = {
        OrderId: orderId,
      };
      this.notifyEvents.processEvents(CompCode,"REJ_ORD", dt);

      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
  async assignAttendant(
    CompCode: any,
    orderId: any,
    attendantId: any,
    UpdtUserId: any
  ): Promise<any> {
    try {
      let query = `CALL spAssignAttendant (?,?,?,?)`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query, [
        CompCode,
        orderId,
        attendantId,
        UpdtUserId,
      ]);
      // const sss = await this.sendScheduleSMS(orderId);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getAttendantDataDateWise(CompCode, AttendantId, Date): Promise<any> {
    try {
      let query = `CALL spGetAttendantDataDateWise (?,?,?)`;
      const res = await this.conn.query(query, [CompCode, AttendantId, Date]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
  async getUpcompingSchedulesAttendant(CompCode, AttendantId): Promise<any> {
    try {
      let query = `CALL spGetUpComingSchedules (?,?)`;
      const res = await this.conn.query(query, [CompCode, AttendantId]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getAttendantScheduleDates(CompCode, AttendantId): Promise<any> {
    try {
      let query = `CALL spGetAttendantScheduleDates (?,?)`;
      const res = await this.conn.query(query, [CompCode, AttendantId]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getAttendantScheduleData(CompCode, ScheduleId): Promise<any> {
    try {
      let query = `CALL spGetAttendantScheduleData (?,?)`;
      const res = await this.conn.query(query, [CompCode, ScheduleId]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async InsUpdtScheduleCheckIn(
    CompCode,
    ScheduleId,
    OrderId,
    CheckInDTTM,
    latitude,
    longitude,
    // CheckInImage,
    UpdtUsr
  ): Promise<any> {
    try {
      // console.log(
      //   "start - on endpoint checkin schedule",
      //   ScheduleId,
      //   OrderId,
      //   CheckInDTTM,
      //   latitude,
      //   longitude,
      //   CheckInImage,
      //   UpdtUsr
      // );
      let query = `CALL spInsUpdtScheduleCheckIn (?,?,?,?,?,?,?,?)`;
      const res = await this.conn.query(query, [
        CompCode,
        ScheduleId,
        OrderId,
        CheckInDTTM,
        latitude,
        longitude,
        null,
        UpdtUsr,
      ]);
      console.log("end - on endpoint checkin schedule");
      return { message: "successful", data: res[0] };
    } catch (error) {
      // this.logger.error(error);
      console.log(error.message);
      throw new InternalServerErrorException();
    }
  }

  async InsUpdtScheduleCheckOut(
    CompCode,
    ScheduleId,
    OrderId,
    CheckOutDTTM,
    Observation,
    Resolution,
    CheckOutRemark,
    UpdtUsr
  ): Promise<any> {
    try {
      let query = `CALL spInsUpdtScheduleCheckOut (?,?,?,?,?,?,?,?)`;
      const res = await this.conn.query(query, [
        CompCode,
        ScheduleId,
        OrderId,
        CheckOutDTTM,
        Observation,
        Resolution,
        CheckOutRemark,
        UpdtUsr,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async InsUpdtOrderScheduleAddOnCost(
    CompCode,
    ScheduleId,
    OrderId,
    SrNo,
    ItemDesc,
    Rate,
    UpdtUsr
  ): Promise<any> {
    try {
      let query = `CALL spInsUpdtOrderScheduleAddOnCost (?,?,?,?,?,?,?)`;
      const res = await this.conn.query(query, [
        CompCode,
        ScheduleId,
        OrderId,
        SrNo,
        ItemDesc,
        Rate,
        UpdtUsr,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async attendantProcess(
    CompCode: any,
    statusCode: any,
    orderId: any,
    UpdtUserId: any,
    OrderRemark: any
  ): Promise<any> {
    try {
      let query = `CALL spAttendantProcess (?,?,?,?,?)`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query, [
        CompCode,
        statusCode,
        orderId,
        UpdtUserId,
        OrderRemark,
      ]);
      // const sss = await this.sendTranSMS("REJECT", orderId);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
  async DeleteScheduleAddOnCost(
    CompCode: any,
    orderId: any,
    scheduleId: any,
    srNo: any
  ): Promise<any> {
    try {
      let query = `CALL spDeleteAddOnCost (?,?,?,?)`;
      const data = await this.conn.query(query, [
        CompCode,
        orderId,
        scheduleId,
        srNo,
      ]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getOrderCurrentSchedule(CompCode: any, OrderId: any): Promise<any> {
    try {
      let query = `CALL spGetOrderCurrentSchedule (?,?)`;
      //return await this.conn.query(query);
      const res = await this.conn.query(query, [CompCode, OrderId]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getOrderSchedule(CompCode: any, OrderId: any): Promise<any> {
    try {
      let query = `CALL spGetOrderSchedule (?,?)`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query, [CompCode, OrderId]);

      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getAdditionalCost(CompCode: any, ScheduleId: any): Promise<any> {
    try {
      let query = `CALL spGetAdditionalCost (?,?)`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query, [CompCode, ScheduleId]);

      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async setMarkCheckIn(
    CompCode: any,
    scheduleId: any,
    markCheckIn: any,
    updtUsrId: any
  ): Promise<any> {
    try {
      let query = `CALL spMarkCheckIn (?,?,?,?)`;
      const data = await this.conn.query(query, [
        CompCode,
        scheduleId,
        markCheckIn,
        updtUsrId,
      ]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async setMarkCheckOut(
    CompCode: any,
    scheduleId: any,
    markCheckOut: any,
    updtUsrId: any
  ): Promise<any> {
    try {
      let query = `CALL spMarkCheckOut (?,?,?,?)`;
      const data = await this.conn.query(query, [
        CompCode,
        scheduleId,
        markCheckOut,
        updtUsrId,
      ]);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
}
