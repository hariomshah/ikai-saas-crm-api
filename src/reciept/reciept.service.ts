import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class RecieptService {
  private logger = new Logger("RecieptService");
  constructor(private readonly conn: Connection) { }

  async getRecieptHdrData(CompCode, FromDate, ToDate, RecieptNo): Promise<any> {
    // console.log(FromDate, ToDate);
    try {
      let query = `CALL spGetReceiptHdr(?,?,?,?)`;
      const res = await this.conn.query(query, [
        CompCode, 
        FromDate === "null" ? null : FromDate,
        ToDate === "null" ? null : ToDate,
        RecieptNo === "null" ? null : RecieptNo,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getRecieptDtlData(CompCode, RecieptId): Promise<any> {
    try {
      let query = `CALL spGetRecieptDtl(?,?)`;
      const res = await this.conn.query(query, [CompCode, RecieptId]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async DeleteRcptHdr(CompCode: any,RecieptId: any): Promise<any> {
    try {
      let query = `call spDeleteReciept('${CompCode}','${RecieptId}')`;
      // console.log(RecieptId, query);
      const res = await this.conn.query(query);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async InsUpdtRcptHdr(data: any): Promise<any> {
    try {
      const dataSource = [...data.Dtl];
      let query = `CALL spInsUpdtRcptHdr(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

      const res = await this.conn
        .query(query, [
          data.CompCode,
          data.Hdr.ReceiptId,
          data.Hdr.ReceiptType,
          data.Hdr.Value1,
          data.Hdr.Value2,
          data.Hdr.Value3,
          data.Hdr.Value4,
          data.Hdr.Value5,
          data.Hdr.ReceiptDate,
          data.Hdr.ReceiptNo,
          data.Hdr.Amount,
          data.Hdr.BalAmount,
          data.Hdr.Remark,
          data.updt_usr,
        ])
        .then(async (res) => {
          try {
            if (dataSource.length > 0) {
              dataSource.map(async (item) => {
                // console.log(item, "detail");
                if (!item.isDeleted) {
                  let dtlQuery = `CALL spInsUpdtRcptDtl(?,?,?,?,?,?,?,?,?,?,?,?)`;
                  await this.conn.query(dtlQuery, [
                    data.CompCode,
                    item.Id,
                    res[0][0].ReceiptId,
                    item.PaymentMode,
                    item.Amount,
                    item.Remark,
                    item.SysOption1,
                    item.SysOption2,
                    item.SysOption3,
                    item.SysOption4,
                    item.SysOption5,
                    data.updt_usr,
                  ]);
                } else if (item.isDeleted === true) {
                  let deleteQuery = `delete from receipt_dtl where Id=${item.Id} 
                and  ReceiptId= ${item.ReceiptId} `;
                  // console.log(deleteQuery,"hhh")
                  const res = await this.conn.query(deleteQuery, []);
                }
              });
            }

            return res;
          } catch (err) {
            this.logger.error(err);
          }
        });

      return { message: "successful", data: dataSource };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getRecieptRefundHdrData(CompCode, FromDate, ToDate, RefundNo): Promise<any> {
    // console.log(FromDate, ToDate);
    try {
      let query = `CALL spGetRecieptRefundHdr(?,?,?,?)`;
      const res = await this.conn.query(query, [
        CompCode, 
        FromDate === "null" ? null : FromDate,
        ToDate === "null" ? null : ToDate,
        RefundNo === "null" ? null : RefundNo,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getRecieptRefundDtlData(CompCode, RefundId): Promise<any> {
    try {
      let query = `CALL spGetRecieptRefundDtl(?.?)`;
      const res = await this.conn.query(query, [CompCode, RefundId]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async DeleteRefund(data: any): Promise<any> {
    try {
      let query = `call spDeleteRefund(${data.CompCode},${data.RefundId},${data.ReceiptId},${data.BalAmount})`;
      const res = await this.conn.query(query);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getRecieptBalAmountData(CompCode): Promise<any> {
    try {
      let query = `CALL spGetRecieptBalAmountData(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
  async InsUpdtRefund(data: any, updtRcptHdr: any): Promise<any> {
    try {
      const dataSource = data.Dtl;

      let query = `CALL spInsUpdtRefundHdr(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      const res = await this.conn
        .query(query, [
          data.CompCode,
          data.Hdr.RefundId,
          data.Hdr.RefundType,
          data.Hdr.Value1,
          data.Hdr.Value2,
          data.Hdr.Value3,
          data.Hdr.Value4,
          data.Hdr.Value5,
          data.Hdr.RefundDate,
          data.Hdr.RefundNo,
          data.Hdr.Amount,
          data.Hdr.ReceiptId,
          data.Hdr.ReceiptDate,
          data.Hdr.Remark,
          data.updt_usr,
          data.balAmount,
        ])
        .then(async (res) => {
          if (updtRcptHdr) {
            await this.conn.query(`UPDATE receipt_hdr 
            SET     BalAmount = ${data.balAmount}
            WHERE   ReceiptId = ${data.Hdr.ReceiptId};
          `)
          }
          try {
            if (dataSource.length > 0) {
              dataSource.map(async (item) => {
                // console.log(item);
                if (!item.isDeleted) {
                  let dtlQuery = `CALL spInsUpdtRefundDtl(?,?,?,?,?,?,?)`;
                  const dtlRes = await this.conn.query(dtlQuery, [
                    data.CompCode,
                    item.Id,
                    res[0][0].RefundId,
                    item.PaymentMode,
                    item.Amount,
                    item.Remark,
                    data.updt_usr,
                  ])
                } else if (item.isDeleted === true) {
                  let deleteQuery = `delete from receipt_rfnd_dtl where Id=${item.Id} 
                and  RefundId= ${item.RefundId} `;
                  // console.log(deleteQuery,"hhh")
                  const res = await this.conn.query(deleteQuery, []);
                }
              });
            }

            return res;
          } catch (err) {
            this.logger.error(err);
          }
        });

      return { message: "successful", data: dataSource, hdrRes: res };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async updtPosInvoiceSettlementAmount(data: any): Promise<any> {
    try {
      // console.log(data);
      let query = `CALL spUpdateInvoiceSettlementAmount(?,?,?,?)`;
      const res = await this.conn.query(query, [
        data.CompCode,
        data.InvoiceId,
        data.Amount,
        data.updt_usr,
      ]);
      let query1 = `CALL spInsReceiptStlmnt(?,?,?,?,?,?,?,?,?)`;
      const res1 = await this.conn.query(query1, [
        data.CompCode,
        data.ReceiptId,
        data.SettlementDate,
        data.SettlementType,
        data.AdjTranNo,
        data.AdjTranDate,
        data.Amount,
        data.SettlementRemark,
        data.updt_usr,
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getRecieptHdrPOS(CompCode, RecieptId): Promise<any> {
    try {
      let query = `CALL spGetReceiptHdrDataPOS(?,?)`;
      const res = await this.conn.query(query, [CompCode, RecieptId]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }


  async updateReceiptSettlementAmount(data: any): Promise<any> {
    try {
      // console.log(data);
      let query = `CALL spUpdateReceiptSettlementAmount(?,?,?,?)`;
      const res = await this.conn.query(query, [
        data.CompCode,
        data.ReceiptId,
        data.Amount,
        data.updt_usr,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }


  async InsReceiptSettlement(data: any): Promise<any> {
    try {
      // console.log(data);
      let query = `CALL spInsReceiptStlmnt(?,?,?,?,?,?,?,?,?)`;
      const res = await this.conn.query(query, [
        data.CompCode,
        data.ReceiptId,
        data.SettlementDate,
        data.SettlementType,
        data.AdjTranNo,
        data.AdjTranDate,
        data.Amount,
        data.SettlementRemark,
        data.updt_usr,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

}
