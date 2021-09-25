import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";
import { async } from "rxjs/internal/scheduler/async";

@Injectable()
export class CustomerOutstandingService {
  private logger = new Logger("DashboardService");
  constructor(private readonly conn: Connection) {}

  async getCustOutstandingData(CompCode,CustId): Promise<any> {
    try {
      let query = `CALL spGetCustomerOutstandingService (${CompCode},${CustId})`;
      const res = await this.conn.query(query, []);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getBillSettlementData(CompCode, FromDate, ToDate, CustId): Promise<any> {
    try {
      // console.log(FromDate, ToDate, CustId);
      let query = `CALL spGetDataBillSettlementService(?,?,?,?)`;
      const res = await this.conn.query(query, [
        CompCode,
        FromDate === "null" ? null : FromDate,
        ToDate === "null" ? null : ToDate,
        CustId === "null" ? null : CustId,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getDataReciepts(CompCode,CustId): Promise<any> {
    try {
      let query = `call spGetDataReciepts(${CompCode},${CustId})`;
      const res = await this.conn.query(query, []);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async InsReceiptStlmnt(data: any): Promise<any> {
    try {
      let query = `CALL spInsReceiptStlmnt(?,?,?,?,?,?,?,?,?)`;
      let query1 = `CALL spUpdateInvoiceSettlementAmount(?,?,?,?)`;
      let query2 = `CALL spUpdateReceiptBalanceAmount(?,?,?,?)`;
      let response = [];
      data.forEach(async (ii) => {
        const res = await this.conn.query(query, [
          ii.CompCode,
          ii.ReceiptId,
          ii.SettlementDate,
          ii.SettlementType,
          ii.AdjTranNo,
          ii.AdjTranDate,
          ii.Amount,
          ii.SettlementRemark,
          ii.updt_usr,
        ]);
        const res1 = await this.conn.query(query1, [
          ii.CompCode,
          ii.AdjTranNo,
          ii.Amount,
          ii.updt_usr,
        ]);
        const res2 = await this.conn.query(query2, [
          ii.CompCode,
          ii.ReceiptId,
          ii.Amount,
          ii.updt_usr,
        ]);
        response.push(res[0]);
      });
      // console.log(data);
      return { message: "successful", data: response };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
