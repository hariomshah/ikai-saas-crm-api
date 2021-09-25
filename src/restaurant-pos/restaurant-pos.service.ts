import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection, SimpleConsoleLogger } from "typeorm";
import _ = require("lodash");
import { async } from "rxjs/internal/scheduler/async";
import moment = require("moment");

@Injectable()
export class RestaurantPosService {
  private logger = new Logger("RestaurantPosService");
  constructor(private readonly conn: Connection) { }

  async getRestaurantTablesList(pCompCode, pBranchCode): Promise<any> {
    try {
      let query = `CALL spGetDataRestaurantTableList (?,?)`;
      const res = await this.conn.query(query, [pCompCode, pBranchCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getPOSRestaurantMenuRates(CompCode): Promise<any> {
    try {
      let query = `CALL spPOSRestaurantMenuRates (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getPOSRestaurantUserFavoriteMenus(pCompCode, pUserType, pUserId): Promise<any> {
    try {
      let query = `CALL spPOSRestaurantUserFavoriteMenus (?,?,?)`;
      const res = await this.conn.query(query, [pCompCode, pUserType, pUserId]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getPOSRestaurantMenuAddOnDtl(CompCode): Promise<any> {
    try {
      let query = `CALL spPOSRestaurantMenuAddOnDtl (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getPOSRestaurantMenuAddOns(CompCode): Promise<any> {
    try {
      let query = `CALL spPOSRestaurantMenuAddOns (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getPOSRestaurantMenuVariationRates(CompCode): Promise<any> {
    try {
      let query = `CALL spPOSRestaurantMenuVariationRates (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getPOSRestaurantTableStatus(CompCode): Promise<any> {
    try {
      let query = `call spPOSRestaurantTableStatus(?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //updateKOTAddInfo
  async updateKOTAddInfo(data): Promise<any> {
    try {
      let query = `call spUpdtKOTAddInfo(?,?,?,?,?,?,?,?)`;
      const res = await this.conn.query(query, [
        data.CompCode,
        data.KOTId,
        data.SysOption1,
        data.SysOption2,
        data.SysOption3,
        data.SysOption4,
        data.SysOption5,
        data.UpdtUsr,
      ]).then(er=>{
      });
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //insUpdtKOT
  async saveKOT(data): Promise<any> {
    try {
      let l_KOTId;
      let query = `call spInsUpdtPOS_KOT_HDR(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      await this.conn
        .query(query, [
          data.KOTHDR.InsUpdtType,
          data.KOTHDR.KOTId,
          data.CompCode,
          data.KOTHDR.BranchCode,
          data.KOTHDR.DeptCode,
          data.KOTHDR.KOT_No,
          data.KOTHDR.KOT_Date,
          data.KOTHDR.TableNo,
          data.KOTHDR.SysOption1,
          data.KOTHDR.SysOption2,
          data.KOTHDR.SysOption3,
          data.KOTHDR.SysOption4,
          data.KOTHDR.SysOption5,
          data.KOTHDR.KOT_Status,
          data.KOTHDR.KOT_Remark,
          data.KOTHDR.OrderType,
          data.KOTHDR.UpdtUsr,
        ])
        .then((res) => {
          l_KOTId = res[0][0].KOTId;

          data.KOTDTL.forEach((row) => {
            let queryDtl = `call spInsUpdtPOS_KOT_DTL(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
          
            this.conn
              .query(queryDtl, [
                data.CompCode,
                row.InsUpdtType,
                row.Id,
                l_KOTId,
                row.SrNo,
                row.MenuCode,
                row.MenuName,
                row.MenuDisplayName,
                row.MenuDisplayDesc,
                row.VAR_Code,
                row.VAR_Name,
                row.VAR_Rate,
                row.MenuBaseRate,
                row.MenuSumRate,
                row.Qty,
                row.Amount,
                row.CookingRemark,
                row.UpdtUsr,
              ])
              .then((dtlRes) => {
                let l_KOTDTLId = dtlRes[0][0].KOTDTLId;
                // console.log(row.AddOns, "row.AddOns")
                row.AddOns &&
                  row.AddOns.forEach((addOns) => {
                    let queryAddOn = `call spInsPOS_KOT_DTL_ADDONS(?,?,?,?,?,?,?,?,?,?)`;
                    this.conn.query(queryAddOn, [
                      row.CompCode,
                      l_KOTDTLId,
                      l_KOTId,
                      row.SrNo,
                      row.MenuCode,
                      addOns.AddOnCode,
                      addOns.Id,
                      addOns.ItemName,
                      addOns.Rate,
                      row.UpdtUsr,
                    ]);
                  });
              });
          });
        }).catch(err => {
          console.log(err)
        });
      return { message: "successful", data: { KOTId: l_KOTId } };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async saveTableStatus(data): Promise<any> {
    try {
      let query = `call spInsUpdtPOS_CURR_TBL_STS (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      const res = await this.conn.query(query, [
        data.CompCode,
        data.BranchCode,
        data.DeptCode,
        data.TableType,
        data.TableSec,
        data.TableCode,
        data.TableName,
        data.ParentTableCodes,
        data.SysOption1,
        data.SysOption2,
        data.SysOption3,
        data.SysOption4,
        data.SysOption5,
        data.Status,
        data.Remark,
        data.IsActive,
        data.UpdtUsr,
      ]).catch(err => {
        console.log(err,"in query")
      });
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error,"in service");

      throw new InternalServerErrorException();
    }
  }

  async getTableInfoAndKOTs(CompCode, TableNo): Promise<any> {
    try {
      let query = `call spGetTableInfoAndKOTs (?,?)`;
      const res = await this.conn.query(query, [CompCode, TableNo]);
      // console.log("spGetTableInfoAndKOTs", res);
      return { message: "successful", data: res };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getPOSCaptain(CompCode): Promise<any> {
    try {
      let query = `CALL spGetCaptianList (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async GetPrepareInvoiceDataRestaurant(
    pCompCode,
    pBranchCode,
    pDepartmentCode,
    pKeyValue1,
    pKeyValue2,
    pKeyValue3,
    pKeyValue4,
    pKeyValue5
  ): Promise<any> {
    try {
      let query = `call spGetDataPrepareRestaurantInvoice (?,?,?,?,?,?,?,?)`;
      const res = await this.conn.query(query, [
        pCompCode,
        pBranchCode,
        pDepartmentCode,
        pKeyValue1 === "null" ? null : pKeyValue1,
        pKeyValue2 === "null" ? null : pKeyValue2,
        pKeyValue3 === "null" ? null : pKeyValue3,
        pKeyValue4 === "null" ? null : pKeyValue4,
        pKeyValue5 === "null" ? null : pKeyValue5,
      ]);
      // console.log(res, "response");
      return {
        message: "successful",
        data: { KOTs: res[0], KOTDTLs: res[1], InvoiceConfigs: res[2] },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async updtPOSKOTInvoiceInfo(data): Promise<any> {
    try {
      let query = `call spUpdtPOSKOTInvoiceInfo (?,?,?,?,?,?)`;
      // console.log(data, "in data");
      const res = await this.conn.query(query, [
        data.CompCode,
        data.pKOIId,
        data.pInvoiceId,
        data.pInvoiceNo,
        data.pInvoiceDate,
        data.pUpdtUsr,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
    }
  }
  async getDataRestaurantPOSViewKOT(CompCode, BranchCode): Promise<any> {
    // console.log(CompCode, BranchCode);
    try {
      let query = `call spGetDataRestaurantPOSViewKOT (?,?)`;
      const res = await this.conn.query(query, [
        CompCode === "null" ? null : CompCode,
        BranchCode === "null" ? null : BranchCode,
      ]);
      // console.log("spGetViewKOTHdrData", res[0]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  async getDataRestaurantPOSViewKOTDtl(CompCode, KOTId): Promise<any> {
    try {
      let query = `call spGetDataRestaurantPOSViewKOTDtl (?,?)`;
      const res = await this.conn.query(query, [CompCode, KOTId]);
      // console.log("spGetTableInfoAndKOTs", res);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getDataRestaurantPOSDeliveryPickupView(
    CompCode,
    BranchCode
  ): Promise<any> {
    try {
      let query = `call spGetDataRestaurantPOSDeliveryPickupView (?,?)`;
      const res = await this.conn.query(query, [CompCode, BranchCode]);
      // console.log("spGetTableInfoAndKOTs", res);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async updtKOTStatus(data): Promise<any> {
    try {
      let query = `call spUpdtKOTStatus (?,?,?,?,?)`;
      const res = await this.conn.query(query, [
        data.CompCode,
        data.KOTId,
        data.KOTStatus,
        data.KOTRemark,
        data.UpdtUsr,
      ]);
      // console.log("spGetTableInfoAndKOTs", res);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  async getInvoiceHdr(CompCode, InvoiceId): Promise<any> {
    // console.log(InvoiceId);
    try {
      let query = `call spGetInvoiceHdr (?,?)`;
      const res = await this.conn.query(query, [CompCode, InvoiceId]);
      // console.log("spGetViewKOTHdrData", res[0]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async uptRestarantPosKOTHdrStatus(CompCode, KOTId, KOTStatus, UpdtUsr): Promise<any> {
    try {
      let query = `call spUptRestarantPosKOTHdrStatus (?,?,?,?)`;
      const res = await this.conn.query(query, [CompCode, KOTId, KOTStatus, UpdtUsr]);
      // console.log("spGetTableInfoAndKOTs", res);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async uptRestarantPosKOTdtlStatus(CompCode, KOTId, KOTStatus, UpdtUsr): Promise<any> {
    try {
      let query = `call spUptRestarantPosKOTDtlStatus (?,?,?,?)`;
      const res = await this.conn.query(query, [CompCode, KOTId, KOTStatus, UpdtUsr]);
      // console.log("spGetTableInfoAndKOTs", res);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async updtKOTViewTableStatus(data): Promise<any> {
    try {
      // console.log(data);
      let query = `call spUpdtKOTViewTableStatus (?,?,?,?,?,?)`;
      const res = await this.conn.query(query, [
        data.CompCode,
        data.BranchCode,
        data.DeptCode,
        data.TableCode,
        data.Status,
        data.UpdtUsr,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async restaurantPosProcessSpltTable(data): Promise<any> {
    try {
      // console.log(data);
      let query = `call spRestaurantPosProcessSpltTable (?,?,?,?,?,?,?)`;
      const res = await this.conn.query(query, [
        data.CompCode,
        data.BranchCode,
        data.DeptCode,
        data.TableSec,
        data.TableCode,
        data.TableName,
        data.UpdtUsr,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async restaurantPOSTableMergeOpration(data): Promise<any> {
    try {
      // console.log(data);
      let query = `call spRestaurantPOSTableMergeOpration (?,?,?,?,?,?,?)`;
      const res = await this.conn.query(query, [
        data.CompCode,
        data.BranchCode,
        data.DeptCode,
        data.TableSec,
        data.TableCodes,
        data.MergeTableName,
        data.UpdtUsr,
      ]).catch(async (err) => {
        throw new InternalServerErrorException(err);
      });;
      // console.log("spRestaurantPOSTableMergeOpration", res[0]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async saveMergeTable(data): Promise<any> {
    try {
      let query = `call spRestaurantDltMrgTempTbl (?,?,?,?,?)`;
      let res2;
      const res = await this.conn.query(query, [
        data.CompCode,
        data.BranchCode,
        data.DeptCode,
        data.TableCode,
        data.UpdtUsr,
      ]);
      return { message: "successful", data: [res[0], res2] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async saveSpltTable(data): Promise<any> {
    try {
      let query = `call spRestaurantDltSpltTempTbl (?,?,?,?,?)`;
      let res2;
      const res = await this.conn.query(query, [
        data.CompCode,
        data.BranchCode,
        data.DeptCode,
        data.TableCode,
        data.UpdtUsr,
      ]);
      return { message: "successful", data: [res[0], res2] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getRestaurantInvoiceDtl(CompCode, InvoiceId): Promise<any> {
    // console.log(InvoiceId);
    try {
      let query = `call spGetRestaurantInvoiceDtl (?,?)`;
      const res = await this.conn.query(query, [CompCode, InvoiceId]);
      // console.log("spGetViewKOTHdrData", res[0]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  // async restaurantUptInvoiceHdr(data): Promise<any> {
  //   try {
  //     let query = `call spRestaurantUptInvoiceHdr (?,?,?,?,?,?,?)`;
  //     // console.log(data, "in data");
  //     const res = await this.conn.query(query, [
  //       data.GrossAmount,
  //       data.DiscAmount,
  //       data.TaxAmount,
  //       data.RoundOff,
  //       data.InvoiceAmount,
  //       data.InvoiceId,
  //       data.pUpdtUsr,
  //     ]);
  //     return { message: "successful", data: res[0] };
  //   } catch (error) {
  //     this.logger.error(error);
  //   }
  // }

  async restaurantVoidBill(data): Promise<any> {
    let queryRunner = this.conn.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let res = [];
      // console.log(data, "COmpCOde")
      data.VoidItems.forEach(async (item, index) => {
        await queryRunner
          .query(
            "CALL spInsRestaurantVoidInvoiceDTL(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [
              data.CompCode,
              item.InvoiceId,
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
              item.SrNo,
              item.SysOption4,
              item.SysOption5,
              data.UpdtUsr,
            ]
          )
          .catch((err) => {
            console.log(err, "some rror received");
            queryRunner.rollbackTransaction();
            return false;
          });
      });

      let query = `call spRestaurantUptInvoiceHdr (?,?,?,?,?,?,?,?,?)`;
      await queryRunner.query(query, [
        data.CompCode,
        data.InvoiceHdr.GrossAmount,
        data.InvoiceHdr.DiscAmount,
        data.InvoiceHdr.TaxAmount,
        data.InvoiceHdr.RoundOff,
        data.InvoiceHdr.InvoiceAmount,
        data.InvoiceHdr.SettlementAmount,
        data.InvoiceHdr.InvoiceId,
        data.UpdtUsr,
      ]).catch((err) => {
        console.log(err, "some rror received");
        queryRunner.rollbackTransaction();
        return false;
      });;

      //refund etries
      // query = `call spRestaurantUptInvoiceHdr (?,?,?,?,?,?,?)`;
      // await this.conn.query(query, [
      //   data.InvoiceHdr.GrossAmount,
      //   data.InvoiceHdr.DiscAmount,
      //   data.InvoiceHdr.TaxAmount,
      //   data.InvoiceHdr.RoundOff,
      //   data.InvoiceHdr.InvoiceAmount,
      //   data.InvoiceHdr.InvoiceId,
      //   data.InvoiceHdr.pUpdtUsr,
      // ]);
      queryRunner.commitTransaction();
      return { message: "successful" };
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
  async updtKOTItemStatus(data): Promise<any> {
    try {
      let query = `call spUpdateKOTItemStatus (?,?,?,?,?)`;
      const res = await this.conn.query(query, [
        data.CompCode,
        data.ItemId,
        data.KOTId,
        data.ItemStatus,
        data.UpdtUsr,
      ]);

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async updtRestaurantKOTStatus(data): Promise<any> {
    try {
      let query = `call spUpdateRestaurantPOSKOTStatus (?,?,?)`;
      const res = await this.conn.query(query, [data.CompCode, data.KOTId, data.UpdtUsr]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async updtRestaurantPOSKOTDtlStatus(data): Promise<any> {
    try {
      let res = [];
      // console.log(data, "dtl data")
      data.forEach(async (element) => {
        let query = `call spUpdtRestaurantPOSKOTDtlStatus (?,?,?,?,?)`;
        // console.log(
        //   element.Id,
        //   element.KOTId,
        //   element.ItemStatus,
        //   element.UpdtUsr,
        //   "element"
        // );
        await res.push(
          await this.conn.query(query, [
            element.CompCode,
            element.Id,
            element.KOTId,
            element.ItemStatus,
            element.UpdtUsr,
          ]).catch(er => {
            this.logger.error(er, 'updtRestaurantPOSKOTDtlStatus')
          })
        );
      });

      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getDataRestaurantPOS_ResentKOTs(
    CompCode,
    BranchCode,
    CurrentUserName
  ): Promise<any> {
    // console.log(CompCode, BranchCode, CurrentUserName);
    try {
      let query = `call spGetDataRestaurantPOS_ResentKOTs (?,?,?)`;
      const res = await this.conn.query(query, [
        CompCode,
        BranchCode,
        CurrentUserName,
      ]);
      // console.log("spGetViewKOTHdrData", res[0]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getDataRestaurantPOS_ResentBills(
    CompCode,
    BranchCode,
    CurrentUserName
  ): Promise<any> {
    // console.log(InvoiceId);
    try {
      let query = `call spGetDataRestaurantPOS_ResentBills (?,?,?)`;
      const res = await this.conn.query(query, [
        CompCode,
        BranchCode,
        CurrentUserName,
      ]);
      // console.log("spGetViewKOTHdrData", res[0]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
  async getConfig(): Promise<any> {
    try {
      let query = `CALL spGetConfig ()`;
      const res = await this.conn.query(query, []);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async fetchSelfOrderKOTData(CompCode, BranchCode): Promise<any> {
    try {
      let query = `CALL spGetDataRestaurantPOSSelfOrder (?,?)`;
      const res = await this.conn.query(query, [CompCode, BranchCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  async uptRestaurantKOTHdrTableNo(data): Promise<any> {
    try {
      let query = `call spUptRestaurantKOTHdrTableNo (?,?,?,?)`;
      // console.log(data, "in data");
      const res = await this.conn.query(query, [
        data.CompCode,
        data.KOIId,
        data.TableNo,
        data.UpdtUsr,
      ]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
    }
  }
}
