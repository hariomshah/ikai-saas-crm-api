import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";
import { SysSequenceConfigmasterService } from "../sys-sequence-configmaster/sys-sequence-configmaster.service";

const _ = require("lodash");

@Injectable()
export class OrderportalService {
  private logger = new Logger("OrderPortalService");
  constructor(
    private readonly conn: Connection,
    private sequenceConfig: SysSequenceConfigmasterService
  ) { }

  //getOrdersPortalHome
  async getOrdersPortalHome(CompCode, FromDate, ToDate): Promise<any> {
    try {
      let query = `CALL spGetOrdersPortalHome (?,?,?)`;
      const res = await this.conn.query(query, [CompCode, FromDate, ToDate]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async UpdateOrderSchedule(
    CompCode,
    InsUpdtType,
    ScheduleId,
    OrderId,
    ScheduleDate,
    SlotId,
    AttendantId,
    Remark,
    Status,
    UpdtUsr
  ): Promise<any> {
    try {
      let query = `CALL spUpdtOrders_schedule(?,?,?,?,?,?,?,?,?,?)`;
      const res = await this.conn.query(query, [
        CompCode,
        InsUpdtType,
        ScheduleId,
        OrderId,
        ScheduleDate,
        SlotId,
        AttendantId,
        Remark,
        Status,
        UpdtUsr,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  async ProcessOrderScheduleVisit(CompCode, OrderId, UpdtUserId): Promise<any> {
    try {
      let query = `CALL spProcessScheduleVisit(?,?,?)`;
      const res = await this.conn.query(query, [CompCode, OrderId, UpdtUserId]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getOrderScheduleVisit(CompCode, OrderId): Promise<any> {
    try {
      let query = `CALL spGetOrderScheduleVisits(?,?)`;
      const res = await this.conn.query(query, [CompCode, OrderId]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getOrderDetails(CompCode, OrderId): Promise<any> {
    try {
      let query = `CALL spGetOrderDetails(?,?)`;
      const res = await this.conn.query(query, [CompCode, OrderId]);
      // console.log(res[0])
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getOrdersPortal(CompCode, FromDate, ToDate): Promise<any> {
    try {
      let query = `CALL spGetOrdersPortal(?,?,?)`;
      const res = await this.conn.query(query, [CompCode, FromDate, ToDate]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getUpComingOrder(CompCode): Promise<any> {
    try {
      let query = `CALL spGetOrdersPortalUpComingShedules(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getDataServiceOrders(CompCode, FromDate, ToDate, UserId): Promise<any> {
    try {
      let query = `CALL spGetDataServiceOrders(?,?,?,?)`;
      const res = await this.conn.query(query, [
        CompCode,
        FromDate === "null" ? null : FromDate,
        ToDate === "null" ? null : ToDate,
        UserId === "null" ? null : UserId,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getDataServiceSchedules(
    CompCode,
    FromDate,
    ToDate,
    OrderId,
    UserId
  ): Promise<any> {
    try {
      let query = `CALL spGetDataServiceSchedules(?,?,?,?,?)`;
      const res = await this.conn.query(query, [
        CompCode,
        FromDate === "null" ? null : FromDate,
        ToDate === "null" ? null : ToDate,
        OrderId === "null" ? null : OrderId,
        UserId === "null" ? null : UserId,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  //Atul 20200619
  async getDataServiceSchedulesVisit(
    CompCode,
    ScheduleId,
    OrderId
  ): Promise<any> {
    try {
      let query = `CALL spGetSchedulesVisitData(?,?,?)`;
      const res = await this.conn.query(query, [CompCode, ScheduleId, OrderId]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  async getDataServiceSchedulesAddonCost(
    CompCode,
    ScheduleId,
    OrderId
  ): Promise<any> {
    try {
      let query = `CALL spGetDataScheduleAdditionalCost(?,?,?)`;
      const res = await this.conn.query(query, [CompCode, ScheduleId, OrderId]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async InsUpdtOrderSchedule(
    CompCode,
    ScheduleId,
    OrderId,
    ScheduleDate,
    SlotId,
    AttendantId,
    Remark,
    Status,
    UpdtUsr
  ): Promise<any> {
    try {
      let query = `CALL spInsUpdtOrderSchedule(?,?,?,?,?,?,?,?,?)`;
      const res = await this.conn.query(query, [
        CompCode,
        ScheduleId,
        OrderId,
        ScheduleDate,
        SlotId,
        AttendantId,
        Remark,
        Status,
        UpdtUsr,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async InsUpdtOrderScheduleAddOnCost(pdata): Promise<any> {
    try {
      const tdata = pdata.Data;
      let res = [];
      if (tdata.isDeleted === false) {
        // console.log(tdata);
        let query = `CALL spInsUpdtOrderScheduleAddOnCost (?,?,?,?,?,?,?)`;
        res = await this.conn.query(query, [
          pdata.CompCode,
          tdata.ScheduleId,
          tdata.OrderId,
          tdata.SrNo,
          tdata.ItemDesc,
          tdata.Rate,
          pdata.UpdtUsr,
        ]);
      } else if (tdata.isDeleted === true) {
        let deleteQuery = `delete from orders_schedule_add_on_costs where CompCode=${pdata.CompCode} and ScheduleId=${tdata.ScheduleId} 
        and  OrderId= ${tdata.OrderId} and SrNo=${tdata.SrNo}`;
        // console.log(deleteQuery,"hhh")
        const res = await this.conn.query(deleteQuery, []);
      }
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getServiceOrder(CompCode: any, orderId: any): Promise<any> {
    try {
      let query = `CALL spGetOrderDetails ('${CompCode}','${orderId}')`;
      //return await this.conn.query(query);
      const data = await this.conn.query(query);
      return { message: "successful", data: data[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async InsOrderSchedule(data): Promise<any> {
    // console.log(data);
    try {
      let query = `CALL spInsOrderSchedule (?,?,?,?,?)`;
      const res = await this.conn.query(query, [
        data.CompCode,
        data.OrderId,
        data.ScheduleDate,
        data.Slot,
        data.UpdtUsr,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async cancelSchedule(data: any): Promise<any> {
    // console.log(data);
    try {
      let query = `CALL spCancelSchedule (?,?,?)`;
      const res = await this.conn.query(query, [
        data.CompCode,
        data.OrderId,
        data.UpdtUsr,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  async GetPreInvoiceDataService(CompCode: any, OrderId: any, ScheduleId: any): Promise<any> {
    try {
      let query = `CALL spGetPreInvoiceDataService (?,?)`;
      const res = await this.conn.query(query, [CompCode, OrderId, ScheduleId]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  // serviceScheduleAcknowledge
  async serviceScheduleAcknowledge(data: any): Promise<any> {
    // console.log(data);
    try {
      let query;
      query = `CALL spServiceScheduleAcknowledge (?,?,?,?,?)`;
      await this.conn.query(query, [
        data.CompCode,
        data.OrderId,
        data.ScheduleId,
        data.AckRemark,
        data.UpdtUsr,
      ]);

      if (data.AskFeedback === true) {
        query = `CALL spInsFeedbackTran (?,?,?,?,?,?,?,?,?,?,?)`;
        await this.conn.query(query, [
          data.CompCode,
          "SRVSCH",
          data.OrderId,
          data.ScheduleId,
          null,
          null,
          null,
          null,
          null,
          "PND",
          data.UpdtUsr,
        ]);
      }

      return { message: "successful" };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async saveServiceInvoice(data: any): Promise<any> {
    let l_VoucherNo;
    if (_.includes([undefined, null, ""], data.invoiceHdr.InvoiceNo)) {
      const seqData = {
        CompCode: data.invoiceHdr.CompCode,
        TranType: "INV",
        updt_usr: data.invoiceHdr.UpdtUsr,
      };
      let TranNextTranNo = await this.sequenceConfig.getSequenceNextVal(
        seqData
      );
      l_VoucherNo = TranNextTranNo.data[0].NextVal;
    } else {
      l_VoucherNo = data.invoiceHdr.InvoiceNo;
    }

    let invoiceId = 0;
    try {
      let query = `CALL spInsInvoiceHdr(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      const res = await this.conn
        .query(query, [
          l_VoucherNo,
          data.invoiceHdr.InvoiceDate,
          data.invoiceHdr.CompCode,
          data.invoiceHdr.BranchCode,
          data.invoiceHdr.CustId,
          data.invoiceHdr.CustAddressId,
          data.invoiceHdr.SysOption1,
          data.invoiceHdr.SysOption2,
          data.invoiceHdr.SysOption3,
          data.invoiceHdr.SysOption4,
          data.invoiceHdr.SysOption5,
          data.invoiceHdr.InvoiceRemark,
          data.invoiceHdr.GrossAmount,
          data.invoiceHdr.DiscAmount,
          data.invoiceHdr.TaxAmount,
          data.invoiceHdr.RoundOff,
          data.invoiceHdr.InvoiceAmount,
          data.invoiceHdr.SettlementAmount,
          data.invoiceHdr.UpdtUsr,
        ])
        .then((res) => {
          invoiceId = res[0][0].InvoiceId;

          // console.log("header res", res);
          data.invoiceDtl.map(async (item) => {

            // console.log(item, "generated invoice ID")
            const res1 = await this.conn.query(
              "CALL spInsInvoiceDTL(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              [
                item.CompCode,
                invoiceId,
                item.SrNo,
                item.ItemType,
                item.ItemCode,
                item.ItemName,
                item.ItemDesc,
                item.HSNSACCode,
                item.TaxCode,
                item.UnitCode,
                item.UnitName,
                item.Qty,
                item.Rate,
                item.Disc,
                item.Amount,
                item.SGST,
                item.CGST,
                item.UGST,
                item.IGST,
                item.Surcharge,
                item.Cess,
                item.SysOption1,
                item.SysOption2,
                item.SysOption3,
                item.SysOption4,
                item.SysOption5,
                item.UpdtUsr,
              ]
            ).catch(async (err) => {
              console.log(err,"error invoice save")
              throw new InternalServerErrorException(err);
            });
          });
        });
      return {
        message: "successful",
        data: {
          InvoiceId: invoiceId,
          InvoiceDate: data.invoiceHdr.InvoiceDate,
          invoiceNo: data.invoiceHdr.InvoiceNo,
        },
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
