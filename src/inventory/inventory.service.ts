import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
} from "@nestjs/common";
import { doesNotThrow } from "assert";
import { KeyboardHotkeyConfigController } from "src/keyboard-hotkey-config/keyboard-hotkey-config.controller";
import { OrderportalService } from "src/orderportal/orderportal.service";
import { Connection } from "typeorm";
import { SysSequenceConfigmasterService } from "../sys-sequence-configmaster/sys-sequence-configmaster.service";

const moment = require("moment");
const _ = require("lodash");

@Injectable()
export class InventoryService {
  private logger = new Logger("InventoryService");
  constructor(
    private readonly conn: Connection,
    private sequenceConfig: SysSequenceConfigmasterService,
    private orders: OrderportalService
  ) {}

  //invValidateItemCodeInTransaction
  async invValidateItemCodeInTransaction(CompCode, pItemCode): Promise<any> {
    try {
      let query = `Call spINVValidateItemCodeInTransaction(?,?);`;
      const res = await this.conn.query(query, [CompCode, pItemCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async invGetDataItemHelp(CompCode, BranchCode): Promise<any> {
    try {
      let query = `Call spINVGetDataItemHelp(?,?);`;
      const res = await this.conn.query(query, [CompCode, BranchCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //invGetItemBalanceStockDistinctByPrices
  async invGetItemBalanceStockDistinctByPrices(
    CompCode,
    BranchCode,
    ItemCode
  ): Promise<any> {
    try {
      let query = `Call spINVGetItemBalanceStockDistinctByPrices(?,?,?);`;
      const res = await this.conn.query(query, [
        CompCode,
        BranchCode,
        ItemCode,
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //invGetItemBalanceStockDistinctByInwardSeq
  async invGetItemBalanceStockDistinctByInwardSeq(
    CompCode,
    BranchCode,
    ItemCode
  ): Promise<any> {
    try {
      let query = `Call spINVGetItemBalanceStockDistinctByInwardSeq(?,?,?);`;
      const res = await this.conn.query(query, [
        CompCode,
        BranchCode,
        ItemCode,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //invGetTransactionTypes
  async invGetTransactionTypes(CompCode, TranTypeCode): Promise<any> {
    try {
      let query = `Call spINVGetTransactionTypes(?,?);`;
      const res = await this.conn.query(query, [CompCode, TranTypeCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //invGetItemCodeFromBarcode
  async invGetItemCodeFromBarcode(CompCode, pBarcode): Promise<any> {
    try {
      // console.log(CompCode)
      let query = `Call spINVGetItemCodeFromBarcode(?,?);`;
      const res = await this.conn.query(query, [CompCode, pBarcode]);
      // console.log(res[0]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  async invGetOpeningStock(
    CompCode,
    BranchCode,
    DeptCode,
    ItemCode
  ): Promise<any> {
    try {
      let query = `Call spINVGetOpeningStock(?,?,?,?);`;
      const res = await this.conn.query(query, [
        CompCode,
        BranchCode,
        DeptCode,
        ItemCode === "null" ? null : ItemCode,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //invDeleteOpeningStock
  async invDeleteOpeningStock(data): Promise<any> {
    if (data.length === 0) {
      return;
    }
    // console.log(data.length, "deleting data");
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // console.log("on start");
      let i = 0;
      for (i; i < data.length; i++) {
        await queryRunner
          .query("CALL spINVDeleteOpeningStock(?,?,?,?,?,?)", [
            data[i].CompCode,
            data[i].BranchCode,
            data[i].DeptCode,
            data[i].ItemCode,
            data[i].InwardSeq,
            data[i].UpdtUsr,
          ])
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });
      }
      await queryRunner.commitTransaction();
      // console.log("after commit");
      return { message: "successful", data };
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  //invUpdateOpeningStock
  async invUpdateOpeningStock(data): Promise<any> {
    if (data.length === 0) {
      return;
    }
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // console.log("on start");
      let i = 0;
      for (i; i < data.length; i++) {
        await queryRunner
          .query("CALL spINVUpdateOpeningStock(?,?,?,?,?,?,?,?,?,?,?,?)", [
            data[i].CompCode,
            data[i].BranchCode,
            data[i].DeptCode,
            data[i].ItemCode,
            data[i].InwardSeq,
            data[i].Rate,
            data[i].SaleRate,
            data[i].MRP,
            data[i].Qty,
            data[i].BatchNo,
            data[i].ExpiryDate,
            data[i].UpdtUsr,
          ])
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });
      }

      await queryRunner.commitTransaction();
      // console.log("after commit");
      return { message: "successful", data };
    } catch (err) {
      console.log("on error - invUpdateOpeningStock");
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
  async invSaveOpeningStock(data): Promise<any> {
    // console.log(data, "Ss");
    if (data.length === 0) {
      return;
    }
    const queryRunner = await this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let i = 0;
      for (i; i < data.length; i++) {
        let InwardSeqRes = await queryRunner.query(
          "CALL spINVGetInwardSeqNo(?,?,?,?)",
          [data[i].CompCode, data[i].BranchCode, "OPN", data[i].ItemCode]
        );
        let l_InwardSeqNo = InwardSeqRes[0][0].InwardSeq;

        // console.log("after get sequence no", l_InwardSeqNo, "Inward Seq No");
        await queryRunner
          .query(
            "CALL spINVInsertInv_Stock_Opening(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              data[i].CompCode,
              data[i].BranchCode,
              data[i].DeptCode,
              data[i].ItemCode,
              l_InwardSeqNo,
              data[i].BatchNo,
              data[i].ExpiryDate,
              data[i].Rate,
              data[i].Rate,
              data[i].Rate * data[i].Qty,
              data[i].SaleRate,
              data[i].MRP,
              null,
              data[i].Qty,
              data[i].Remark,
              null,
              null,
              data[i].UpdtUsr,
            ]
          )
          .catch(async (err) => {
            console.log(err);
            throw new InternalServerErrorException(err);
          });

        await queryRunner
          .query(
            "CALL spINVInsertInv_Stock_Tran_Dtl(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              data[i].CompCode,
              data[i].BranchCode,
              data[i].DeptCode,
              data[i].ItemCode,
              l_InwardSeqNo,
              i + 1,
              data[i].BatchNo,
              data[i].ExpiryDate,
              "OPN",
              null,
              moment().format("YYYY-MM-DD"),
              null,
              data[i].Rate,
              data[i].Rate,
              data[i].Rate * data[i].Qty,
              data[i].SaleRate,
              data[i].MRP,
              null,
              data[i].Qty,
              null,
              null,
              null,
              null,
              data[i].UpdtUsr,
            ]
          )
          .catch(async (err) => {
            console.log(err);
            throw new InternalServerErrorException(err);
          });

        // //Commented by Hari on 20210201 to incorporate non sequence wise stock
        // await queryRunner
        //   .query(
        //     "CALL spINVInsertInv_Stock_Main(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        //     [
        //       data[i].CompCode,
        //       data[i].BranchCode,
        //       data[i].DeptCode,
        //       data[i].ItemCode,
        //       l_InwardSeqNo,
        //       data[i].BatchNo,
        //       data[i].ExpiryDate,
        //       data[i].Rate,
        //       data[i].SaleRate,
        //       data[i].MRP,
        //       data[i].Qty,
        //       data[i].Qty,
        //       null,
        //       null,
        //       null,
        //       null,
        //       null,
        //       null,
        //       null,
        //       null,
        //       null,
        //       data[i].Qty * data[i].Rate,
        //       data[i].Qty * data[i].Rate,
        //       null,
        //       null,
        //       null,
        //       null,
        //       null,
        //       null,
        //       null,
        //       null,
        //       null,
        //       "OPN",
        //       null,
        //       data[i].UpdtUsr,
        //     ]
        //   )
        //   .catch(async (err) => {
        //     console.log(err, "some rror received");
        //     await queryRunner.rollbackTransaction();
        //     return false;
        //   });

        await queryRunner
          .query(
            "CALL spINVInsertUpdate_inv_stock_main_from_Opening(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              data[i].CompCode,
              data[i].BranchCode,
              data[i].DeptCode,
              data[i].ItemCode,
              l_InwardSeqNo,
              data[i].BatchNo,
              data[i].ExpiryDate,
              data[i].Rate,
              data[i].SaleRate,
              data[i].MRP,
              data[i].Qty,
              data[i].Qty * data[i].Rate,
              "OPN",
              null,
              data[i].UpdtUsr,
            ]
          )
          .catch(async (err) => {
            console.log(err);
            throw new InternalServerErrorException(err);
          });

        // console.log("loop data", i);
      }

      await queryRunner.commitTransaction();
      // console.log("after commit");
      return { message: "successful", data };
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  //invSaveSaleInvoice
  async invSaveSaleInvoice(data): Promise<any> {
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let resData;
    try {
      let l_VoucherNo;
      if (_.includes([undefined, null, ""], data.SaleInvoiceHdr.VoucherNo)) {
        const seqData = {
          CompCode: data.CompCode,
          TranType: "SALE",
          updt_usr: data.SaleInvoiceHdr.UpdtUsr,
        };
        let TranNextTranNo = await this.sequenceConfig.getSequenceNextVal(
          seqData
        );
        l_VoucherNo = TranNextTranNo.data[0].NextVal;
      } else {
        l_VoucherNo = data.SaleInvoiceHdr.VoucherNo;
      }
      // console.log(data.SaleInvoiceHdr);
      let l_hdrRes = await queryRunner
        .query(
          "CALL spInvInsertInvStockSalesHdr(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            data.SaleInvoiceHdr.VoucherDate,
            l_VoucherNo,
            data.SaleInvoiceHdr.CompCode,
            data.SaleInvoiceHdr.BranchCode,
            data.SaleInvoiceHdr.DeptCode,
            data.SaleInvoiceHdr.TaxType,
            data.SaleInvoiceHdr.CustId,
            data.SaleInvoiceHdr.SaleType,
            data.SaleInvoiceHdr.CustName,
            data.SaleInvoiceHdr.CustMobile,
            data.SaleInvoiceHdr.CustBillingAddress,
            data.SaleInvoiceHdr.CustDeliveryAddress,
            data.SaleInvoiceHdr.CreditDays,
            data.SaleInvoiceHdr.SysOption1,
            data.SaleInvoiceHdr.SysOption2,
            data.SaleInvoiceHdr.SysOption3,
            data.SaleInvoiceHdr.SysOption4,
            data.SaleInvoiceHdr.SysOption5,
            data.SaleInvoiceHdr.SysOption6,
            data.SaleInvoiceHdr.SysOption7,
            data.SaleInvoiceHdr.SysOption8,
            data.SaleInvoiceHdr.SysOption9,
            data.SaleInvoiceHdr.SysOption10,
            data.SaleInvoiceHdr.GrossAmount,
            data.SaleInvoiceHdr.DiscAmount,
            data.SaleInvoiceHdr.SchemeDiscAmount,
            data.SaleInvoiceHdr.TaxAmount,
            data.SaleInvoiceHdr.MiscAmount,
            data.SaleInvoiceHdr.RoundOff,
            data.SaleInvoiceHdr.NetAmount,
            data.SaleInvoiceHdr.SettlementAmount,
            data.SaleInvoiceHdr.UpdtUsr,
          ]
        )
        .catch(async (err) => {
          throw new InternalServerErrorException(err);
        });

      let l_VoucherId = l_hdrRes[0][0].VoucherId;

      let i = 0;
      for (i; i < data.SaleInvoiceDtl.length; i++) {
        // console.log(data.SaleInvoiceDtl[i], "data.SaleInvoiceDtl[i]");
        await queryRunner
          .query(
            "CALL spInvInsertStockSalesDtl(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              data.SaleInvoiceHdr.CompCode,
              l_VoucherId,
              data.SaleInvoiceDtl[i].SrNo,
              data.SaleInvoiceDtl[i].ItemCode,
              data.SaleInvoiceDtl[i].ScannedBarcode,
              data.SaleInvoiceDtl[i].InwardSeq,
              data.SaleInvoiceDtl[i].BatchNo,
              data.SaleInvoiceDtl[i].ExpiryDate,
              data.SaleInvoiceDtl[i].SaleQty,
              data.SaleInvoiceDtl[i].CostPrice,
              data.SaleInvoiceDtl[i].SalePrice,
              data.SaleInvoiceDtl[i].LSalePrice,
              data.SaleInvoiceDtl[i].MRP,
              data.SaleInvoiceDtl[i].DiscPer,
              data.SaleInvoiceDtl[i].DiscAmount,
              data.SaleInvoiceDtl[i].SchemeDiscAmount,
              data.SaleInvoiceDtl[i].SchemeCode,
              data.SaleInvoiceDtl[i].TaxCode,
              data.SaleInvoiceDtl[i].TaxPerc,
              data.SaleInvoiceDtl[i].TaxAmount,
              data.SaleInvoiceDtl[i].ItemTotal,
              data.SaleInvoiceDtl[i].Amount,
              data.SaleInvoiceDtl[i].SysOption1,
              data.SaleInvoiceDtl[i].SysOption2,
              data.SaleInvoiceDtl[i].SysOption3,
              data.SaleInvoiceDtl[i].SysOption4,
              data.SaleInvoiceDtl[i].SysOption5,
              data.SaleInvoiceDtl[i].CGST,
              data.SaleInvoiceDtl[i].SGST,
              data.SaleInvoiceDtl[i].IGST,
              data.SaleInvoiceDtl[i].UTGST,
              data.SaleInvoiceDtl[i].Surcharge,
              data.SaleInvoiceDtl[i].Cess,
              data.SaleInvoiceDtl[i].UpdtUsr,
            ]
          )
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });

        //_.includes([undefined, null, ""], data.SaleInvoiceHdr.VoucherNo)
        if (
          !_.includes([undefined, null, ""], data.SaleInvoiceDtl[i].InwardSeq)
        ) {
          await queryRunner
            .query(
              "CALL spINVInsertInv_Stock_Tran_Dtl(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              [
                data.SaleInvoiceHdr.CompCode,
                data.SaleInvoiceHdr.BranchCode,
                data.SaleInvoiceHdr.DeptCode,
                data.SaleInvoiceDtl[i].ItemCode,
                data.SaleInvoiceDtl[i].InwardSeq,
                data.SaleInvoiceDtl[i].SrNo,
                data.SaleInvoiceDtl[i].BatchNo,
                data.SaleInvoiceDtl[i].ExpiryDate,
                "SALE",
                l_VoucherId,
                moment().format("YYYY-MM-DD"),
                l_VoucherNo,
                data.SaleInvoiceDtl[i].CostPrice,
                data.SaleInvoiceDtl[i].LSalePrice,
                data.SaleInvoiceDtl[i].LSalePrice *
                  data.SaleInvoiceDtl[i].SaleQty,
                data.SaleInvoiceDtl[i].ItemTotal,
                data.SaleInvoiceDtl[i].MRP,
                data.SaleInvoiceDtl[i].TaxAmount,
                data.SaleInvoiceDtl[i].SaleQty,
                data.SaleInvoiceDtl[i].TaxCode,
                data.SaleInvoiceDtl[i].TaxPerc,
                data.SaleInvoiceHdr.CustId,
                data.SaleInvoiceHdr.CustName,
                data.SaleInvoiceDtl[i].UpdtUsr,
              ]
            )
            .catch(async (err) => {
              console.log(err);
              throw new InternalServerErrorException(err);
            });

          //Update Inv_Stock_Main for Sales
          await queryRunner
            .query("CALL spINVUpdateInvStockMainFromSales(?,?,?,?,?,?,?,?)", [
              data.SaleInvoiceHdr.CompCode,
              data.SaleInvoiceHdr.BranchCode,
              data.SaleInvoiceHdr.DeptCode,
              data.SaleInvoiceDtl[i].ItemCode,
              data.SaleInvoiceDtl[i].InwardSeq,
              data.SaleInvoiceDtl[i].SaleQty,
              data.SaleInvoiceDtl[i].SalePrice * data.SaleInvoiceDtl[i].SaleQty,
              data.SaleInvoiceDtl[i].UpdtUsr,
            ])
            .catch(async (err) => {
              console.log(err);
              throw new InternalServerErrorException(err);
            });
        }
      }

      // console.log(data.AddIncomeExpensesDtl);
      i = 0;
      for (i; i < data.AddIncomeExpensesDtl.length; i++) {
        await queryRunner
          .query(
            "CALL spINVInsertInvStockTranIncExps(?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              data.SaleInvoiceHdr.CompCode,
              "SALE",
              l_VoucherId,
              data.AddIncomeExpensesDtl[i].SrNo,
              data.AddIncomeExpensesDtl[i].IEType,
              data.AddIncomeExpensesDtl[i].Particular,
              data.AddIncomeExpensesDtl[i].Amount *
                (data.AddIncomeExpensesDtl[i].IEType === "E" ? -1 : 1),
              data.AddIncomeExpensesDtl[i].SysOption1,
              data.AddIncomeExpensesDtl[i].SysOption2,
              data.AddIncomeExpensesDtl[i].SysOption3,
              data.AddIncomeExpensesDtl[i].SysOption4,
              data.AddIncomeExpensesDtl[i].SysOption5,
              data.SaleInvoiceHdr.UpdtUsr,
            ]
          )
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });
      }

      await queryRunner.commitTransaction();
      // console.log("after commit");
      return {
        message: "successful",
        data: {
          VoucherId: l_VoucherId,
          VoucherNo: l_VoucherNo,
          VoucherDate: data.SaleInvoiceHdr.VoucherDate,
        },
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  //Hari/Atul 20210225
  async invSaveSaleReturnInvoice(data): Promise<any> {
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let resData;
    // console.log(data, "ss");

    try {
      let l_VoucherNo;
      if (
        _.includes([undefined, null, ""], data.SaleReturnInvoiceHdr.VoucherNo)
      ) {
        const seqData = {
          CompCode: data.SaleReturnInvoiceHdr.CompCode,
          TranType: "SALERTN",
          updt_usr: data.SaleReturnInvoiceHdr.UpdtUsr,
        };
        let TranNextTranNo = await this.sequenceConfig.getSequenceNextVal(
          seqData
        );
        l_VoucherNo = TranNextTranNo.data[0].NextVal;
      } else {
        l_VoucherNo = data.SaleReturnInvoiceHdr.VoucherNo;
      }

      // console.log("1");
      let l_hdrRes = await queryRunner
        .query(
          "CALL spInvInsertInvStockSalesReturnHdr(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            data.SaleReturnInvoiceHdr.VoucherDate !== null
              ? moment(data.SaleReturnInvoiceHdr.VoucherDate).format(
                  "YYYY-MM-DD"
                )
              : null,
            l_VoucherNo,
            data.SaleReturnInvoiceHdr.CompCode,
            data.SaleReturnInvoiceHdr.BranchCode,
            data.SaleReturnInvoiceHdr.DeptCode,
            data.SaleReturnInvoiceHdr.TaxType,
            data.SaleReturnInvoiceHdr.CustId,
            data.SaleReturnInvoiceHdr.SaleType,
            data.SaleReturnInvoiceHdr.CustName,
            data.SaleReturnInvoiceHdr.CustMobile,
            data.SaleReturnInvoiceHdr.CustBillingAddress,
            data.SaleReturnInvoiceHdr.CustDeliveryAddress,
            data.SaleReturnInvoiceHdr.SaleVoucherId,
            data.SaleReturnInvoiceHdr.SaleVoucherDate !== null
              ? moment(data.SaleReturnInvoiceHdr.SaleVoucherDate).format(
                  "YYYY-MM-DD"
                )
              : null,
            data.SaleReturnInvoiceHdr.SaleVoucherNo,
            data.SaleReturnInvoiceHdr.CreditDays,
            data.SaleReturnInvoiceHdr.SysOption1,
            data.SaleReturnInvoiceHdr.SysOption2,
            data.SaleReturnInvoiceHdr.SysOption3,
            data.SaleReturnInvoiceHdr.SysOption4,
            data.SaleReturnInvoiceHdr.SysOption5,
            data.SaleReturnInvoiceHdr.SysOption6,
            data.SaleReturnInvoiceHdr.SysOption7,
            data.SaleReturnInvoiceHdr.SysOption8,
            data.SaleReturnInvoiceHdr.SysOption9,
            data.SaleReturnInvoiceHdr.SysOption10,
            data.SaleReturnInvoiceHdr.GrossAmount,
            data.SaleReturnInvoiceHdr.DiscAmount,
            data.SaleReturnInvoiceHdr.SchemeDiscAmount,
            data.SaleReturnInvoiceHdr.TaxAmount,
            data.SaleReturnInvoiceHdr.MiscAmount,
            data.SaleReturnInvoiceHdr.RoundOff,
            data.SaleReturnInvoiceHdr.NetAmount,
            data.SaleReturnInvoiceHdr.SettlementAmount,
            data.SaleReturnInvoiceHdr.UpdtUsr,
          ]
        )
        .catch(async (err) => {
          throw new InternalServerErrorException(err);
        });
      // console.log("2");
      let l_VoucherId = l_hdrRes[0][0].VoucherId;
      // console.log(l_VoucherId, "step 2");
      let i = 0;
      for (i; i < data.SaleReturnInvoiceDtl.length; i++) {
        await queryRunner
          .query(
            "CALL spInvInsertStockSalesReturnDtl(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              data.SaleReturnInvoiceHdr.CompCode,
              l_VoucherId,
              data.SaleReturnInvoiceDtl[i].SrNo,
              data.SaleReturnInvoiceDtl[i].ItemCode,
              data.SaleReturnInvoiceDtl[i].ScannedBarcode,
              data.SaleReturnInvoiceDtl[i].InwardSeq,
              data.SaleReturnInvoiceDtl[i].BatchNo,
              data.SaleReturnInvoiceDtl[i].ExpiryDate,
              data.SaleReturnInvoiceDtl[i].SaleQty,
              data.SaleReturnInvoiceDtl[i].CostPrice,
              data.SaleReturnInvoiceDtl[i].SalePrice,
              data.SaleReturnInvoiceDtl[i].LSalePrice,
              data.SaleReturnInvoiceDtl[i].MRP,
              data.SaleReturnInvoiceDtl[i].DiscPer,
              data.SaleReturnInvoiceDtl[i].DiscAmount,
              data.SaleReturnInvoiceDtl[i].SchemeDiscAmount,
              data.SaleReturnInvoiceDtl[i].SchemeCode,
              data.SaleReturnInvoiceDtl[i].TaxCode,
              data.SaleReturnInvoiceDtl[i].TaxPerc,
              data.SaleReturnInvoiceDtl[i].TaxAmount,
              data.SaleReturnInvoiceDtl[i].ItemTotal,
              data.SaleReturnInvoiceDtl[i].Amount,
              data.SaleReturnInvoiceDtl[i].SysOption1,
              data.SaleReturnInvoiceDtl[i].SysOption2,
              data.SaleReturnInvoiceDtl[i].SysOption3,
              data.SaleReturnInvoiceDtl[i].SysOption4,
              data.SaleReturnInvoiceDtl[i].SysOption5,
              data.SaleReturnInvoiceDtl[i].CGST,
              data.SaleReturnInvoiceDtl[i].SGST,
              data.SaleReturnInvoiceDtl[i].IGST,
              data.SaleReturnInvoiceDtl[i].UTGST,
              data.SaleReturnInvoiceDtl[i].Surcharge,
              data.SaleReturnInvoiceDtl[i].Cess,
              data.SaleReturnInvoiceDtl[i].UpdtUsr,
            ]
          )
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });
        // console.log("3");
        //_.includes([undefined, null, ""], data.SaleInvoiceHdr.VoucherNo)
        // if (
        //   !_.includes([undefined, null, ""], data.SaleInvoiceDtl[i].InwardSeq)
        // ) {

        // console.log("step 3");
        await queryRunner
          .query(
            "CALL spINVInsertInv_Stock_Tran_Dtl(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              data.SaleReturnInvoiceHdr.CompCode,
              data.SaleReturnInvoiceHdr.BranchCode,
              data.SaleReturnInvoiceHdr.DeptCode,
              data.SaleReturnInvoiceDtl[i].ItemCode,
              data.SaleReturnInvoiceDtl[i].InwardSeq,
              data.SaleReturnInvoiceDtl[i].SrNo,
              data.SaleReturnInvoiceDtl[i].BatchNo,
              data.SaleReturnInvoiceDtl[i].ExpiryDate,
              "SALERTN",
              l_VoucherId,
              moment().format("YYYY-MM-DD"),
              l_VoucherNo,
              data.SaleReturnInvoiceDtl[i].CostPrice,
              data.SaleReturnInvoiceDtl[i].LSalePrice,
              data.SaleReturnInvoiceDtl[i].Amount,
              data.SaleReturnInvoiceDtl[i].ItemTotal,
              data.SaleReturnInvoiceDtl[i].MRP,
              data.SaleReturnInvoiceDtl[i].TaxAmount,
              data.SaleReturnInvoiceDtl[i].SaleQty,
              data.SaleReturnInvoiceDtl[i].TaxCode,
              data.SaleReturnInvoiceDtl[i].TaxPerc,
              data.SaleReturnInvoiceHdr.CustId,
              data.SaleReturnInvoiceHdr.CustName,
              data.SaleReturnInvoiceDtl[i].UpdtUsr,
            ]
          )
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });

        //Update Inv_Stock_Main for Sales
        // console.log("step 4");
        await queryRunner
          .query(
            "CALL spINVUpdateInvStockMainFromSalesReturn(?,?,?,?,?,?,?,?)",
            [
              data.SaleReturnInvoiceHdr.CompCode,
              data.SaleReturnInvoiceHdr.BranchCode,
              data.SaleReturnInvoiceHdr.DeptCode,
              data.SaleReturnInvoiceDtl[i].ItemCode,
              data.SaleReturnInvoiceDtl[i].InwardSeq,
              data.SaleReturnInvoiceDtl[i].SaleQty,
              data.SaleReturnInvoiceDtl[i].CostPrice *
                data.SaleReturnInvoiceDtl[i].SaleQty,
              data.SaleReturnInvoiceDtl[i].UpdtUsr,
            ]
          )
          .catch(async (err) => {
            console.log(err);
            throw new InternalServerErrorException(err);
          });
        // }
      }
      // console.log("step 5");
      // console.log(data.AddIncomeExpensesDtl);

      if (data.AddIncomeExpensesDtl && data.AddIncomeExpensesDtl.length > 0) {
        i = 0;
        for (i; i < data.AddIncomeExpensesDtl.length; i++) {
          await queryRunner
            .query(
              "CALL spINVInsertInvStockTranIncExps(?,?,?,?,?,?,?,?,?,?,?,?,?)",
              [
                data.SaleReturnInvoiceHdr.CompCode,
                "SALERTN",
                l_VoucherId,
                data.AddIncomeExpensesDtl[i].SrNo,
                data.AddIncomeExpensesDtl[i].IEType,
                data.AddIncomeExpensesDtl[i].Particular,
                data.AddIncomeExpensesDtl[i].Amount *
                  (data.AddIncomeExpensesDtl[i].IEType === "E" ? -1 : 1),
                data.AddIncomeExpensesDtl[i].SysOption1,
                data.AddIncomeExpensesDtl[i].SysOption2,
                data.AddIncomeExpensesDtl[i].SysOption3,
                data.AddIncomeExpensesDtl[i].SysOption4,
                data.AddIncomeExpensesDtl[i].SysOption5,
                data.SaleReturnInvoiceHdr.UpdtUsr,
              ]
            )
            .catch(async (err) => {
              throw new InternalServerErrorException(err);
            });
        }
      }
      // console.log("step 6");

      await queryRunner.commitTransaction();
      // console.log("after commit");
      return {
        message: "successful",
        data: {
          VoucherId: l_VoucherId,
          VoucherNo: l_VoucherNo,
          VoucherDate: data.SaleReturnInvoiceHdr.VoucherDate,
        },
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  //invSavePurchaseInvoice
  async invSavePurchaseInvoice(data): Promise<any> {
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let l_VoucherNo;
      //if (_.includes([undefined, null, ""], data.PurchaseInvoiceHdr.VoucherNo)) {
      if (
        _.includes([undefined, null, ""], data.PurchaseInvoiceHdr.VoucherNo)
      ) {
        const seqData = {
          CompCode: data.CompCode,
          TranType: "PUR",
          updt_usr: data.PurchaseInvoiceHdr.UpdtUsr,
        };
        let TranNextTranNo = await this.sequenceConfig.getSequenceNextVal(
          seqData
        );
        l_VoucherNo = TranNextTranNo.data[0].NextVal;
      } else {
        l_VoucherNo = data.PurchaseInvoiceHdr.VoucherNo;
      }

      let l_hdrRes = await queryRunner
        .query(
          "CALL spInvInsertInvStockPurchaseHdr(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            moment(data.PurchaseInvoiceHdr.VoucherDate).format("YYYY-MM-DD"),
            l_VoucherNo,
            data.PurchaseInvoiceHdr.CompCode,
            data.PurchaseInvoiceHdr.BranchCode,
            data.PurchaseInvoiceHdr.DeptCode,
            data.PurchaseInvoiceHdr.TaxType,
            data.PurchaseInvoiceHdr.SuppId,
            data.PurchaseInvoiceHdr.PurchaseType,
            data.PurchaseInvoiceHdr.DeliveryChallanNo,
            data.PurchaseInvoiceHdr.DeliveryChallanDate !== null
              ? moment(data.PurchaseInvoiceHdr.DeliveryChallanDate).format(
                  "YYYY-MM-DD"
                )
              : null,
            data.PurchaseInvoiceHdr.PurchaseBillNo,
            data.PurchaseInvoiceHdr.PurchaseBillDate !== null
              ? moment(data.PurchaseInvoiceHdr.PurchaseBillDate).format(
                  "YYYY-MM-DD"
                )
              : null,
            data.PurchaseInvoiceHdr.EWayBillNo,
            data.PurchaseInvoiceHdr.VehicleNo,
            data.PurchaseInvoiceHdr.CreditDays,

            data.PurchaseInvoiceHdr.POId,
            data.PurchaseInvoiceHdr.PONo,
            data.PurchaseInvoiceHdr.PODate !== null
              ? moment(data.PurchaseInvoiceHdr.PODate).format("YYYY-MM-DD")
              : null,

            data.PurchaseInvoiceHdr.SysOption1,
            data.PurchaseInvoiceHdr.SysOption2,
            data.PurchaseInvoiceHdr.SysOption3,
            data.PurchaseInvoiceHdr.SysOption4,
            data.PurchaseInvoiceHdr.SysOption5,
            data.PurchaseInvoiceHdr.SysOption6,
            data.PurchaseInvoiceHdr.SysOption7,
            data.PurchaseInvoiceHdr.SysOption8,
            data.PurchaseInvoiceHdr.SysOption9,
            data.PurchaseInvoiceHdr.SysOption10,

            data.PurchaseInvoiceHdr.GrossAmount,
            data.PurchaseInvoiceHdr.DiscAmount,
            data.PurchaseInvoiceHdr.TaxAmount,
            data.PurchaseInvoiceHdr.MiscAmount,
            data.PurchaseInvoiceHdr.RoundOff,
            data.PurchaseInvoiceHdr.NetAmount,
            data.PurchaseInvoiceHdr.SettlementAmount,
            data.PurchaseInvoiceHdr.UpdtUsr,
          ]
        )
        .catch(async (err) => {
          throw new InternalServerErrorException(err);
        });
      let l_VoucherId = l_hdrRes[0][0].VoucherId;

      let InwardSeqRes = await queryRunner.query(
        "CALL spINVGetInwardSeqNo(?,?,?,?)",
        [
          data.PurchaseInvoiceHdr.CompCode,
          data.PurchaseInvoiceHdr.BranchCode,
          "PUR",
          null,
        ]
      );
      let l_InitialInwardSeqNo = parseInt(InwardSeqRes[0][0].InwardSeq);

      // console.log("debug point", l_VoucherId, l_InitialInwardSeqNo);

      //Get list of distinct items
      let distinctItems = [];
      data.PurchaseInvoiceDtl.forEach((rr) => {
        if (
          distinctItems.filter((kk) => kk.ItemCode === rr.ItemCode).length === 0
        ) {
          distinctItems.push({ ItemCode: rr.ItemCode });
        }
      });

      // console.log("debug point", distinctItems, l_InitialInwardSeqNo);
      //Assign Inward Sequence No

      distinctItems.forEach((distinctItem) => {
        let i = 0;
        for (i; i < data.PurchaseInvoiceDtl.length; i++) {
          if (
            data.PurchaseInvoiceDtl[i].ItemCode === distinctItem.ItemCode &&
            data.PurchaseInvoiceDtl[i].InwardSeq === null
          ) {
            if (l_InitialInwardSeqNo === -999) {
              data.PurchaseInvoiceDtl[i].InwardSeq = l_InitialInwardSeqNo;
            } else {
              data.PurchaseInvoiceDtl[i].InwardSeq =
                l_InitialInwardSeqNo +
                data.PurchaseInvoiceDtl.filter(
                  (ll) =>
                    ll.ItemCode === distinctItem.ItemCode &&
                    ll.InwardSeq !== null
                ).length;
            }

            // console.log("set value", data.PurchaseInvoiceDtl[i].InwardSeq);
          }
        }
      });

      // await queryRunner.rollbackTransaction();
      // return { data: data.PurchaseInvoiceDtl };

      let i;
      i = 0;
      for (i; i < data.PurchaseInvoiceDtl.length; i++) {
        await queryRunner
          .query(
            "CALL spInvInsertInvStockPurchaseDtl(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              data.PurchaseInvoiceHdr.CompCode,
              l_VoucherId,
              data.PurchaseInvoiceDtl[i].SrNo,
              data.PurchaseInvoiceDtl[i].ItemCode,
              data.PurchaseInvoiceDtl[i].ScannedBarcode,
              data.PurchaseInvoiceDtl[i].InwardSeq,
              data.PurchaseInvoiceDtl[i].BatchNo,
              data.PurchaseInvoiceDtl[i].ExpiryDate !== null
                ? moment(data.PurchaseInvoiceDtl[i].ExpiryDate).format(
                    "YYYY-MM-DD"
                  )
                : null,
              data.PurchaseInvoiceDtl[i].Qty,
              data.PurchaseInvoiceDtl[i].FreeQty,
              data.PurchaseInvoiceDtl[i].TotalPurQty,
              data.PurchaseInvoiceDtl[i].CostPrice,
              data.PurchaseInvoiceDtl[i].SalePrice,
              data.PurchaseInvoiceDtl[i].MRP,
              data.PurchaseInvoiceDtl[i].DiscPer,
              data.PurchaseInvoiceDtl[i].DiscAmount,
              data.PurchaseInvoiceDtl[i].TaxCode,
              data.PurchaseInvoiceDtl[i].TaxPerc,
              data.PurchaseInvoiceDtl[i].TaxAmount,
              data.PurchaseInvoiceDtl[i].ItemTotalCost,
              data.PurchaseInvoiceDtl[i].Amount,
              data.PurchaseInvoiceDtl[i].SysOption1,
              data.PurchaseInvoiceDtl[i].SysOption2,
              data.PurchaseInvoiceDtl[i].SysOption3,
              data.PurchaseInvoiceDtl[i].SysOption4,
              data.PurchaseInvoiceDtl[i].SysOption5,
              data.PurchaseInvoiceDtl[i].CGST,
              data.PurchaseInvoiceDtl[i].SGST,
              data.PurchaseInvoiceDtl[i].IGST,
              data.PurchaseInvoiceDtl[i].UTGST,
              data.PurchaseInvoiceDtl[i].Surcharge,
              data.PurchaseInvoiceDtl[i].Cess,
              data.PurchaseInvoiceDtl[i].UpdtUsr,
            ]
          )
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });

        await queryRunner
          .query(
            "CALL spINVInsertInv_Stock_Tran_Dtl(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              data.PurchaseInvoiceHdr.CompCode,
              data.PurchaseInvoiceHdr.BranchCode,
              data.PurchaseInvoiceHdr.DeptCode,
              data.PurchaseInvoiceDtl[i].ItemCode,
              data.PurchaseInvoiceDtl[i].InwardSeq,
              data.PurchaseInvoiceDtl[i].SrNo,
              data.PurchaseInvoiceDtl[i].BatchNo,
              data.PurchaseInvoiceDtl[i].ExpiryDate,
              "PUR",
              l_VoucherId,
              moment().format("YYYY-MM-DD"),
              l_VoucherNo,
              data.PurchaseInvoiceDtl[i].CostPrice,
              data.PurchaseInvoiceDtl[i].ItemTotalCost,
              data.PurchaseInvoiceDtl[i].ItemTotalCost *
                data.PurchaseInvoiceDtl[i].TotalPurQty,
              data.PurchaseInvoiceDtl[i].SalePrice,
              data.PurchaseInvoiceDtl[i].MRP,
              data.PurchaseInvoiceDtl[i].TaxAmount,
              data.PurchaseInvoiceDtl[i].TotalPurQty,
              data.PurchaseInvoiceDtl[i].TaxCode,
              data.PurchaseInvoiceDtl[i].TaxPerc,
              data.PurchaseInvoiceHdr.SuppId,
              data.PurchaseInvoiceHdr.SuppName,
              data.PurchaseInvoiceDtl[i].UpdtUsr,
            ]
          )
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });

        // //Modified by Hari on 20210201
        // await queryRunner
        //   .query(
        //     "CALL spINVInsertInv_Stock_Main(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        //     [
        //       data.PurchaseInvoiceHdr.CompCode,
        //       data.PurchaseInvoiceHdr.BranchCode,
        //       data.PurchaseInvoiceHdr.DeptCode,
        //       data.PurchaseInvoiceDtl[i].ItemCode,
        //       data.PurchaseInvoiceDtl[i].InwardSeq,
        //       data.PurchaseInvoiceDtl[i].BatchNo,
        //       data.PurchaseInvoiceDtl[i].ExpiryDate,
        //       data.PurchaseInvoiceDtl[i].ItemTotalCost,
        //       data.PurchaseInvoiceDtl[i].SalePrice,
        //       data.PurchaseInvoiceDtl[i].MRP,

        //       data.PurchaseInvoiceDtl[i].TotalPurQty,
        //       null,
        //       data.PurchaseInvoiceDtl[i].TotalPurQty,
        //       null,
        //       null,
        //       null,
        //       null,
        //       null,
        //       null,
        //       null,
        //       null,

        //       data.PurchaseInvoiceDtl[i].ItemTotalCost *
        //         data.PurchaseInvoiceDtl[i].TotalPurQty,
        //       null,
        //       data.PurchaseInvoiceDtl[i].ItemTotalCost *
        //         data.PurchaseInvoiceDtl[i].TotalPurQty,
        //       null,
        //       null,
        //       null,
        //       null,
        //       null,
        //       null,
        //       null,
        //       null,
        //       "PUR",
        //       l_VoucherId,
        //       data.PurchaseInvoiceDtl[i].UpdtUsr,
        //     ]
        //   )
        //   .catch(async (err) => {
        //     console.log(err, "some rror received - spINVInsertInv_Stock_Main");
        //     await queryRunner.rollbackTransaction();
        //     return false;
        //   });

        await queryRunner
          .query(
            "CALL spINVInsertUpdate_inv_stock_main_from_Purchase(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              data.PurchaseInvoiceHdr.CompCode,
              data.PurchaseInvoiceHdr.BranchCode,
              data.PurchaseInvoiceHdr.DeptCode,
              data.PurchaseInvoiceDtl[i].ItemCode,
              data.PurchaseInvoiceDtl[i].InwardSeq,
              data.PurchaseInvoiceDtl[i].BatchNo,
              data.PurchaseInvoiceDtl[i].ExpiryDate,
              data.PurchaseInvoiceDtl[i].ItemTotalCost,
              data.PurchaseInvoiceDtl[i].SalePrice,
              data.PurchaseInvoiceDtl[i].MRP,
              data.PurchaseInvoiceDtl[i].TotalPurQty,
              data.PurchaseInvoiceDtl[i].TotalPurQty *
                data.PurchaseInvoiceDtl[i].ItemTotalCost,
              "PUR",
              l_VoucherId,
              data.PurchaseInvoiceDtl[i].UpdtUsr,
            ]
          )
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });
      }

      if (data.AddIncomeExpensesDtl && data.AddIncomeExpensesDtl.length > 0) {
        i = 0;

        for (i; i < data.AddIncomeExpensesDtl.length; i++) {
          await queryRunner
            .query(
              "CALL spINVInsertInvStockTranIncExps(?,?,?,?,?,?,?,?,?,?,?,?,?)",
              [
                data.PurchaseInvoiceHdr.CompCode,
                "PUR",
                l_VoucherId,
                data.AddIncomeExpensesDtl[i].SrNo,
                data.AddIncomeExpensesDtl[i].IEType,
                data.AddIncomeExpensesDtl[i].Particular,
                // data.AddIncomeExpensesDtl[i].Amount *
                //   (data.AddIncomeExpensesDtl[i].IEType === "E" ? -1 : 1),
                data.AddIncomeExpensesDtl[i].Amount,
                data.AddIncomeExpensesDtl[i].SysOption1,
                data.AddIncomeExpensesDtl[i].SysOption2,
                data.AddIncomeExpensesDtl[i].SysOption3,
                data.AddIncomeExpensesDtl[i].SysOption4,
                data.AddIncomeExpensesDtl[i].SysOption5,
                data.PurchaseInvoiceHdr.UpdtUsr,
              ]
            )
            .catch(async (err) => {
              throw new InternalServerErrorException(err);
            });
        }
      }

      await queryRunner.commitTransaction();
      // console.log("after commit");
      return { message: "successful", data };
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  //Hari/Atul 20210225
  async invSavePurchaseReturnInvoice(data): Promise<any> {
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let l_VoucherNo;
      //if (_.includes([undefined, null, ""], data.PurchaseInvoiceHdr.VoucherNo)) {
      if (
        _.includes(
          [undefined, null, ""],
          data.PurchaseReturnInvoiceHdr.VoucherNo
        )
      ) {
        const seqData = {
          CompCode: data.CompCode,
          TranType: "PURRTN",
          updt_usr: data.PurchaseReturnInvoiceHdr.UpdtUsr,
        };
        let TranNextTranNo = await this.sequenceConfig.getSequenceNextVal(
          seqData
        );
        l_VoucherNo = TranNextTranNo.data[0].NextVal;
        // console.log(l_VoucherNo, "step1");
      } else {
        l_VoucherNo = data.PurchaseReturnInvoiceHdr.VoucherNo;
      }

      // console.log(data.PurchaseReturnInvoiceHdr, "step 2");

      let l_hdrRes = await queryRunner
        .query(
          "CALL spInvInsertInvStockPurchaseReturnHdr(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            moment(data.PurchaseReturnInvoiceHdr.VoucherDate).format(
              "YYYY-MM-DD"
            ),
            l_VoucherNo,
            data.PurchaseReturnInvoiceHdr.CompCode,
            data.PurchaseReturnInvoiceHdr.BranchCode,
            data.PurchaseReturnInvoiceHdr.DeptCode,
            data.PurchaseReturnInvoiceHdr.TaxType,
            data.PurchaseReturnInvoiceHdr.SuppId,
            data.PurchaseReturnInvoiceHdr.PurchaseType,
            data.PurchaseReturnInvoiceHdr.RefNo,
            data.PurchaseReturnInvoiceHdr.RefDate !== null
              ? moment(data.PurchaseReturnInvoiceHdr.RefDate).format(
                  "YYYY-MM-DD"
                )
              : null,
            data.PurchaseReturnInvoiceHdr.PurchaseRtnBillNo,
            data.PurchaseReturnInvoiceHdr.PurchaseRtnBillDate !== null
              ? moment(
                  data.PurchaseReturnInvoiceHdr.PurchaseRtnBillDate
                ).format("YYYY-MM-DD")
              : null,
            data.PurchaseReturnInvoiceHdr.EWayBillNo,
            data.PurchaseReturnInvoiceHdr.VehicleNo,
            data.PurchaseReturnInvoiceHdr.CreditDays,

            data.PurchaseReturnInvoiceHdr.PurchaseId,
            data.PurchaseReturnInvoiceHdr.PurchaseNo,
            data.PurchaseReturnInvoiceHdr.PurchaseDate !== null
              ? moment(data.PurchaseReturnInvoiceHdr.PurchaseDate).format(
                  "YYYY-MM-DD"
                )
              : null,

            data.PurchaseReturnInvoiceHdr.SysOption1,
            data.PurchaseReturnInvoiceHdr.SysOption2,
            data.PurchaseReturnInvoiceHdr.SysOption3,
            data.PurchaseReturnInvoiceHdr.SysOption4,
            data.PurchaseReturnInvoiceHdr.SysOption5,
            data.PurchaseReturnInvoiceHdr.SysOption6,
            data.PurchaseReturnInvoiceHdr.SysOption7,
            data.PurchaseReturnInvoiceHdr.SysOption8,
            data.PurchaseReturnInvoiceHdr.SysOption9,
            data.PurchaseReturnInvoiceHdr.SysOption10,

            data.PurchaseReturnInvoiceHdr.GrossAmount,
            data.PurchaseReturnInvoiceHdr.DiscAmount,
            data.PurchaseReturnInvoiceHdr.TaxAmount,
            data.PurchaseReturnInvoiceHdr.MiscAmount,
            data.PurchaseReturnInvoiceHdr.RoundOff,
            data.PurchaseReturnInvoiceHdr.NetAmount,
            data.PurchaseReturnInvoiceHdr.SettlementAmount,
            data.PurchaseReturnInvoiceHdr.UpdtUsr,
          ]
        )
        .catch(async (err) => {
          throw new InternalServerErrorException(err);
        });
      let l_VoucherId = l_hdrRes[0][0].VoucherId;

      // console.log(l_VoucherId, "step 3");
      let i;
      i = 0;

      // console.log(data.PurchaseReturnInvoiceDtl, "step 4");
      for (i; i < data.PurchaseReturnInvoiceDtl.length; i++) {
        await queryRunner
          .query(
            "CALL spInvInsertInvStockPurchaseReturnDtl(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              data.PurchaseReturnInvoiceHdr.CompCode,
              l_VoucherId,
              data.PurchaseReturnInvoiceDtl[i].SrNo,
              data.PurchaseReturnInvoiceDtl[i].ItemCode,
              data.PurchaseReturnInvoiceDtl[i].ScannedBarcode,
              data.PurchaseReturnInvoiceDtl[i].InwardSeq,
              data.PurchaseReturnInvoiceDtl[i].BatchNo,
              data.PurchaseReturnInvoiceDtl[i].ExpiryDate !== null
                ? moment(data.PurchaseReturnInvoiceDtl[i].ExpiryDate).format(
                    "YYYY-MM-DD"
                  )
                : null,
              data.PurchaseReturnInvoiceDtl[i].Qty,
              data.PurchaseReturnInvoiceDtl[i].LCostPrice,
              data.PurchaseReturnInvoiceDtl[i].SalePrice,
              data.PurchaseReturnInvoiceDtl[i].MRP,
              data.PurchaseReturnInvoiceDtl[i].DiscPer,
              data.PurchaseReturnInvoiceDtl[i].DiscAmount,
              data.PurchaseReturnInvoiceDtl[i].TaxCode,
              data.PurchaseReturnInvoiceDtl[i].TaxPerc,
              data.PurchaseReturnInvoiceDtl[i].TaxAmount,
              data.PurchaseReturnInvoiceDtl[i].Amount,
              data.PurchaseReturnInvoiceDtl[i].SysOption1,
              data.PurchaseReturnInvoiceDtl[i].SysOption2,
              data.PurchaseReturnInvoiceDtl[i].SysOption3,
              data.PurchaseReturnInvoiceDtl[i].SysOption4,
              data.PurchaseReturnInvoiceDtl[i].SysOption5,
              data.PurchaseReturnInvoiceDtl[i].CGST,
              data.PurchaseReturnInvoiceDtl[i].SGST,
              data.PurchaseReturnInvoiceDtl[i].IGST,
              data.PurchaseReturnInvoiceDtl[i].UTGST,
              data.PurchaseReturnInvoiceDtl[i].Surcharge,
              data.PurchaseReturnInvoiceDtl[i].Cess,
              data.PurchaseReturnInvoiceDtl[i].UpdtUsr,
            ]
          )
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });
        // console.log("step 5");
        await queryRunner
          .query(
            "CALL spINVInsertInv_Stock_Tran_Dtl(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              data.PurchaseReturnInvoiceHdr.CompCode,
              data.PurchaseReturnInvoiceHdr.BranchCode,
              data.PurchaseReturnInvoiceHdr.DeptCode,
              data.PurchaseReturnInvoiceDtl[i].ItemCode,
              data.PurchaseReturnInvoiceDtl[i].InwardSeq,
              data.PurchaseReturnInvoiceDtl[i].SrNo,
              data.PurchaseReturnInvoiceDtl[i].BatchNo,
              data.PurchaseReturnInvoiceDtl[i].ExpiryDate,
              "PURRTN",
              l_VoucherId,
              moment().format("YYYY-MM-DD"),
              l_VoucherNo,
              data.PurchaseReturnInvoiceDtl[i].CostPrice,
              data.PurchaseReturnInvoiceDtl[i].LCostPrice,
              data.PurchaseReturnInvoiceDtl[i].Amount,
              data.PurchaseReturnInvoiceDtl[i].SalePrice,
              data.PurchaseReturnInvoiceDtl[i].MRP,
              data.PurchaseReturnInvoiceDtl[i].TaxAmount,
              data.PurchaseReturnInvoiceDtl[i].Qty,
              data.PurchaseReturnInvoiceDtl[i].TaxCode,
              data.PurchaseReturnInvoiceDtl[i].TaxPerc,
              data.PurchaseReturnInvoiceHdr.SuppId,
              data.PurchaseReturnInvoiceHdr.SuppName,
              data.PurchaseReturnInvoiceDtl[i].UpdtUsr,
            ]
          )
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });
        // console.log("step 6");

        await queryRunner
          .query(
            "CALL spINVInsertUpdate_inv_stock_main_from_PurchaseReturn(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              data.PurchaseReturnInvoiceHdr.CompCode,
              data.PurchaseReturnInvoiceHdr.BranchCode,
              data.PurchaseReturnInvoiceHdr.DeptCode,
              data.PurchaseReturnInvoiceDtl[i].ItemCode,
              data.PurchaseReturnInvoiceDtl[i].InwardSeq,
              data.PurchaseReturnInvoiceDtl[i].BatchNo,
              data.PurchaseReturnInvoiceDtl[i].ExpiryDate,
              data.PurchaseReturnInvoiceDtl[i].Amount,
              data.PurchaseReturnInvoiceDtl[i].SalePrice,
              data.PurchaseReturnInvoiceDtl[i].MRP,
              data.PurchaseReturnInvoiceDtl[i].Qty,
              data.PurchaseReturnInvoiceDtl[i].Amount,
              "PURRTN",
              l_VoucherId,
              data.PurchaseReturnInvoiceDtl[i].UpdtUsr,
            ]
          )
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });
      }
      // console.log("step 7");
      if (data.AddIncomeExpensesDtl && data.AddIncomeExpensesDtl.length > 0) {
        i = 0;
        for (i; i < data.AddIncomeExpensesDtl.length; i++) {
          await queryRunner
            .query(
              "CALL spINVInsertInvStockTranIncExps(?,?,?,?,?,?,?,?,?,?,?,?,?)",
              [
                data.PurchaseReturnInvoiceHdr.CompCode,
                "PURRTN",
                l_VoucherId,
                data.AddIncomeExpensesDtl[i].SrNo,
                data.AddIncomeExpensesDtl[i].IEType,
                data.AddIncomeExpensesDtl[i].Particular,
                data.AddIncomeExpensesDtl[i].Amount *
                  (data.AddIncomeExpensesDtl[i].IEType === "E" ? -1 : 1),
                data.AddIncomeExpensesDtl[i].SysOption1,
                data.AddIncomeExpensesDtl[i].SysOption2,
                data.AddIncomeExpensesDtl[i].SysOption3,
                data.AddIncomeExpensesDtl[i].SysOption4,
                data.AddIncomeExpensesDtl[i].SysOption5,
                data.PurchaseReturnInvoiceHdr.UpdtUsr,
              ]
            )
            .catch(async (err) => {
              throw new InternalServerErrorException(err);
            });
        }
      }
      // console.log("step 6");

      await queryRunner.commitTransaction();
      // console.log("after commit");
      return { message: "successful", data };
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  //invDeletePurchaseInvoice
  //Hari on 20210308
  async invDeletePurchaseInvoice(CompCode, pVoucherId, pUpdtUsr): Promise<any> {
    let result = await this.conn.query("CALL spINGGetDataDeletePurchase(?,?)", [
      CompCode,
      pVoucherId,
    ]);

    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let hdr = result[0][0];
      let dtl = result[1];
      // console.log("step1", hdr, dtl);

      //Prev Dtl data
      let i = 0;
      for (i; i < dtl.length; i++) {
        await queryRunner
          .query("CALL spINVDeletePurchaseDtl(?,?,?,?,?,?,?,?,?,?)", [
            dtl[i].Id,
            hdr.CompCode,
            hdr.BranchCode,
            hdr.DeptCode,
            dtl[i].ItemCode,
            pVoucherId,
            dtl[i].InwardSeq,
            dtl[i].TotalPurQty,
            dtl[i].Amount,
            pUpdtUsr,
          ])
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });

        // console.log(parseFloat(dtl[i].TotalPurQty) * -1, "TotalPurQty")
        // await queryRunner
        //   .query(
        //     "CALL spINVInsertUpdate_inv_stock_main_from_Purchase(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        //     [
        //       hdr.CompCode,
        //       hdr.BranchCode,
        //       hdr.DeptCode,
        //       dtl[i].ItemCode,
        //       dtl[i].InwardSeq,
        //       dtl[i].BatchNo,
        //       dtl[i].ExpiryDate,
        //       dtl[i].ItemTotalCost,
        //       dtl[i].SalePrice,
        //       dtl[i].MRP,
        //       parseFloat(dtl[i].TotalPurQty),
        //       (parseFloat(dtl[i].TotalPurQty)) *
        //       dtl[i].ItemTotalCost,
        //       "PUR",
        //       pVoucherId,
        //       dtl[i].UpdtUsr,
        //     ]
        //   )
        //   .catch(async (err) => {
        //     console.log(err)
        //     throw new InternalServerErrorException(err);
        //   });
      }

      //Delete From Header
      await queryRunner
        .query("CALL spINVDeletePurchaseHDR(?,?)", [hdr.CompCode, pVoucherId])
        .catch(async (err) => {
          throw new InternalServerErrorException(err);
        });

      await queryRunner.commitTransaction();
      return { message: "successful", hdr, dtl };
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  //invSaveUpdatePurchaseInvoice
  //Added by hari on 20210206
  async invSaveUpdatePurchaseInvoice(data): Promise<any> {
    // console.log(data);
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let l_VoucherNo;
      let l_VoucherId;
      l_VoucherId = data.PurchaseInvoiceHdr.VoucherId;
      l_VoucherNo = data.PurchaseInvoiceHdr.VoucherNo;
      // console.log("step 1", data);
      await queryRunner
        .query(
          "CALL spInvUpdatePurchaseHdr(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            l_VoucherId,
            moment(data.PurchaseInvoiceHdr.VoucherDate).format("YYYY-MM-DD"),
            l_VoucherNo,
            data.PurchaseInvoiceHdr.CompCode,
            data.PurchaseInvoiceHdr.BranchCode,
            data.PurchaseInvoiceHdr.DeptCode,
            data.PurchaseInvoiceHdr.TaxType,
            data.PurchaseInvoiceHdr.SuppId,
            data.PurchaseInvoiceHdr.PurchaseType,
            data.PurchaseInvoiceHdr.DeliveryChallanNo,
            data.PurchaseInvoiceHdr.DeliveryChallanDate !== null
              ? moment(data.PurchaseInvoiceHdr.DeliveryChallanDate).format(
                  "YYYY-MM-DD"
                )
              : null,
            data.PurchaseInvoiceHdr.PurchaseBillNo,
            data.PurchaseInvoiceHdr.PurchaseBillDate !== null
              ? moment(data.PurchaseInvoiceHdr.PurchaseBillDate).format(
                  "YYYY-MM-DD"
                )
              : null,
            data.PurchaseInvoiceHdr.EWayBillNo,
            data.PurchaseInvoiceHdr.VehicleNo,
            data.PurchaseInvoiceHdr.CreditDays,

            data.PurchaseInvoiceHdr.POId,
            data.PurchaseInvoiceHdr.PONo,
            data.PurchaseInvoiceHdr.PODate !== null
              ? moment(data.PurchaseInvoiceHdr.PODate).format("YYYY-MM-DD")
              : null,

            data.PurchaseInvoiceHdr.SysOption1,
            data.PurchaseInvoiceHdr.SysOption2,
            data.PurchaseInvoiceHdr.SysOption3,
            data.PurchaseInvoiceHdr.SysOption4,
            data.PurchaseInvoiceHdr.SysOption5,
            data.PurchaseInvoiceHdr.SysOption6,
            data.PurchaseInvoiceHdr.SysOption7,
            data.PurchaseInvoiceHdr.SysOption8,
            data.PurchaseInvoiceHdr.SysOption9,
            data.PurchaseInvoiceHdr.SysOption10,

            data.PurchaseInvoiceHdr.GrossAmount,
            data.PurchaseInvoiceHdr.DiscAmount,
            data.PurchaseInvoiceHdr.TaxAmount,
            data.PurchaseInvoiceHdr.MiscAmount,
            data.PurchaseInvoiceHdr.RoundOff,
            data.PurchaseInvoiceHdr.NetAmount,
            data.PurchaseInvoiceHdr.SettlementAmount,
            data.PurchaseInvoiceHdr.UpdtUsr,
          ]
        )
        .catch(async (err) => {
          throw new InternalServerErrorException(err);
        });
      // console.log("step 2");
      let InwardSeqRes = await queryRunner.query(
        "CALL spINVGetInwardSeqNo(?,?,?,?)",
        [
          data.PurchaseInvoiceHdr.CompCode,
          data.PurchaseInvoiceHdr.BranchCode,
          "PUR",
          null,
        ]
      );

      let l_InitialInwardSeqNo = parseInt(InwardSeqRes[0][0].InwardSeq);
      // console.log("step 3", l_InitialInwardSeqNo);
      // console.log("debug point", l_VoucherId, l_InitialInwardSeqNo);

      //Get list of distinct items
      let distinctItems = [];
      data.PurchaseInvoiceDtl.forEach((rr) => {
        if (
          distinctItems.filter((kk) => kk.ItemCode === rr.ItemCode).length === 0
        ) {
          distinctItems.push({ ItemCode: rr.ItemCode });
        }
      });

      // console.log("step 4");
      //Assign Inward Sequence No

      distinctItems.forEach((distinctItem) => {
        let i = 0;
        for (i; i < data.PurchaseInvoiceDtl.length; i++) {
          if (
            data.PurchaseInvoiceDtl[i].ItemCode === distinctItem.ItemCode &&
            data.PurchaseInvoiceDtl[i].InwardSeq === null
          ) {
            if (l_InitialInwardSeqNo === -999) {
              data.PurchaseInvoiceDtl[i].InwardSeq = l_InitialInwardSeqNo;
            } else {
              data.PurchaseInvoiceDtl[i].InwardSeq =
                l_InitialInwardSeqNo +
                data.PurchaseInvoiceDtl.filter(
                  (ll) =>
                    ll.ItemCode === distinctItem.ItemCode &&
                    ll.InwardSeq !== null
                ).length;
            }
            // console.log("set value", data.PurchaseInvoiceDtl[i].InwardSeq);
          }
        }
      });
      // console.log("step5");
      let i;
      i = 0;
      //Prev Dtl data
      for (i; i < data.PurchaseInvoicePrevDtl.length; i++) {
        await queryRunner
          .query("CALL spINVDeletePurchaseDtl(?,?,?,?,?,?,?,?,?,?)", [
            data.PurchaseInvoicePrevDtl[i].Id,
            data.PurchaseInvoiceHdr.CompCode,
            data.PurchaseInvoiceHdr.BranchCode,
            data.PurchaseInvoiceHdr.DeptCode,
            data.PurchaseInvoicePrevDtl[i].ItemCode,
            l_VoucherId,
            data.PurchaseInvoicePrevDtl[i].InwardSeq,
            data.PurchaseInvoicePrevDtl[i].TotalPurQty,
            data.PurchaseInvoicePrevDtl[i].Amount,
            data.PurchaseInvoiceHdr.UpdtUsr,
          ])
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });
      }
      // console.log("step6");

      //New Dtl data
      i = 0;
      for (i; i < data.PurchaseInvoiceDtl.length; i++) {
        await queryRunner
          .query(
            "CALL spInvInsertInvStockPurchaseDtl(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              data.PurchaseInvoiceHdr.CompCode,
              l_VoucherId,
              data.PurchaseInvoiceDtl[i].SrNo,
              data.PurchaseInvoiceDtl[i].ItemCode,
              data.PurchaseInvoiceDtl[i].ScannedBarcode,
              data.PurchaseInvoiceDtl[i].InwardSeq,
              data.PurchaseInvoiceDtl[i].BatchNo,
              data.PurchaseInvoiceDtl[i].ExpiryDate !== null
                ? moment(data.PurchaseInvoiceDtl[i].ExpiryDate).format(
                    "YYYY-MM-DD"
                  )
                : null,
              data.PurchaseInvoiceDtl[i].Qty,
              data.PurchaseInvoiceDtl[i].FreeQty,
              data.PurchaseInvoiceDtl[i].TotalPurQty,
              data.PurchaseInvoiceDtl[i].CostPrice,
              data.PurchaseInvoiceDtl[i].SalePrice,
              data.PurchaseInvoiceDtl[i].MRP,
              data.PurchaseInvoiceDtl[i].DiscPer,
              data.PurchaseInvoiceDtl[i].DiscAmount,
              data.PurchaseInvoiceDtl[i].TaxCode,
              data.PurchaseInvoiceDtl[i].TaxPerc,
              data.PurchaseInvoiceDtl[i].TaxAmount,
              data.PurchaseInvoiceDtl[i].ItemTotalCost,
              data.PurchaseInvoiceDtl[i].Amount,
              data.PurchaseInvoiceDtl[i].SysOption1,
              data.PurchaseInvoiceDtl[i].SysOption2,
              data.PurchaseInvoiceDtl[i].SysOption3,
              data.PurchaseInvoiceDtl[i].SysOption4,
              data.PurchaseInvoiceDtl[i].SysOption5,
              data.PurchaseInvoiceDtl[i].CGST,
              data.PurchaseInvoiceDtl[i].SGST,
              data.PurchaseInvoiceDtl[i].IGST,
              data.PurchaseInvoiceDtl[i].UTGST,
              data.PurchaseInvoiceDtl[i].Surcharge,
              data.PurchaseInvoiceDtl[i].Cess,
              data.PurchaseInvoiceDtl[i].UpdtUsr,
            ]
          )
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });

        await queryRunner
          .query(
            "CALL spINVInsertInv_Stock_Tran_Dtl(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              data.PurchaseInvoiceHdr.CompCode,
              data.PurchaseInvoiceHdr.BranchCode,
              data.PurchaseInvoiceHdr.DeptCode,
              data.PurchaseInvoiceDtl[i].ItemCode,
              data.PurchaseInvoiceDtl[i].InwardSeq,
              data.PurchaseInvoiceDtl[i].SrNo,
              data.PurchaseInvoiceDtl[i].BatchNo,
              data.PurchaseInvoiceDtl[i].ExpiryDate,
              "PUR",
              l_VoucherId,
              moment().format("YYYY-MM-DD"),
              l_VoucherNo,
              data.PurchaseInvoiceDtl[i].CostPrice,
              data.PurchaseInvoiceDtl[i].ItemTotalCost,
              data.PurchaseInvoiceDtl[i].ItemTotalCost *
                data.PurchaseInvoiceDtl[i].TotalPurQty,
              data.PurchaseInvoiceDtl[i].SalePrice,
              data.PurchaseInvoiceDtl[i].MRP,
              data.PurchaseInvoiceDtl[i].TaxAmount,
              data.PurchaseInvoiceDtl[i].TotalPurQty,
              data.PurchaseInvoiceDtl[i].TaxCode,
              data.PurchaseInvoiceDtl[i].TaxPerc,
              data.PurchaseInvoiceHdr.SuppId,
              data.PurchaseInvoiceHdr.SuppName,
              data.PurchaseInvoiceDtl[i].UpdtUsr,
            ]
          )
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });

        await queryRunner
          .query(
            "CALL spINVInsertUpdate_inv_stock_main_from_Purchase(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              data.PurchaseInvoiceHdr.CompCode,
              data.PurchaseInvoiceHdr.BranchCode,
              data.PurchaseInvoiceHdr.DeptCode,
              data.PurchaseInvoiceDtl[i].ItemCode,
              data.PurchaseInvoiceDtl[i].InwardSeq,
              data.PurchaseInvoiceDtl[i].BatchNo,
              data.PurchaseInvoiceDtl[i].ExpiryDate,
              data.PurchaseInvoiceDtl[i].ItemTotalCost,
              data.PurchaseInvoiceDtl[i].SalePrice,
              data.PurchaseInvoiceDtl[i].MRP,
              data.PurchaseInvoiceDtl[i].TotalPurQty,
              data.PurchaseInvoiceDtl[i].TotalPurQty *
                data.PurchaseInvoiceDtl[i].ItemTotalCost,
              "PUR",
              l_VoucherId,
              data.PurchaseInvoiceDtl[i].UpdtUsr,
            ]
          )
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });
      }
      // console.log("step 7");

      i = 0;
      //Prev Income Expense data
      for (i; i < data.AddIncomeExpensesPrevDtl.length; i++) {
        await queryRunner
          .query("CALL spINVDeleteIncomeExpense(?,?,?)", [
            data.PurchaseInvoiceHdr.CompCode,
            "PUR",
            l_VoucherId,
          ])
          .catch(async (err) => {
            console.log(err);
            throw new InternalServerErrorException(err);
          });
      }
      // console.log("step8");

      // console.log("step 10");

      if (data.AddIncomeExpensesDtl && data.AddIncomeExpensesDtl.length > 0) {
        i = 0;
        for (i; i < data.AddIncomeExpensesDtl.length; i++) {
          await queryRunner
            .query(
              "CALL spINVInsertInvStockTranIncExps(?,?,?,?,?,?,?,?,?,?,?,?,?)",
              [
                data.PurchaseInvoiceHdr.CompCode,
                "PUR",
                l_VoucherId,
                data.AddIncomeExpensesDtl[i].SrNo,
                data.AddIncomeExpensesDtl[i].IEType,
                data.AddIncomeExpensesDtl[i].Particular,
                // data.AddIncomeExpensesDtl[i].Amount *
                //   (data.AddIncomeExpensesDtl[i].IEType === "E" ? -1 : 1),
                data.AddIncomeExpensesDtl[i].Amount,
                data.AddIncomeExpensesDtl[i].SysOption1,
                data.AddIncomeExpensesDtl[i].SysOption2,
                data.AddIncomeExpensesDtl[i].SysOption3,
                data.AddIncomeExpensesDtl[i].SysOption4,
                data.AddIncomeExpensesDtl[i].SysOption5,
                data.PurchaseInvoiceHdr.UpdtUsr,
              ]
            )
            .catch(async (err) => {
              throw new InternalServerErrorException(err);
            });
        }
      }
      // console.log("step11");

      await queryRunner.commitTransaction();
      // console.log("after commit");
      return { message: "successful", data };
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
  //invSaveAdjustments
  async invSaveAdjustments(data): Promise<any> {
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let l_VoucherNo;
      // console.log("debug1");
      //if (_.includes([undefined, null, ""], data.AdjustmentHdr.VoucherNo)) {
      if (_.includes([undefined, null, ""], data.AdjustmentHdr.VoucherNo)) {
        const seqData = {
          CompCode: data.CompCode,
          TranType: data.AdjustmentHdr.AdjustmentType,
          updt_usr: data.AdjustmentHdr.UpdtUsr,
        };
        let TranNextTranNo = await this.sequenceConfig.getSequenceNextVal(
          seqData
        );

        l_VoucherNo = TranNextTranNo.data[0].NextVal;
      } else {
        l_VoucherNo = data.AdjustmentHdr.VoucherNo;
      }

      let l_hdrRes = await queryRunner
        .query("CALL spInvInsertInvStockAdjHdr(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [
          moment(data.AdjustmentHdr.VoucherDate).format("YYYY-MM-DD"),
          l_VoucherNo,
          data.AdjustmentHdr.CompCode,
          data.AdjustmentHdr.BranchCode,
          data.AdjustmentHdr.DeptCode,
          data.AdjustmentHdr.AdjustmentType,
          data.AdjustmentHdr.Remark,
          data.AdjustmentHdr.ReasonCode,
          data.AdjustmentHdr.SysOption1,
          data.AdjustmentHdr.SysOption2,
          data.AdjustmentHdr.SysOption3,
          data.AdjustmentHdr.SysOption4,
          data.AdjustmentHdr.SysOption5,
          data.AdjustmentHdr.UpdtUsr,
        ])
        .catch(async (err) => {
          throw new InternalServerErrorException(err);
        });
      let l_VoucherId = l_hdrRes[0][0].VoucherId;
      console.log("3");
      let InwardSeqRes = await queryRunner.query(
        "CALL spINVGetInwardSeqNo(?,?,?,?)",
        [
          data.AdjustmentHdr.CompCode,
          data.AdjustmentHdr.BranchCode,
          data.AdjustmentHdr.AdjustmentType,
          null,
        ]
      );
      let l_InitialInwardSeqNo = parseInt(InwardSeqRes[0][0].InwardSeq);

      let i;
      i = 0;
      for (i; i < data.AdjustmentDtl.length; i++) {
        // console.log(l_InitialInwardSeqNo,"inward sequ",data.AdjustmentDtl[i])
        let l_InwardSeqNo;
        if (
          data.AdjustmentHdr.AdjustmentType === "REPRO" &&
          data.AdjustmentDtl[i].RIType === "R"
        ) {
          l_InwardSeqNo = l_InitialInwardSeqNo;
        } else {
          l_InwardSeqNo = data.AdjustmentDtl[i].InwardSeq;
        }
        // console.log("4");
        await queryRunner
          .query(
            "CALL spInvInsertInvStockAdjDtl(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              data.AdjustmentHdr.CompCode,
              l_VoucherId,
              data.AdjustmentDtl[i].RIType,
              data.AdjustmentDtl[i].SrNo,
              data.AdjustmentDtl[i].ItemCode,
              data.AdjustmentDtl[i].ScannedBarcode,
              l_InwardSeqNo,
              data.AdjustmentDtl[i].BatchNo,
              data.AdjustmentDtl[i].ExpiryDate === null
                ? null
                : moment(data.AdjustmentDtl[i].ExpiryDate).format("YYYY-MM-DD"),
              data.AdjustmentDtl[i].Qty *
                (data.AdjustmentDtl[i].RIType === "I" ? -1 : 1),
              data.AdjustmentDtl[i].CostPrice,
              data.AdjustmentDtl[i].SalePrice,
              data.AdjustmentDtl[i].MRP,
              data.AdjustmentDtl[i].CostPrice *
                data.AdjustmentDtl[i].Qty *
                (data.AdjustmentDtl[i].RIType === "I" ? -1 : 1),
              data.AdjustmentDtl[i].Remark,
              data.AdjustmentDtl[i].SysOption1,
              data.AdjustmentDtl[i].SysOption2,
              data.AdjustmentDtl[i].SysOption3,
              data.AdjustmentDtl[i].SysOption4,
              data.AdjustmentDtl[i].SysOption5,
              data.AdjustmentDtl[i].SysOption6,
              data.AdjustmentDtl[i].SysOption7,
              data.AdjustmentDtl[i].SysOption8,
              data.AdjustmentDtl[i].SysOption9,
              data.AdjustmentDtl[i].SysOption10,
              data.AdjustmentDtl[i].UpdtUsr,
            ]
          )
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });
        // console.log("5");
        await queryRunner
          .query(
            "CALL spINVInsertInv_Stock_Tran_Dtl(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              data.AdjustmentHdr.CompCode,
              data.AdjustmentHdr.BranchCode,
              data.AdjustmentHdr.DeptCode,
              data.AdjustmentDtl[i].ItemCode,
              l_InwardSeqNo,
              data.AdjustmentDtl[i].SrNo,
              data.AdjustmentDtl[i].BatchNo,
              data.AdjustmentDtl[i].ExpiryDate === null
                ? null
                : moment(data.AdjustmentDtl[i].ExpiryDate).format("YYYY-MM-DD"),
              data.AdjustmentHdr.AdjustmentType, //ADJS - REPRO - RAADJ
              l_VoucherId,
              moment().format("YYYY-MM-DD"),
              l_VoucherNo,
              data.AdjustmentDtl[i].CostPrice,
              data.AdjustmentDtl[i].SalePrice,
              data.AdjustmentDtl[i].CostPrice *
                data.AdjustmentDtl[i].Qty *
                (data.AdjustmentDtl[i].RIType === "I" ? -1 : 1),
              data.AdjustmentDtl[i].CostPrice,
              data.AdjustmentDtl[i].MRP,
              null,
              data.AdjustmentDtl[i].Qty *
                (data.AdjustmentDtl[i].RIType === "I" ? -1 : 1),
              null,
              null,
              null,
              data.AdjustmentHdr.AdjustmentType === "STOCKOUT"
                ? `Box No.: ${data.AdjustmentHdr.SysOption1}`
                : data.AdjustmentDtl[i].Remark,
              data.AdjustmentDtl[i].UpdtUsr,
            ]
          )
          .catch(async (err) => {
            console.log(err);
            throw new InternalServerErrorException(err);
          });

        // console.log("debug2");
        // Modified by hari on 20210201 for non sequence wise entries
        // if (
        //   data.AdjustmentHdr.AdjustmentType === "REPRO" &&
        //   data.AdjustmentDtl[i].RIType === "R"
        // ) {
        //   await queryRunner
        //     .query(
        //       "CALL spINVInsertInv_Stock_Main(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        //       [
        //         data.AdjustmentHdr.CompCode,
        //         data.AdjustmentHdr.BranchCode,
        //         data.AdjustmentHdr.DeptCode,
        //         data.AdjustmentDtl[i].ItemCode,
        //         l_InwardSeqNo,
        //         data.AdjustmentDtl[i].BatchNo,
        //         data.AdjustmentDtl[i].ExpiryDate,
        //         data.AdjustmentDtl[i].CostPrice,
        //         data.AdjustmentDtl[i].SalePrice,
        //         data.AdjustmentDtl[i].MRP,
        //         data.AdjustmentDtl[i].Qty, //CSStock
        //         null, //OP
        //         null, //PUR
        //         null, //PURRTN
        //         null, //SALE
        //         null, //SLRTN
        //         data.AdjustmentDtl[i].Qty, //ADJ
        //         null, //TRFIN
        //         null, //TRFOUT
        //         null, //IDEPTIN
        //         null, //IDEPTOUT
        //         data.AdjustmentDtl[i].CostPrice * data.AdjustmentDtl[i].Qty, //CSStock VAL
        //         null, //OP
        //         null, //PUR
        //         null, //PURRTN
        //         null, //SALE
        //         null, //SLRTN
        //         data.AdjustmentDtl[i].CostPrice * data.AdjustmentDtl[i].Qty, //ADJ VAL
        //         null, //TRFIN VAL
        //         null, //TRFOUT VAL
        //         null, //IDEPTIN VAL
        //         null, //IDEPTOUT VAL
        //         data.AdjustmentHdr.AdjustmentType,
        //         l_VoucherId,
        //         data.AdjustmentDtl[i].UpdtUsr,
        //       ]
        //     )
        //     .catch(async (err) => {
        //       console.log(
        //         err,
        //         "some rror received - spINVInsertInv_Stock_Main"
        //       );
        //       await queryRunner.rollbackTransaction();
        //       return false;
        //     });
        // } else {
        //   await queryRunner
        //     .query(
        //       "CALL spINVUpdateInvStockMainFromAdjustment(?,?,?,?,?,?,?,?)",
        //       [
        //         data.AdjustmentHdr.CompCode,
        //         data.AdjustmentHdr.BranchCode,
        //         data.AdjustmentHdr.DeptCode,
        //         data.AdjustmentDtl[i].ItemCode,
        //         l_InwardSeqNo,
        //         data.AdjustmentDtl[i].Qty *
        //           (data.AdjustmentDtl[i].RIType === "I" ? -1 : 1),
        //         data.AdjustmentDtl[i].CostPrice *
        //           data.AdjustmentDtl[i].Qty *
        //           (data.AdjustmentDtl[i].RIType === "I" ? -1 : 1),
        //         data.AdjustmentDtl[i].UpdtUsr,
        //       ]
        //     )
        //     .catch(async (err) => {
        //       console.log(err, "some rror received");
        //       await queryRunner.rollbackTransaction();
        //       return false;
        //     });
        // }

        //spINVInsertUpdate_inv_stock_main_from_Adjustments
        // console.log("my data", data.AdjustmentDtl[i]);
        console.log("6", data.AdjustmentDtl[i]);
        await queryRunner
          .query(
            "CALL spINVInsertUpdate_inv_stock_main_from_Adjustments(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              data.AdjustmentHdr.CompCode,
              data.AdjustmentHdr.BranchCode,
              data.AdjustmentHdr.DeptCode,
              data.AdjustmentDtl[i].ItemCode,
              l_InwardSeqNo,
              data.AdjustmentDtl[i].BatchNo,
              data.AdjustmentDtl[i].ExpiryDate,
              data.AdjustmentDtl[i].CostPrice,
              data.AdjustmentDtl[i].SalePrice,
              data.AdjustmentDtl[i].MRP,
              data.AdjustmentDtl[i].Qty *
                (data.AdjustmentDtl[i].RIType === "I" ? -1 : 1),
              data.AdjustmentDtl[i].Qty *
                data.AdjustmentDtl[i].CostPrice *
                (data.AdjustmentDtl[i].RIType === "I" ? -1 : 1),
              data.AdjustmentHdr.AdjustmentType,
              l_VoucherId,
              data.AdjustmentDtl[i].UpdtUsr,
            ]
          )
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });
        console.log("7");
      }

      await queryRunner.commitTransaction();
      // console.log("after commit");
      return { message: "successful", data };
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  //invDeleteAdjustment
  //Hari on 20210308
  async invDeleteAdjustment(CompCode, pVoucherId, pUpdtUsr): Promise<any> {
    let result = await this.conn.query(
      "CALL spINGGetDataDeleteAdjustment(?,?)",
      [CompCode, pVoucherId]
    );

    const queryRunner = await this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let hdr = result[0][0];
      let dtl = result[1];
      //Prev Dtl data
      let i = 0;
      for (i; i < dtl.length; i++) {
        await queryRunner
          .query("CALL spINVDeleteAdjustmentDtl(?,?,?,?,?,?,?,?,?,?,?)", [
            dtl[i].Id,
            hdr.AdjustmentType,
            hdr.CompCode,
            hdr.BranchCode,
            hdr.DeptCode,
            dtl[i].ItemCode,
            pVoucherId,
            dtl[i].InwardSeq,
            Math.abs(dtl[i].Qty) * (dtl[i].RIType === "I" ? -1 : 1),
            dtl[i].CostPrice *
              Math.abs(dtl[i].Qty) *
              (dtl[i].RIType === "I" ? -1 : 1),
            ,
            pUpdtUsr,
          ])
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });
      }
      // console.log("kk9");
      //Delete From Header
      await queryRunner
        .query("CALL spINVDeleteAdjustmentHDR(?,?)", [hdr.CompCode, pVoucherId])
        .catch(async (err) => {
          throw new InternalServerErrorException(err);
        });
      await queryRunner.commitTransaction();
      return { message: "successful", hdr, dtl };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return err;
    } finally {
      await queryRunner.release();
    }
  }

  //Hari on 20210206
  async invSaveUpdateAdjustments(data): Promise<any> {
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let l_VoucherNo, l_VoucherId;
      l_VoucherNo = data.AdjustmentHdr.VoucherNo;
      l_VoucherId = data.AdjustmentHdr.VoucherId;
      // console.log("step 1");
      let l_hdrRes = await queryRunner
        .query("CALL spInvUpdateAdjustmentHdr(?,?,?,?,?,?,?,?,?,?,?,?)", [
          data.AdjustmentHdr.CompCode,
          l_VoucherId,
          moment(data.AdjustmentHdr.VoucherDate).format("YYYY-MM-DD"),
          l_VoucherNo,
          data.AdjustmentHdr.Remark,
          data.AdjustmentHdr.ReasonCode,
          data.AdjustmentHdr.SysOption1,
          data.AdjustmentHdr.SysOption2,
          data.AdjustmentHdr.SysOption3,
          data.AdjustmentHdr.SysOption4,
          data.AdjustmentHdr.SysOption5,
          data.AdjustmentHdr.UpdtUsr,
        ])
        .catch(async (err) => {
          throw new InternalServerErrorException(err);
        });
      // console.log("step 2");
      let InwardSeqRes = await queryRunner.query(
        "CALL spINVGetInwardSeqNo(?,?,?,?)",
        [
          data.AdjustmentHdr.CompCode,
          data.AdjustmentHdr.BranchCode,
          data.AdjustmentHdr.AdjustmentType,
          null,
        ]
      );
      let l_InitialInwardSeqNo = parseInt(InwardSeqRes[0][0].InwardSeq);
      // console.log("step 3");
      let i;
      i = 0;
      // console.log('compl',data)
      // Prev Dtl Data
      for (i; i < data.AdjustmentPrevDtl.length; i++) {
        await queryRunner
          .query("CALL spINVDeleteAdjustmentDtl(?,?,?,?,?,?,?,?,?,?,?)", [
            data.AdjustmentPrevDtl[i].Id,
            data.AdjustmentHdr.AdjustmentType,
            data.AdjustmentHdr.CompCode,
            data.AdjustmentHdr.BranchCode,
            data.AdjustmentHdr.DeptCode,
            data.AdjustmentPrevDtl[i].ItemCode,
            l_VoucherId,
            data.AdjustmentPrevDtl[i].InwardSeq,
            Math.abs(data.AdjustmentPrevDtl[i].Qty) *
              (data.AdjustmentPrevDtl[i].RIType === "I" ? -1 : 1),
            data.AdjustmentPrevDtl[i].CostPrice *
              Math.abs(data.AdjustmentPrevDtl[i].Qty) *
              (data.AdjustmentPrevDtl[i].RIType === "I" ? -1 : 1),
            data.AdjustmentHdr.UpdtUsr,
          ])
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });
      }
      // console.log("step 4");
      i = 0;
      for (i; i < data.AdjustmentDtl.length; i++) {
        // console.log(l_InitialInwardSeqNo,"inward sequ",data.AdjustmentDtl[i])
        let l_InwardSeqNo;
        if (
          data.AdjustmentHdr.AdjustmentType === "REPRO" &&
          data.AdjustmentDtl[i].RIType === "R"
        ) {
          l_InwardSeqNo = l_InitialInwardSeqNo;
        } else {
          l_InwardSeqNo = data.AdjustmentDtl[i].InwardSeq;
        }

        // console.log(data)
        await queryRunner
          .query(
            "CALL spInvInsertInvStockAdjDtl(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              data.AdjustmentHdr.CompCode,
              l_VoucherId,
              data.AdjustmentDtl[i].RIType,
              data.AdjustmentDtl[i].SrNo,
              data.AdjustmentDtl[i].ItemCode,
              data.AdjustmentDtl[i].ScannedBarcode,
              l_InwardSeqNo,
              data.AdjustmentDtl[i].BatchNo,
              data.AdjustmentDtl[i].ExpiryDate === null
                ? null
                : moment(data.AdjustmentDtl[i].ExpiryDate).format("YYYY-MM-DD"),
              data.AdjustmentDtl[i].Qty *
                (data.AdjustmentDtl[i].RIType === "I" ? -1 : 1),
              data.AdjustmentDtl[i].CostPrice,
              data.AdjustmentDtl[i].SalePrice,
              data.AdjustmentDtl[i].MRP,
              data.AdjustmentDtl[i].CostPrice *
                data.AdjustmentDtl[i].Qty *
                (data.AdjustmentDtl[i].RIType === "I" ? -1 : 1),
              data.AdjustmentDtl[i].Remark,
              data.AdjustmentDtl[i].SysOption1,
              data.AdjustmentDtl[i].SysOption2,
              data.AdjustmentDtl[i].SysOption3,
              data.AdjustmentDtl[i].SysOption4,
              data.AdjustmentDtl[i].SysOption5,
              data.AdjustmentDtl[i].SysOption6,
              data.AdjustmentDtl[i].SysOption7,
              data.AdjustmentDtl[i].SysOption8,
              data.AdjustmentDtl[i].SysOption9,
              data.AdjustmentDtl[i].SysOption10,
              data.AdjustmentDtl[i].UpdtUsr,
            ]
          )
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });
        console.log("step 5", data, "edit");
        await queryRunner
          .query(
            "CALL spINVInsertInv_Stock_Tran_Dtl(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              data.AdjustmentHdr.CompCode,
              data.AdjustmentHdr.BranchCode,
              data.AdjustmentHdr.DeptCode,
              data.AdjustmentDtl[i].ItemCode,
              l_InwardSeqNo,
              data.AdjustmentDtl[i].SrNo,
              data.AdjustmentDtl[i].BatchNo,
              data.AdjustmentDtl[i].ExpiryDate === null
                ? null
                : moment(data.AdjustmentDtl[i].ExpiryDate).format("YYYY-MM-DD"),
              data.AdjustmentHdr.AdjustmentType, //ADJS - REPRO - RAADJ
              l_VoucherId,
              moment().format("YYYY-MM-DD"),
              l_VoucherNo,
              data.AdjustmentDtl[i].CostPrice,
              data.AdjustmentDtl[i].SalePrice,
              data.AdjustmentDtl[i].CostPrice *
                data.AdjustmentDtl[i].Qty *
                (data.AdjustmentDtl[i].RIType === "I" ? -1 : 1),
              data.AdjustmentDtl[i].CostPrice,
              data.AdjustmentDtl[i].MRP,
              null,
              data.AdjustmentDtl[i].Qty *
                (data.AdjustmentDtl[i].RIType === "I" ? -1 : 1),
              null,
              null,
              null,
              data.AdjustmentHdr.AdjustmentType === "STOCKOUT"
                ? `Box No.: ${data.AdjustmentHdr.SysOption1}`
                : data.AdjustmentDtl[i].Remark,
              data.AdjustmentDtl[i].UpdtUsr,
            ]
          )
          .catch(async (err) => {
            console.log(
              err,
              "some rror received - spINVInsertInv_Stock_Tran_Dtl"
            );
            await queryRunner.rollbackTransaction();
            return false;
          });
        // console.log("step 6");

        //spINVInsertUpdate_inv_stock_main_from_Adjustments
        await queryRunner
          .query(
            "CALL spINVInsertUpdate_inv_stock_main_from_Adjustments(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              data.AdjustmentHdr.CompCode,
              data.AdjustmentHdr.BranchCode,
              data.AdjustmentHdr.DeptCode,
              data.AdjustmentDtl[i].ItemCode,
              l_InwardSeqNo,
              data.AdjustmentDtl[i].BatchNo,
              data.AdjustmentDtl[i].ExpiryDate,
              data.AdjustmentDtl[i].CostPrice,
              data.AdjustmentDtl[i].SalePrice,
              data.AdjustmentDtl[i].MRP,
              data.AdjustmentDtl[i].Qty *
                (data.AdjustmentDtl[i].RIType === "I" ? -1 : 1),
              data.AdjustmentDtl[i].Qty *
                data.AdjustmentDtl[i].CostPrice *
                (data.AdjustmentDtl[i].RIType === "I" ? -1 : 1),
              data.AdjustmentHdr.AdjustmentType,
              l_VoucherId,
              data.AdjustmentDtl[i].UpdtUsr,
            ]
          )
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });

        // console.log("step 7");
      }
      await queryRunner.commitTransaction();
      // console.log("after commit");
      return { message: "successful", data };
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async invGetAllInwardSeqInfo(
    pCompCode,
    pBranchCode,
    pItemCode
  ): Promise<any> {
    try {
      let query = `CALL spINVGetAllInwardSeqInfo(?,?,?)`;
      const res = await this.conn.query(query, [
        pCompCode,
        pBranchCode,
        pItemCode,
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

  //invGetDataStockValuationSummary
  async invGetDataStockValuationSummary(
    pCompCode,
    pBranchCode,
    pAsOfDate
  ): Promise<any> {
    try {
      // console.log(pCompCode, pBranchCode, pAsOfDate);
      let query = `CALL spINVGetDataStockValuationSummary(?,?,?)`;
      const res = await this.conn.query(query, [
        pCompCode,
        pBranchCode,
        pAsOfDate,
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

  async invGetDataStockValuationDetail(
    pCompCode,
    pBranchCode,
    pItemCode,
    pAsOfDate
  ): Promise<any> {
    try {
      // console.log("before call", pCompCode, pBranchCode, pItemCode);
      let query = `CALL spINVGetDataStockValuationDetail(?,?,?,?)`;
      const res = await this.conn.query(query, [
        pCompCode,
        pBranchCode,
        pItemCode,
        pAsOfDate,
      ]);
      // console.log("after call", res);
      return {
        message: "successful",
        data: res,
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async invGetDataMKStockOut(CompCode): Promise<any> {
    try {
      let query = `Call spGetDataMKStockOut(?);`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //invUpdateStockOutDtlMK
  async invUpdateStockOutDtlMK(data): Promise<any> {
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let i;
      i = 0;
      for (i; i < data.StockOutDtlMK.length; i++) {
        await queryRunner
          .query("CALL spINVMKUpdateStockOutData(?,?,?,?,?,?,?,?,?)", [
            data.CompCode,
            data.StockOutDtlMK[i].VoucherId,
            data.StockOutDtlMK[i].ItemCode,
            data.StockOutDtlMK[i].PacketNo,
            data.StockOutDtlMK[i].EstimatedPrice,
            data.StockOutDtlMK[i].DeliveryStatus,
            data.StockOutDtlMK[i].DOD,
            data.StockOutDtlMK[i].ActualSalePrice,
            data.StockOutDtlMK[i].UpdtUsr,
          ])
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });
      }

      await queryRunner.commitTransaction();
      // console.log("after commit");
      return { message: "successful", data };
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  //invGenerateInvoiceStockOutDtlMK
  async invGenerateInvoiceStockOutDtlMK(data): Promise<any> {
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    // this.orders.saveServiceInvoice("ss");

    // console.log(data, "generate invoice");
    try {
      // await this.orders.;
      let invoiceHdr;
      let invoiceDtl = [];
      let i;
      i = 0;
      let l_SumOfAMount = 0;
      for (i; i < data.StockOutDtlMK.length; i++) {
        invoiceDtl.push({
          SrNo: invoiceDtl.length + 1,
          ItemType: "I",
          ItemCode: data.StockOutDtlMK[i].ItemCode,
          ItemName: data.StockOutDtlMK[i].ItemName,
          ItemDesc: "",
          HSNSACCode: "",
          TaxCode: "",
          UnitCode: "",
          UnitName: "PCS",
          Qty: data.StockOutDtlMK[i].Qty,
          Rate: data.StockOutDtlMK[i].ActualSalePrice,
          Disc: 0,
          Amount: data.StockOutDtlMK[i].ActualAmount,
          SGST: 0,
          CGST: 0,
          UGST: 0,
          IGST: 0,
          Surcharge: 0,
          Cess: 0,
          SysOption1: data.StockOutDtlMK[i].PacketNo,
          SysOption2: "",
          SysOption3: "",
          SysOption4: "",
          SysOption5: "",
          UpdtUsr: "",
          CompCode: data.StockOutDtlMK[i].CompCode,
        });

        l_SumOfAMount += parseFloat(data.StockOutDtlMK[i].ActualAmount);
      }

      // console.log('for each row', data.Remark)
      invoiceHdr = {
        InvoiceNo: "",
        InvoiceDate: moment().format("YYYY-MM-DD"),
        CompCode: data.StockOutDtlMK[0].CompCode,
        BranchCode: data.StockOutDtlMK[0].BranchCode,
        CustId: data.StockOutDtlMK[0].Party,
        CustAddressId: null,
        SysOption1: "",
        SysOption2: "",
        SysOption3: "",
        SysOption4: "",
        SysOption5: "",
        InvoiceRemark: data.StockOutDtlMK[0].Remark,
        GrossAmount: l_SumOfAMount,
        DiscAmount: 0,
        TaxAmount: 0,
        RoundOff: 0,
        InvoiceAmount: l_SumOfAMount,
        SettlementAmount: 0,
        UpdtUsr: "",
      };

      // console.log("after hdr", invoiceHdr, invoiceDtl);
      let gg = await this.orders.saveServiceInvoice({ invoiceHdr, invoiceDtl });
      // console.log("Generated Invoice Id", gg.data.InvoiceId);

      i = 0;
      for (i; i < data.StockOutDtlMK.length; i++) {
        //spINVMKUpdateInvoiceGenerateStockOutData
        await queryRunner
          .query(
            "CALL spINVMKUpdateInvoiceGenerateStockOutData(?,?,?,?,?,?,?,?,?)",
            [
              invoiceHdr.CompCode,
              data.StockOutDtlMK[i].VoucherId,
              data.StockOutDtlMK[i].ItemCode,
              data.StockOutDtlMK[i].PacketNo,
              data.StockOutDtlMK[i].Party,
              data.StockOutDtlMK[i].ActualSalePrice,
              gg.data.InvoiceId,
              "SOLD",
              data.StockOutDtlMK[i].UpdtUsr,
            ]
          )
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });
      }

      await queryRunner.commitTransaction();
      // await queryRunner.rollbackTransaction();
      // console.log("after commit");
      return { message: "successful", data };
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  //Hari on 20210311
  async deleteServiceInvoice(CompCode: any, pInvoiceId: any): Promise<any> {
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner
        .query("CALL spDeleteInvoiceHdr(?,?)", [CompCode, pInvoiceId])
        .catch(async (err) => {
          throw new InternalServerErrorException(err);
        });

      await queryRunner
        .query("CALL spDeleteInvoiceDtl(?,?)", [CompCode, pInvoiceId])
        .catch(async (err) => {
          throw new InternalServerErrorException(err);
        });

      await queryRunner.commitTransaction();
      return {
        message: "successful",
        data: { message: "Data Deleted successfully", InvoiceId: pInvoiceId },
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async modifyServiceInvoice(data: any): Promise<any> {
    // console.log(data);
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    // console.log(data)
    // let invoiceId = data.invoiceHdr.InvoiceId;
    try {
      let query = `CALL spUpdtInvoiceHdr(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      await queryRunner
        .query(query, [
          data.invoiceHdr.InvoiceId,
          data.invoiceHdr.InvoiceNo,
          moment(data.invoiceHdr.InvoiceDate).format("YYYY-MM-DD"),
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
        .catch(async (err) => {
          throw new InternalServerErrorException(err);
        });

      await queryRunner
        .query("CALL spDeleteInvoiceDtl(?,?)", [
          data.invoiceHdr.CompCode,
          data.invoiceHdr.InvoiceId,
        ])
        .catch(async (err) => {
          throw new InternalServerErrorException(err);
        });
      data.invoiceDtl.map(async (item) => {
        await queryRunner
          .query(
            "CALL spInsInvoiceDTL(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              data.invoiceHdr.CompCode,
              data.invoiceHdr.InvoiceId,
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
          )
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });
      });

      await queryRunner.commitTransaction();
      return {
        message: "successful",
        data: {
          InvoiceId: data.invoiceHdr.InvoiceId,
          InvoiceDate: data.invoiceHdr.InvoiceDate,
          invoiceNo: data.invoiceHdr.InvoiceNo,
        },
      };
    } catch (err) {
      console.error("error", err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  //spINVMKUpdateStockOutDataArchive
  async invUpdateStockOutDtlMKArchive(data): Promise<any> {
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // console.log(data);
      await queryRunner
        .query("CALL spINVMKUpdateStockOutDataArchive(?,?,?,?,?,?)", [
          data.CompCode,
          data.StockOutDtlMK.VoucherId,
          data.StockOutDtlMK.ItemCode,
          data.StockOutDtlMK.PacketNo,
          data.StockOutDtlMK.IsArchived,
          data.StockOutDtlMK.UpdtUsr,
        ])
        .catch(async (err) => {
          throw new InternalServerErrorException(err);
        });

      await queryRunner.commitTransaction();
      // console.log("after commit");
      return { message: "successful", data };
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  //Added by Atul on 20210122
  async invGetDataINVAllTranDocView(
    CompCode,
    pTranType,
    pFromDate,
    pToDate,
    pRefCode,
    pCurrentUserName
  ): Promise<any> {
    try {
      // console.log(
      //   "before call",
      //   pTranType,
      //   pFromDate,
      //   pToDate,
      //   pRefCode,
      //   pCurrentUserName
      // );
      let query = `CALL spGetDataINVAllTranDocView(?,?,?,?,?,?)`;
      const res = await this.conn.query(query, [
        CompCode,
        pTranType,
        pFromDate,
        pToDate,
        pRefCode === "ALL" ? "" : pRefCode,
        pCurrentUserName,
      ]);
      // console.log("after call", res[0]);
      return {
        message: "successful",
        data: res[0],
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //call spGetDataTranPurchase(7);
  async invGetDataTranPurchase(CompCode, pVoucherId): Promise<any> {
    try {
      // console.log("before call", pCompCode, pBranchCode, pItemCode);
      let query = `CALL spGetDataTranPurchase(?,?)`;
      const res = await this.conn.query(query, [CompCode, pVoucherId]);
      // console.log("after call", res);
      return {
        message: "successful",
        data: res,
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async invGetDataTranAdjustement(CompCode, pVoucherId): Promise<any> {
    try {
      // console.log("before call", pCompCode, pBranchCode, pItemCode);
      let query = `CALL spGetDataTranAdjustments(?,?)`;
      const res = await this.conn.query(query, [CompCode, pVoucherId]);
      // console.log("after call", res);
      return {
        message: "successful",
        data: res,
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //call invValidateBoxNoAdjustment(pBoxNo);
  async invValidateBoxNoAdjustment(CompCode, pBoxNo): Promise<any> {
    try {
      // console.log("before call", pCompCode, pBranchCode, pItemCode);
      let query = `CALL spValidateBoxNoAdjustment(?,?)`;
      const res = await this.conn.query(query, [CompCode, pBoxNo]);
      // console.log("after call", res);
      return {
        message: "successful",
        data: res,
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getInvoiceTranData(CompCode, pInvoiceId): Promise<any> {
    try {
      // console.log("before call", pCompCode, pBranchCode, pItemCode);
      let query = `CALL spGetDataInvoiceTranForEdit(?,?)`;
      const res = await this.conn.query(query, [CompCode, pInvoiceId]);
      // console.log("after call", res);
      return {
        message: "successful",
        data: res,
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //spValidateSalesVoucher
  async validateSalesVoucher(
    CompCode,
    Branch,
    Depart,
    VoucherNo
  ): Promise<any> {
    try {
      console.log("before call", CompCode, Branch, Depart, VoucherNo);
      let query = `CALL spValidateSalesVoucher(?,?,?,?)`;
      const res = await this.conn.query(query, [
        CompCode,
        Branch,
        Depart,
        VoucherNo,
      ]);
      // console.log("after call", res[0]);
      return {
        message: "successful",
        data: res[0],
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  // spInvGetSalesVoucherData
  async invGetSalesVoucherData(CompCode, VoucherId): Promise<any> {
    try {
      console.log("before call", CompCode, VoucherId);
      let query = `CALL spInvGetSalesVoucherData(?,?)`;
      const res = await this.conn.query(query, [CompCode, VoucherId]);
      // console.log("after call", res[0]);
      return {
        message: "successful",
        data: res[0],
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  // invSaveSaleOrderInvoice
  async invSaveSaleOrderInvoice(data): Promise<any> {
    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let resData;
    try {
      // console.log(data);
      let l_VoucherNo;
      if (
        _.includes([undefined, null, ""], data.SaleOrderInvoiceHdr.VoucherNo)
      ) {
        const seqData = {
          CompCode: data.CompCode,
          TranType: "SALEORDER",
          updt_usr: data.SaleOrderInvoiceHdr.UpdtUsr,
        };
        let TranNextTranNo = await this.sequenceConfig.getSequenceNextVal(
          seqData
        );
        l_VoucherNo = TranNextTranNo.data[0].NextVal;
      } else {
        l_VoucherNo = data.SaleOrderInvoiceHdr.VoucherNo;
      }

      let l_hdrRes = await queryRunner
        .query(
          "CALL spInvInsertInvStockSalesOrderHdr(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [
            data.SaleOrderInvoiceHdr.VoucherDate,
            l_VoucherNo,
            data.SaleOrderInvoiceHdr.CompCode,
            data.SaleOrderInvoiceHdr.BranchCode,
            data.SaleOrderInvoiceHdr.DeptCode,
            data.SaleOrderInvoiceHdr.TaxType,
            data.SaleOrderInvoiceHdr.CustId,
            data.SaleOrderInvoiceHdr.SaleType,
            data.SaleOrderInvoiceHdr.CustName,
            data.SaleOrderInvoiceHdr.CustMobile,
            data.SaleOrderInvoiceHdr.CustBillingAddress,
            data.SaleOrderInvoiceHdr.CustDeliveryAddress,
            data.SaleOrderInvoiceHdr.CreditDays,
            data.SaleOrderInvoiceHdr.SysOption1,
            data.SaleOrderInvoiceHdr.SysOption2,
            data.SaleOrderInvoiceHdr.SysOption3,
            data.SaleOrderInvoiceHdr.SysOption4,
            data.SaleOrderInvoiceHdr.SysOption5,
            data.SaleOrderInvoiceHdr.SysOption6,
            data.SaleOrderInvoiceHdr.SysOption7,
            data.SaleOrderInvoiceHdr.SysOption8,
            data.SaleOrderInvoiceHdr.SysOption9,
            data.SaleOrderInvoiceHdr.SysOption10,
            data.SaleOrderInvoiceHdr.GrossAmount,
            data.SaleOrderInvoiceHdr.DiscAmount,
            data.SaleOrderInvoiceHdr.SchemeDiscAmount,
            data.SaleOrderInvoiceHdr.TaxAmount,
            data.SaleOrderInvoiceHdr.MiscAmount,
            data.SaleOrderInvoiceHdr.RoundOff,
            data.SaleOrderInvoiceHdr.NetAmount,
            data.SaleOrderInvoiceHdr.SettlementAmount,
            data.SaleOrderInvoiceHdr.UpdtUsr,
          ]
        )
        .catch(async (err) => {
          throw new InternalServerErrorException(err);
        });

      let l_VoucherId = l_hdrRes[0][0].VoucherId;

      let i = 0;
      for (i; i < data.SaleOrderInvoiceDtl.length; i++) {
        await queryRunner
          .query(
            "CALL spInvInsertStockSalesOrderDtl(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              data.SaleOrderInvoiceHdr.CompCode,
              l_VoucherId,
              data.SaleOrderInvoiceDtl[i].SrNo,
              data.SaleOrderInvoiceDtl[i].ItemCode,
              data.SaleOrderInvoiceDtl[i].ScannedBarcode,
              data.SaleOrderInvoiceDtl[i].InwardSeq,
              data.SaleOrderInvoiceDtl[i].BatchNo,
              data.SaleOrderInvoiceDtl[i].ExpiryDate,
              data.SaleOrderInvoiceDtl[i].SaleQty,
              data.SaleOrderInvoiceDtl[i].CostPrice,
              data.SaleOrderInvoiceDtl[i].SalePrice,
              data.SaleOrderInvoiceDtl[i].LSalePrice,
              data.SaleOrderInvoiceDtl[i].MRP,
              data.SaleOrderInvoiceDtl[i].DiscPer,
              data.SaleOrderInvoiceDtl[i].DiscAmount,
              data.SaleOrderInvoiceDtl[i].SchemeDiscAmount,
              data.SaleOrderInvoiceDtl[i].SchemeCode,
              data.SaleOrderInvoiceDtl[i].TaxCode,
              data.SaleOrderInvoiceDtl[i].TaxPerc,
              data.SaleOrderInvoiceDtl[i].TaxAmount,
              data.SaleOrderInvoiceDtl[i].ItemTotal,
              data.SaleOrderInvoiceDtl[i].Amount,
              data.SaleOrderInvoiceDtl[i].SysOption1,
              data.SaleOrderInvoiceDtl[i].SysOption2,
              data.SaleOrderInvoiceDtl[i].SysOption3,
              data.SaleOrderInvoiceDtl[i].SysOption4,
              data.SaleOrderInvoiceDtl[i].SysOption5,
              data.SaleOrderInvoiceDtl[i].CGST,
              data.SaleOrderInvoiceDtl[i].SGST,
              data.SaleOrderInvoiceDtl[i].IGST,
              data.SaleOrderInvoiceDtl[i].UTGST,
              data.SaleOrderInvoiceDtl[i].Surcharge,
              data.SaleOrderInvoiceDtl[i].Cess,
              data.SaleOrderInvoiceDtl[i].UpdtUsr,
            ]
          )
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });
      }

      // console.log(data.AddIncomeExpensesDtl);
      i = 0;
      for (i; i < data.AddIncomeExpensesDtl.length; i++) {
        await queryRunner
          .query(
            "CALL spINVInsertInvStockTranIncExps(?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              data.SaleOrderInvoiceHdr.CompCode,
              "SALEORDER",
              l_VoucherId,
              data.AddIncomeExpensesDtl[i].SrNo,
              data.AddIncomeExpensesDtl[i].IEType,
              data.AddIncomeExpensesDtl[i].Particular,
              data.AddIncomeExpensesDtl[i].Amount *
                (data.AddIncomeExpensesDtl[i].IEType === "E" ? -1 : 1),
              data.AddIncomeExpensesDtl[i].SysOption1,
              data.AddIncomeExpensesDtl[i].SysOption2,
              data.AddIncomeExpensesDtl[i].SysOption3,
              data.AddIncomeExpensesDtl[i].SysOption4,
              data.AddIncomeExpensesDtl[i].SysOption5,
              data.SaleOrderInvoiceHdr.UpdtUsr,
            ]
          )
          .catch(async (err) => {
            throw new InternalServerErrorException(err);
          });
      }
      await queryRunner.commitTransaction();
      return {
        message: "successful",
        data: {
          VoucherId: l_VoucherId,
          VoucherNo: l_VoucherNo,
          VoucherDate: data.SaleOrderInvoiceHdr.VoucherDate,
        },
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  // spInvGetDataItemRates
  async invGetDataItemRates(CompCode, BranchCode, ItemCode): Promise<any> {
    try {
      // console.log("before call", CompCode, BranchCode, ItemCode);
      let query = `CALL spInvGetDataItemRates(?,?,?)`;
      const res = await this.conn.query(query, [
        CompCode,
        BranchCode,
        ItemCode === "null" ? null : ItemCode,
      ]);
      // console.log("after call", res[0]);
      return {
        message: "successful",
        data: res[0],
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async invDeleteSalesInvoice(CompCode, pVoucherId, pUpdtUsr): Promise<any> {
    let result = await this.conn.query("CALL spINVGetDataDeleteSales(?,?)", [
      CompCode,
      pVoucherId,
    ]);

    const queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let hdr = result[0][0];
      let dtl = result[1];

      //Prev Dtl data
      let i = 0;
      for (i; i < dtl.length; i++) {
        await queryRunner
          .query("CALL spINVDeleteSalesDtl(?,?,?,?,?,?,?,?,?,?)", [
            dtl[i].Id,
            hdr.CompCode,
            hdr.BranchCode,
            hdr.DeptCode,
            dtl[i].ItemCode,
            pVoucherId,
            dtl[i].InwardSeq,
            dtl[i].SaleQty,
            dtl[i].Amount,
            pUpdtUsr,
          ])
          .catch(async (err) => {
            console.log(err);
            throw new InternalServerErrorException(err);
          });
      }

      //Delete From Header
      await queryRunner
        .query("CALL spINVDeleteSaleHDR(?,?)", [hdr.CompCode, pVoucherId])
        .catch(async (err) => {
          console.log(err);
          throw new InternalServerErrorException(err);
        });

      await queryRunner.commitTransaction();
      return { message: "successful", hdr, dtl };
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
