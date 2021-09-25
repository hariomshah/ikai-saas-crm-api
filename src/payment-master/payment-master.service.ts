import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from "constants";
import moment = require("moment");
import { Connection } from "typeorm";
import { SysSequenceConfigmasterService } from "../sys-sequence-configmaster/sys-sequence-configmaster.service";
const _ = require("lodash");

@Injectable()
export class PaymentMasterService {
  private logger = new Logger("PaymentMasterService");
  constructor(
    private readonly conn: Connection,
    private sequenceConfig: SysSequenceConfigmasterService
  ) { }

  async getPaymentHdrData(CompCode, FromDate, ToDate, PaymetNo): Promise<any> {
    // console.log(FromDate, ToDate, PaymetNo);
    try {
      let query = `CALL spGetPaymentHdr(?,?,?,?)`;
      const res = await this.conn.query(query, [
        CompCode,
        FromDate === "null" ? null : FromDate,
        ToDate === "null" ? null : ToDate,
        PaymetNo === "null" ? null : PaymetNo,
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getPaymentDtlData(CompCode, PaymentId): Promise<any> {
    try {
      let query = `CALL spGetPaymentDtl(?,?)`;
      const res = await this.conn.query(query, [CompCode, PaymentId]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //getReceiptAndPayments
  async getReceiptAndPayments(
    CompCode,
    TranType,
    FromDate,
    ToDate
  ): Promise<any> {
    try {
      // console.log(TranType, FromDate, ToDate);
      let query = `CALL spGetReceiptAndPayments(?,?,?,?)`;
      const res = await this.conn.query(query, [
        CompCode,
        TranType,
        FromDate,
        ToDate,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //getReceiptAndPaymentsWithDetails
  async getReceiptAndPaymentsWithDetails(
    CompCode,
    TranType,
    TranId
  ): Promise<any> {
    try {
      let query = `CALL spGetReceiptAndPaymentsWithDetails(?,?,?)`;
      const res = await this.conn.query(query, [CompCode, TranType, TranId]);
      return {
        message: "successful",
        data: { HdrData: res[0], DtlData: res[1] },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //spGetReceiptAndPaymentReferenceHelp
  async getReceiptAndPaymentReferenceHelp(CompCode): Promise<any> {
    try {
      let query = `CALL spGetReceiptAndPaymentReferenceHelp(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return {
        message: "successful",
        data: res[0],
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //getDataDayBookDetails
  async getDataDayBookDetails(CompCode, pFromDate, pToDate): Promise<any> {
    try {
      let query = `CALL spGetDataDayBookDetails(?,?,?)`;
      const res = await this.conn.query(query, [CompCode, pFromDate, pToDate]);
      return {
        message: "successful",
        data: res[0],
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //deleteReceiptAndPayment
  async deleteReceiptAndPayment(CompCode, pTranType, pTranId): Promise<any> {
    try {
      if (
        pTranType === "RCT" ||
        pTranType === "INC" ||
        pTranType === "TRNFR" ||
        pTranType === "GNRCIN"
      ) {
        let query = `CALL spV2DeleteReceiptCompletely(?,?)`;
        await this.conn.query(query, [CompCode, pTranId]);
      } else {
        let query = `CALL spV2DeletePaymentCompletely(?,?)`;
        await this.conn.query(query, [CompCode, pTranId]);
      }

      return {
        message: "successful",
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //saveInsReceiptAndPayment
  async saveInsReceiptAndPayment(pData): Promise<any> {
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // console.log(pData);
      if (pData.hdrData.TranId > 0) {
        //Edit Mode
        //Receipts and Income's
        if (
          pData.hdrData.TranType === "RCT" ||
          pData.hdrData.TranType === "INC"
        ) {
          await queryRunner
            .query("call spV2UpdtReceiptHdr(?,?,?,?,?,?,?,?,?,?,?,?);", [
              pData.CompCode,
              pData.hdrData.TranId,
              pData.hdrData.Amount,
              pData.hdrData.BalAmount,
              pData.hdrData.Remark,
              pData.hdrData.TranDate,
              pData.hdrData.RefCode,
              null,
              null,
              null,
              null,
              pData.hdrData.UpdtUsr,
            ])
            .catch(async (err) => {
              // console.log(err, "Error on spV2UpdtReceiptHdr");
              // await queryRunner.rollbackTransaction();
              // return false;
              throw new InternalServerErrorException(err);
            });

          await queryRunner
            .query("call spV2DeleteReceiptDtl(?,?);", [
              pData.CompCode,
              pData.hdrData.TranId,
            ])
            .catch(async (err) => {
              throw new InternalServerErrorException(err);
            });

          await queryRunner
            .query("call spV2DeleteReceiptStlmnt(?,?);", [
              pData.CompCode,
              pData.hdrData.TranId,
            ])
            .catch(async (err) => {
              throw new InternalServerErrorException(err);
            });

          let i = 0;
          // console.log(pData.dtlData);
          for (i; i < pData.dtlData.length; i++) {
            await queryRunner
              .query("CALL spV2InsReceiptDtl(?,?,?,?,?,?,?,?,?,?,?)", [
                pData.CompCode,
                pData.hdrData.TranId,
                pData.dtlData[i].PaymentMode,
                pData.dtlData[i].Amount,
                pData.dtlData[i].Remark,
                null,
                null,
                null,
                null,
                null,
                pData.hdrData.UpdtUsr,
              ])
              .catch(async (err) => {
                throw new InternalServerErrorException(err);
              });
          }

          if (pData.hdrData.TranType === "INC") {
            // console.log("inside incomre", pData.hdrData.TranDate);
            await queryRunner
              .query("CALL spV2InsReceiptStlmnt(?,?,?,?,?,?,?,?,?)", [
                pData.CompCode,
                pData.hdrData.TranId,
                pData.hdrData.TranDate,
                pData.hdrData.TranType,
                pData.hdrData.TranId,
                pData.hdrData.TranDate,
                pData.hdrData.Amount,
                "*SELF SETTLED DOC*",
                pData.hdrData.UpdtUsr,
              ])
              .catch(async (err) => {
                throw new InternalServerErrorException(err);
              });
          }
        } else if (
          pData.hdrData.TranType === "PMT" ||
          pData.hdrData.TranType === "EXPS"
        ) {
          //Change on 20200203 for not updating trandate --Atul
          await queryRunner
            .query("call spV2UpdtPaymentHdr(?,?,?,?,?,?,?,?,?,?,?,?);", [
              pData.CompCode,
              pData.hdrData.TranId,
              pData.hdrData.TranDate,
              pData.hdrData.Amount,
              pData.hdrData.BalAmount,
              pData.hdrData.Remark,
              pData.hdrData.RefCode,
              null,
              null,
              null,
              null,
              pData.hdrData.UpdtUsr,
            ])
            .catch(async (err) => {
              throw new InternalServerErrorException(err);
            });

          let payDtl = await queryRunner
            .query("call spV2DeletePaymentDtl(?,?);", [
              pData.CompCode,
              pData.hdrData.TranId,
            ])
            .catch(async (err) => {
              throw new InternalServerErrorException(err);
            });

          await queryRunner
            .query("call spV2DeletePaymentStlmnt(?,?);", [
              pData.CompCode,
              pData.hdrData.TranId,
            ])
            .catch(async (err) => {
              throw new InternalServerErrorException(err);
            });
          if (payDtl) {
            let i = 0;
            for (i; i < pData.dtlData.length; i++) {
              await queryRunner
                .query("CALL spV2InsPaymentDtl(?,?,?,?,?,?,?,?,?,?,?)", [
                  pData.CompCode,
                  pData.hdrData.TranId,
                  pData.dtlData[i].PaymentMode,
                  pData.dtlData[i].Amount,
                  pData.dtlData[i].Remark,
                  null,
                  null,
                  null,
                  null,
                  null,
                  pData.hdrData.UpdtUsr,
                ])
                .catch(async (err) => {
                  throw new InternalServerErrorException(err);
                });
            }
          }
          if (pData.hdrData.TranType === "EXPS") {
            await queryRunner
              .query("CALL spV2InsPaymentStlmnt(?,?,?,?,?,?,?,?,?)", [
                pData.CompCode,
                pData.hdrData.TranId,
                pData.hdrData.TranDate,
                pData.hdrData.TranType,
                pData.hdrData.TranId,
                pData.hdrData.TranDate,
                pData.hdrData.Amount,
                "*SELF SETTLED DOC*",
                pData.hdrData.UpdtUsr,
              ])
              .catch(async (err) => {
                throw new InternalServerErrorException(err);
              });
          }
        } else if (
          pData.hdrData.TranType === "GNRCIN" ||
          pData.hdrData.TranType === "GNRCOUT"
        ) {
          if (pData.hdrData.TranType === "GNRCIN") {

            await queryRunner
              .query("call spV2UpdtReceiptHdr(?,?,?,?,?,?,?,?,?,?,?,?);", [
                pData.CompCode,
                pData.hdrData.TranId,
                pData.hdrData.Amount,
                pData.hdrData.BalAmount,
                pData.hdrData.Remark,
                pData.hdrData.TranDate,
                pData.hdrData.RefCode,
                null,
                null,
                null,
                null,
                pData.hdrData.UpdtUsr,
              ])
              .catch(async (err) => {
                // await queryRunner.rollbackTransaction();
                // return false;
                throw new InternalServerErrorException(err);
              });

            await queryRunner
              .query("call spV2DeleteReceiptDtl(?,?);", [
                pData.CompCode,
                pData.hdrData.TranId,
              ])
              .catch(async (err) => {
                throw new InternalServerErrorException(err);
              });

            let i = 0;
            // console.log(pData.dtlData);
            for (i; i < pData.dtlData.length; i++) {
              await queryRunner
                .query("CALL spV2InsReceiptDtl(?,?,?,?,?,?,?,?,?,?,?)", [
                  pData.CompCode,
                  pData.hdrData.TranId,
                  pData.dtlData[i].PaymentMode,
                  pData.dtlData[i].Amount,
                  pData.dtlData[i].Remark,
                  null,
                  null,
                  null,
                  null,
                  null,
                  pData.hdrData.UpdtUsr,
                ])
                .catch(async (err) => {
                  throw new InternalServerErrorException(err);
                });
            }
          } else {
            await queryRunner
              .query("call spV2UpdtPaymentHdr(?,?,?,?,?,?,?,?,?,?,?,?);", [
                pData.CompCode,
                pData.hdrData.TranId,
                pData.hdrData.TranDate,
                pData.hdrData.Amount,
                pData.hdrData.BalAmount,
                pData.hdrData.Remark,
                pData.hdrData.RefCode,
                null,
                null,
                null,
                null,
                pData.hdrData.UpdtUsr,
              ])
              .catch(async (err) => {
                throw new InternalServerErrorException(err);
              });

            let payDtl = await queryRunner
              .query("call spV2DeletePaymentDtl(?,?);", [
                pData.CompCode,
                pData.hdrData.TranId,
              ])
              .catch(async (err) => {
                throw new InternalServerErrorException(err);
              });


            if (payDtl) {
              let i = 0;
              for (i; i < pData.dtlData.length; i++) {
                await queryRunner
                  .query("CALL spV2InsPaymentDtl(?,?,?,?,?,?,?,?,?,?,?)", [
                    pData.CompCode,
                    pData.hdrData.TranId,
                    pData.dtlData[i].PaymentMode,
                    pData.dtlData[i].Amount,
                    pData.dtlData[i].Remark,
                    null,
                    null,
                    null,
                    null,
                    null,
                    pData.hdrData.UpdtUsr,
                  ])
                  .catch(async (err) => {
                    throw new InternalServerErrorException(err);
                  });
              }
            }
          }
        }
        //Payments and Expenses's
      } else {
        //Add Mode
        //Receipts and Income's
        if (
          pData.hdrData.TranType === "RCT" ||
          pData.hdrData.TranType === "INC"
        ) {
          let l_TranNo;
          let l_TranId = pData.hdrData.TranId;
          if (pData.hdrData.TranNo === "") {
            const seqData = {
              CompCode: pData.CompCode,
              TranType:
                pData.hdrData.TranType === "RCT"
                  ? "RCPT"
                  : pData.hdrData.TranType,
              updt_usr: pData.hdrData.UpdtUsr,
            };
            let TranNextTranNo = await this.sequenceConfig.getSequenceNextVal(
              seqData
            );
            l_TranNo = TranNextTranNo.data[0].NextVal;
          } else {
            l_TranNo = pData.hdrData.TranNo;
          }

          let TranIdInfo = await queryRunner
            .query("call spV2InsReceiptHdr(?,?,?,?,?,?,?,?,?,?,?,?,?);", [
              pData.CompCode,
              pData.hdrData.TranType === "RCT" ? "CUST" : "INC",
              pData.hdrData.RefCode,
              null,
              null,
              null,
              null,
              pData.hdrData.TranDate,
              l_TranNo,
              pData.hdrData.Amount,
              pData.hdrData.TranType === "RCT" ? pData.hdrData.BalAmount : 0,
              pData.hdrData.Remark,
              pData.hdrData.UpdtUsr,
            ])
            .catch(async (err) => {
              throw new InternalServerErrorException(err);
            });

          l_TranId = TranIdInfo[0][0].TranId;
          // console.log("received daata", l_TranId, l_TranNo, l_TranId);

          let i = 0;
          for (i; i < pData.dtlData.length; i++) {
            await queryRunner
              .query("CALL spV2InsReceiptDtl(?,?,?,?,?,?,?,?,?,?,?)", [
                pData.CompCode,
                l_TranId,
                pData.dtlData[i].PaymentMode,
                pData.dtlData[i].Amount,
                pData.dtlData[i].Remark,
                null,
                null,
                null,
                null,
                null,
                pData.hdrData.UpdtUsr,
              ])
              .catch(async (err) => {
                throw new InternalServerErrorException(err);
              });
          }

          if (pData.hdrData.TranType === "INC") {
            await queryRunner
              .query("CALL spV2InsReceiptStlmnt(?,?,?,?,?,?,?,?,?)", [
                pData.CompCode,
                l_TranId,
                pData.hdrData.TranDate,
                pData.hdrData.TranType,
                l_TranId,
                pData.hdrData.TranDate,
                pData.hdrData.Amount,
                "*SELF SETTLED DOC*",
                pData.hdrData.UpdtUsr,
              ])
              .catch(async (err) => {
                throw new InternalServerErrorException(err);
              });
          }

          if (pData.stlmntData && pData.stlmntData.Amount > 0) {
            // console.log("before stlmnt call ");
            await queryRunner
              .query("CALL spV2InsReceiptStlmnt(?,?,?,?,?,?,?,?,?)", [
                pData.CompCode,
                l_TranId,
                pData.hdrData.TranDate,
                pData.stlmntData.SettlementType,
                pData.stlmntData.InvoiceId,
                pData.stlmntData.InvoiceDate,
                pData.stlmntData.Amount,
                `*AUTO RECEIPT AGAINST SALE INV-SALE ${l_TranId}*`,
                pData.hdrData.UpdtUsr,
              ])
              .catch(async (err) => {
                throw new InternalServerErrorException(err);
              });

            await queryRunner
              .query("CALL spUpdateINVSaleInvoiceStlmntAmount(?,?,?,?)", [
                pData.CompCode,
                pData.stlmntData.InvoiceId,
                pData.stlmntData.Amount,
                pData.hdrData.UpdtUsr,
              ])
              .catch(async (err) => {
                throw new InternalServerErrorException(err);
              });
          }
        } else if (
          pData.hdrData.TranType === "PMT" ||
          pData.hdrData.TranType === "EXPS"
        ) {
          //Payments and Expenses's

          let l_TranNo;
          let l_TranId = pData.hdrData.TranId;
          if (pData.hdrData.TranNo === "") {
            const seqData = {
              CompCode: pData.CompCode,
              TranType:
                pData.hdrData.TranType === "PMT"
                  ? "PYMNT"
                  : pData.hdrData.TranType === "EXPS"
                    ? "EXP"
                    : pData.hdrData.TranType,
              updt_usr: pData.hdrData.UpdtUsr,
            };
            let TranNextTranNo = await this.sequenceConfig.getSequenceNextVal(
              seqData
            );
            l_TranNo = TranNextTranNo.data[0].NextVal;
          } else {
            l_TranNo = pData.hdrData.TranNo;
          }

          let TranIdInfo = await queryRunner
            .query("call spV2InsPaymentHdr(?,?,?,?,?,?,?,?,?,?,?,?,?);", [
              pData.CompCode,
              pData.hdrData.TranType === "PMT" ? "CUST" : "EXPS",
              pData.hdrData.TranDate,
              l_TranNo,
              pData.hdrData.Amount,
              pData.hdrData.TranType === "PMT" ? pData.hdrData.BalAmount : 0,
              pData.hdrData.Remark,
              pData.hdrData.RefCode,
              null,
              null,
              null,
              null,
              pData.hdrData.UpdtUsr,
            ])
            .catch(async (err) => {
              throw new InternalServerErrorException(err);
            });

          l_TranId = TranIdInfo[0][0].TranId;
          // console.log("received daata", l_TranId, l_TranNo);

          let i = 0;
          for (i; i < pData.dtlData.length; i++) {
            await queryRunner
              .query("CALL spV2InsPaymentDtl(?,?,?,?,?,?,?,?,?,?,?)", [
                pData.CompCode,
                l_TranId,
                pData.dtlData[i].PaymentMode,
                pData.dtlData[i].Amount,
                pData.dtlData[i].Remark,
                null,
                null,
                null,
                null,
                null,
                pData.hdrData.UpdtUsr,
              ])
              .catch(async (err) => {
                throw new InternalServerErrorException(err);
              });
          }

          if (pData.hdrData.TranType === "EXPS") {
            await queryRunner
              .query("CALL spV2InsPaymentStlmnt(?,?,?,?,?,?,?,?,?)", [
                pData.CompCode,
                l_TranId,
                pData.hdrData.TranDate,
                pData.hdrData.TranType,
                l_TranId,
                pData.hdrData.TranDate,
                pData.hdrData.Amount,
                "*SELF SETTLED DOC*",
                pData.hdrData.UpdtUsr,
              ])
              .catch(async (err) => {
                throw new InternalServerErrorException(err);
              });
          }
        } else if (
          pData.hdrData.TranType === "GNRCIN" ||
          pData.hdrData.TranType === "GNRCOUT"
        ) {
          let l_TranNo;
          let l_TranId = pData.hdrData.TranId;
          if (_.includes([undefined, null, ""], pData.hdrData.TranNo)) {
            console.log("iam if 1");
            const seqData = {
              CompCode: pData.CompCode,
              TranType:
                pData.hdrData.TranType === "GNRCIN"
                  ? "GNRCIN"
                  : pData.hdrData.TranType === "GNRCOUT"
                    ? "GNRCOUT"
                    : "",
              updt_usr: pData.hdrData.UpdtUsr,
            };
            let TranNextTranNo = await this.sequenceConfig.getSequenceNextVal(
              seqData
            );
            l_TranNo = TranNextTranNo.data[0].NextVal;
          } else {
            l_TranNo = pData.hdrData.TranNo;
          }

          if (pData.hdrData.TranType === "GNRCIN") {
            let TranIdInfo = await queryRunner
              .query("call spV2InsReceiptHdr(?,?,?,?,?,?,?,?,?,?,?,?,?);", [
                pData.CompCode,
                pData.hdrData.TranType,
                pData.hdrData.RefCode,
                null,
                null,
                null,
                null,
                pData.hdrData.TranDate,
                l_TranNo,
                pData.hdrData.Amount,
                0,
                pData.hdrData.Remark,
                pData.hdrData.UpdtUsr,
              ])
              .catch(async (err) => {
                throw new InternalServerErrorException(err);
              });

            l_TranId = TranIdInfo[0][0].TranId;
            let i = 0;
            for (i; i < pData.dtlData.length; i++) {
              await queryRunner
                .query("CALL spV2InsReceiptDtl(?,?,?,?,?,?,?,?,?,?,?)", [
                  pData.CompCode,
                  l_TranId,
                  pData.dtlData[i].PaymentMode,
                  pData.dtlData[i].Amount,

                  pData.dtlData[i].Remark,
                  null,
                  null,
                  null,
                  null,
                  null,
                  pData.hdrData.UpdtUsr,
                ])
                .catch(async (err) => {
                  console.log(err);
                  throw new InternalServerErrorException(err);
                });
            }
          } else {
            let TranIdInfo = await queryRunner
              .query("call spV2InsPaymentHdr(?,?,?,?,?,?,?,?,?,?,?,?,?);", [
                pData.CompCode,
                pData.hdrData.TranType,
                pData.hdrData.TranDate,
                l_TranNo,
                pData.hdrData.Amount,
                0,
                pData.hdrData.Remark,
                pData.hdrData.RefCode,
                null,
                null,
                null,
                null,
                pData.hdrData.UpdtUsr,
              ])
              .catch(async (err) => {
                throw new InternalServerErrorException(err);
              });

            l_TranId = TranIdInfo[0][0].TranId;
            // console.log("received daata", l_TranId, l_TranNo);

            let i = 0;
            for (i; i < pData.dtlData.length; i++) {
              await queryRunner
                .query("CALL spV2InsPaymentDtl(?,?,?,?,?,?,?,?,?,?,?)", [
                  pData.CompCode,
                  l_TranId,
                  pData.dtlData[i].PaymentMode,
                  pData.dtlData[i].Amount,
                  pData.dtlData[i].Remark,
                  null,
                  null,
                  null,
                  null,
                  null,
                  pData.hdrData.UpdtUsr,
                ])
                .catch(async (err) => {
                  throw new InternalServerErrorException(err);
                });
            }
          }
        }
      }

      await queryRunner.commitTransaction();
      // console.log("received data", pData);
      return {
        message: "successful",
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  // getDataCashBookDetails
  async getDataCashBookDetails(CompCode, pFromDate, pToDate): Promise<any> {
    try {
      let query = `CALL spGetDataCashBookDetails(?,?,?)`;
      const res = await this.conn.query(query, [CompCode, pFromDate, pToDate]);
      return {
        message: "successful",
        data: res[0],
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  // spGetDataPartyOutstandingSummary
  async getDataPartyOutstandingSummary(
    CompCode,
    pPartyId,
    pFromDate,
    pToDate
  ): Promise<any> {
    try {
      let query = `CALL spGetDataPartyOutstandingSummary(?,?,?,?)`;
      const res = await this.conn.query(query, [
        CompCode,
        pPartyId === "null" ? null : pPartyId,
        pFromDate !== "null" ? pFromDate : null,
        pToDate !== "null" ? pToDate : null,
      ]);
      return {
        message: "successful",
        data: res[0],
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  // spGetDataPartyOutstandingDetail
  async getDataPartyOutstandingDetail(
    CompCode,
    pPartyId,
    pFromDate,
    pToDate
  ): Promise<any> {
    try {
      // console.log(CompCode, pPartyId, pFromDate, pToDate);
      let query = `CALL spGetDataPartyOutstandingDetail(?,?,?,?)`;
      const res = await this.conn.query(query, [
        CompCode,
        pPartyId,
        pFromDate !== "null" ? pFromDate : null,
        pToDate !== "null" ? pToDate : null,
      ]);
      return {
        message: "successful",
        data: res[0],
      };
    } catch (error) {
      // console.log(error);
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
}
