import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from "@nestjs/common";
import { Connection } from "typeorm";
import { resolve } from "dns";
import moment = require("moment");
import { replace } from "lodash";
import { HtmlReportsService } from "./html-reports.service";
import { v1_0_1 } from "src/task-notifications/versions/v1.0.1";
import { retry } from "rxjs/operators";

const _ = require("lodash");

@Injectable()
export class HtmlInventoryReportsService {
  private logger = new Logger("HtmlInventoryReportsService");

  constructor(
    private readonly conn: Connection,
    private mainReport: HtmlReportsService
  ) {}

  //getDataInvRPTTopNSalesAnalysis
  //20210217 Hari/Govind/Saurav
  async getDataInvRPTTopNSalesAnalysis(
    pReportId,
    pCompCode,
    pBranchCode,
    pFromDate,
    pToDate,
    pAnalysis_On_QtyOrAmt,
    pTopNRecords,
    pAnalysis_Type
  ): Promise<any> {
    const ReportId = pReportId;

    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let RptSummary;
      let RptDtl = [];
      let RptChartData = [];

      const ReportConfig = await this.mainReport.getReportInfo(
        ReportId,
        pCompCode
      );
      //prepare data && fetch data from dynamic stored procedure
      if (ReportConfig.ReportHdr.ReportSource) {
        query = ReportConfig.ReportHdr.ReportSource;
        dynamicRes = await this.conn.query(query, [
          pCompCode,
          pBranchCode,
          pFromDate,
          pToDate,
          pAnalysis_On_QtyOrAmt,
          pTopNRecords,
          pAnalysis_Type,
        ]);
        if (dynamicRes[0].length > 0) {
          //set PurchaseHdr

          let tempTotal = 0;
          dynamicRes[0].forEach(async (row, idx) => {
            tempTotal += parseFloat(row.Val);
          });

          let l_Count = 0,
            l_SumAmount = 0,
            l_SumQty = 0;

          RptChartData.push([
            pAnalysis_Type === "ITEM"
              ? "Item"
              : pAnalysis_Type === "SUBCAT"
              ? "Sub Category"
              : pAnalysis_Type === "CAT"
              ? "Category"
              : pAnalysis_Type === "BRAND"
              ? "Brand"
              : pAnalysis_Type === "MFR"
              ? "Manufacturer"
              : pAnalysis_Type === "CLASS"
              ? "Class"
              : "",
            "Value",
          ]);
          dynamicRes[0].forEach(async (row, idx) => {
            RptDtl.push({
              Rank: idx + 1,
              Code: row.ICode,
              Name: row.IName,
              AddInfo: row.IAddInfo,
              Amount: parseFloat(row.Amount).toFixed(2),
              Qty: parseFloat(row.Qty).toFixed(2),
              Val: parseFloat(row.Val),
              PercOfTotal: ((parseFloat(row.Val) / tempTotal) * 100).toFixed(2),
            });

            RptChartData.push([row.IName, parseFloat(row.Val)]);

            l_Count += 1;
            l_SumAmount += parseFloat(row.Amount);
            l_SumQty += parseFloat(row.Qty);
          });

          RptSummary = {
            ReportTitle:
              "Top N Sales Analysis (" +
              (pAnalysis_Type === "ITEM"
                ? "Item Wise"
                : pAnalysis_Type === "SUBCAT"
                ? "Sub Category Wise"
                : pAnalysis_Type === "CAT"
                ? "Category Wise"
                : pAnalysis_Type === "BRAND"
                ? "Brand Wise"
                : pAnalysis_Type === "MFR"
                ? "Manufacturer Wise"
                : pAnalysis_Type === "CLASS"
                ? "Class Wise"
                : "") +
              ") [" +
              pTopNRecords +
              "]",
            ReportParam:
              "From Date : " +
              moment(pFromDate).format(ReportConfig.GeneralInfo.DateFormat) +
              " To: " +
              moment(pToDate).format(ReportConfig.GeneralInfo.DateFormat),
            TotalCount: l_Count,
            TotalAmount: l_SumAmount.toFixed(2),
            TotalQty: l_SumQty.toFixed(2),
          };
        } else {
          resposeMessage = "No data found!";
        }
      } else {
        resposeMessage = "Report config not defined!";
      }

      return {
        message: resposeMessage,
        ReportConfig,
        // data: { dynamicRes, RptHdr },
        RptChartData,
        data: { RptSummary, RptDtl },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //2021-03-13 govind
  async getDataINVGetDataRPT_StockSummary(
    pReportId,
    pCompCode,
    pBranchCode,
    pDeptCode,
    pFromDate,
    pToDate,
    pGroupOn,
    pShow_Qty_Amount_Both
  ): Promise<any> {
    const ReportId = pReportId;

    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let ReportSummary;
      let ReportGroup = [];

      const ReportConfig = await this.mainReport.getReportInfo(
        ReportId,
        pCompCode
      );
      // console.log("ss", ReportConfig);
      //prepare data && fetch data from dynamic stored procedure
      if (ReportConfig.ReportHdr.ReportSource) {
        query = ReportConfig.ReportHdr.ReportSource;
        dynamicRes = await this.conn.query(query, [
          pCompCode,
          pBranchCode,
          pDeptCode,
          pFromDate,
          pToDate,
          pGroupOn,
          pShow_Qty_Amount_Both,
        ]);
        // console.log(dynamicRes);
        if (dynamicRes[0].length > 0) {
          //Set ReportDtl
          dynamicRes[0].forEach(async (row, idx) => {
            // console.log(row);
            let l_Index = ReportGroup.findIndex(
              (oo) => oo.GroupName === row.GroupName
            );
            if (l_Index >= 0) {
              ReportGroup[l_Index].DetailRows.push({
                ...row,
                SrNo: ReportGroup[l_Index].DetailRows.length + 1,
              });
            } else {
              ReportGroup.push({
                GroupCode: row.GroupCode,
                GroupName: row.GroupName,
                DetailRows: [{ ...row, SrNo: 1 }],
              });
            }
          });

          let ii = 0;
          for (ii; ii < ReportGroup.length; ii++) {
            let lv_Sum_OpeningQty = 0;
            let lv_Sum_OpeningAmount = 0;
            let lv_Sum_PurchaseQty = 0;
            let lv_Sum_PurchaseAmount = 0;
            let lv_Sum_TransferInQty = 0;
            let lv_Sum_TransferInAmount = 0;
            let lv_Sum_SaleReturnQty = 0;
            let lv_Sum_SaleReturnAmount = 0;
            let lv_Sum_StockAdjPlusQty = 0;
            let lv_Sum_StockAdjPlusAmount = 0;
            let lv_Sum_SalesQty = 0;
            let lv_Sum_SalesAmount = 0;
            let lv_Sum_TransferOutQty = 0;
            let lv_Sum_TransferOutAmount = 0;
            let lv_Sum_PurchaseReturnQty = 0;
            let lv_Sum_PurchaseReturnAmount = 0;
            let lv_Sum_StockAdjMinusQty = 0;
            let lv_Sum_StockAdjMinusAmount = 0;
            let lv_Sum_ClosingQty = 0;
            let lv_Sum_ClosingAmount = 0;

            let iRow = 0;
            for (iRow; iRow < ReportGroup[ii].DetailRows.length; iRow++) {
              lv_Sum_OpeningQty += parseFloat(
                ReportGroup[ii].DetailRows[iRow].OpeningQty
              );
              lv_Sum_OpeningAmount += parseFloat(
                ReportGroup[ii].DetailRows[iRow].OpeningAmount
              );
              lv_Sum_PurchaseQty += parseFloat(
                ReportGroup[ii].DetailRows[iRow].PurchaseQty
              );
              lv_Sum_PurchaseAmount += parseFloat(
                ReportGroup[ii].DetailRows[iRow].PurchaseAmount
              );
              lv_Sum_TransferInQty += parseFloat(
                ReportGroup[ii].DetailRows[iRow].TransferInQty
              );
              lv_Sum_TransferInAmount += parseFloat(
                ReportGroup[ii].DetailRows[iRow].TransferInAmount
              );
              lv_Sum_SaleReturnQty += parseFloat(
                ReportGroup[ii].DetailRows[iRow].SaleReturnQty
              );
              lv_Sum_SaleReturnAmount += parseFloat(
                ReportGroup[ii].DetailRows[iRow].SaleReturnAmount
              );
              lv_Sum_StockAdjPlusQty += parseFloat(
                ReportGroup[ii].DetailRows[iRow].StockAdjPlusQty
              );
              lv_Sum_StockAdjPlusAmount += parseFloat(
                ReportGroup[ii].DetailRows[iRow].StockAdjPlusAmount
              );
              lv_Sum_SalesQty += parseFloat(
                ReportGroup[ii].DetailRows[iRow].SalesQty
              );
              lv_Sum_SalesAmount += parseFloat(
                ReportGroup[ii].DetailRows[iRow].SalesAmount
              );
              lv_Sum_TransferOutQty += parseFloat(
                ReportGroup[ii].DetailRows[iRow].TransferOutQty
              );
              lv_Sum_TransferOutAmount += parseFloat(
                ReportGroup[ii].DetailRows[iRow].TransferOutAmount
              );
              lv_Sum_PurchaseReturnQty += parseFloat(
                ReportGroup[ii].DetailRows[iRow].PurchaseReturnQty
              );
              lv_Sum_PurchaseReturnAmount += parseFloat(
                ReportGroup[ii].DetailRows[iRow].PurchaseReturnAmount
              );
              lv_Sum_StockAdjMinusQty += parseFloat(
                ReportGroup[ii].DetailRows[iRow].StockAdjMinusQty
              );
              lv_Sum_StockAdjMinusAmount += parseFloat(
                ReportGroup[ii].DetailRows[iRow].StockAdjMinusAmount
              );
              lv_Sum_ClosingQty += parseFloat(
                ReportGroup[ii].DetailRows[iRow].ClosingStockQty
              );
              lv_Sum_ClosingAmount += parseFloat(
                ReportGroup[ii].DetailRows[iRow].ClosingAmount
              );

              ReportGroup[ii].DetailRows[iRow] = {
                ...ReportGroup[ii].DetailRows[iRow],
                OpeningQty:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].OpeningQty) === 0
                    ? "-"
                    : parseFloat(ReportGroup[ii].DetailRows[iRow].OpeningQty),
                PurchaseQty:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].PurchaseQty) === 0
                    ? "-"
                    : parseFloat(ReportGroup[ii].DetailRows[iRow].PurchaseQty),
                TransferInQty:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].TransferInQty) ===
                  0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].TransferInQty
                      ),
                SaleReturnQty:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].SaleReturnQty) ===
                  0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].SaleReturnQty
                      ),
                StockAdjPlusQty:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].StockAdjPlusQty
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].StockAdjPlusQty
                      ),
                SalesQty:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].SalesQty) === 0
                    ? "-"
                    : parseFloat(ReportGroup[ii].DetailRows[iRow].SalesQty),
                TransferOutQty:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].TransferOutQty
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].TransferOutQty
                      ),
                PurchaseReturnQty:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].PurchaseReturnQty
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].PurchaseReturnQty
                      ),
                StockAdjMinusQty:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].StockAdjMinusQty
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].StockAdjMinusQty
                      ),
                ClosingStockQty:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].ClosingStockQty
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].ClosingStockQty
                      ),
                OpeningAmount:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].OpeningAmount) ===
                  0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].OpeningAmount
                      ).toFixed(2),
                PurchaseAmount:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].PurchaseAmount
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].PurchaseAmount
                      ).toFixed(2),
                TransferInAmount:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].TransferInAmount
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].TransferInAmount
                      ).toFixed(2),
                SaleReturnAmount:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].SaleReturnAmount
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].SaleReturnAmount
                      ).toFixed(2),
                StockAdjPlusAmount:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].StockAdjPlusAmount
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].StockAdjPlusAmount
                      ).toFixed(2),
                SalesAmount:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].SalesAmount) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].SalesAmount
                      ).toFixed(2),
                TransferOutAmount:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].TransferOutAmount
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].TransferOutAmount
                      ).toFixed(2),
                PurchaseReturnAmount:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].PurchaseReturnAmount
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].PurchaseReturnAmount
                      ).toFixed(2),
                StockAdjMinusAmount:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].StockAdjMinusAmount
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].StockAdjMinusAmount
                      ).toFixed(2),
                ClosingAmount:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].ClosingAmount) ===
                  0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].ClosingAmount
                      ).toFixed(2),
              };
            }

            ReportGroup[ii] = {
              ...ReportGroup[ii],
              Sum_OpeningQty: lv_Sum_OpeningQty === 0 ? "-" : lv_Sum_OpeningQty,
              Sum_OpeningAmount:
                lv_Sum_OpeningAmount === 0
                  ? "-"
                  : lv_Sum_OpeningAmount.toFixed(2),
              Sum_PurchaseQty:
                lv_Sum_PurchaseQty === 0 ? "-" : lv_Sum_PurchaseQty,
              Sum_PurchaseAmount:
                lv_Sum_PurchaseAmount === 0
                  ? "-"
                  : lv_Sum_PurchaseAmount.toFixed(2),
              Sum_TransferInQty:
                lv_Sum_TransferInQty === 0 ? "-" : lv_Sum_TransferInQty,
              Sum_TransferInAmount:
                lv_Sum_TransferInAmount === 0
                  ? "-"
                  : lv_Sum_TransferInAmount.toFixed(2),
              Sum_SaleReturnQty:
                lv_Sum_SaleReturnQty === 0 ? "-" : lv_Sum_SaleReturnQty,
              Sum_SaleReturnAmount:
                lv_Sum_SaleReturnAmount === 0
                  ? "-"
                  : lv_Sum_SaleReturnAmount.toFixed(2),
              Sum_StockAdjPlusQty:
                lv_Sum_StockAdjPlusQty === 0 ? "-" : lv_Sum_StockAdjPlusQty,
              Sum_StockAdjPlusAmount:
                lv_Sum_StockAdjPlusAmount === 0
                  ? "-"
                  : lv_Sum_StockAdjPlusAmount.toFixed(2),
              Sum_SalesQty: lv_Sum_SalesQty === 0 ? "-" : lv_Sum_SalesQty,
              Sum_SalesAmount:
                lv_Sum_SalesAmount === 0 ? "-" : lv_Sum_SalesAmount.toFixed(2),
              Sum_TransferOutQty:
                lv_Sum_TransferOutQty === 0 ? "-" : lv_Sum_TransferOutQty,
              Sum_TransferOutAmount:
                lv_Sum_TransferOutAmount === 0
                  ? "-"
                  : lv_Sum_TransferOutAmount.toFixed(2),
              Sum_PurchaseReturnQty:
                lv_Sum_PurchaseReturnQty === 0 ? "-" : lv_Sum_PurchaseReturnQty,
              Sum_PurchaseReturnAmount:
                lv_Sum_PurchaseReturnAmount === 0
                  ? "-"
                  : lv_Sum_PurchaseReturnAmount.toFixed(2),
              Sum_StockAdjMinusQty:
                lv_Sum_StockAdjMinusQty === 0 ? "-" : lv_Sum_StockAdjMinusQty,
              Sum_StockAdjMinusAmount:
                lv_Sum_StockAdjMinusAmount === 0
                  ? "-"
                  : lv_Sum_StockAdjMinusAmount.toFixed(2),
              Sum_ClosingQty: lv_Sum_ClosingQty === 0 ? "-" : lv_Sum_ClosingQty,
              Sum_ClosingAmount:
                lv_Sum_ClosingAmount === 0
                  ? "-"
                  : lv_Sum_ClosingAmount.toFixed(2),
            };

            var ReportHdr = {
              Hdr: "Stock Summmary",
              FromDate: moment(pFromDate, "YYYY-MM-DD").format(
                ReportConfig.GeneralInfo.DateFormat
              ),
              ToDate: moment(pToDate, "YYYY-MM-DD").format(
                ReportConfig.GeneralInfo.DateFormat
              ),
            };
          }
        } else {
          resposeMessage = "No data found!";
        }
      } else {
        resposeMessage = "Report config not defined!";
      }

      // console.log(ReportGroup, ReportHdr);
      return {
        message: resposeMessage,
        ReportConfig,
        data: { ReportGroup, ReportHdr },
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  //2021-03-15 saurav
  async getINVGetDataRPT_SalesAnalaysisDetail(
    pReportId,
    pCompCode,
    pBranchCode,
    pDeptCode,
    pFromDate,
    pToDate,
    pGroupOn
  ): Promise<any> {
    const ReportId = pReportId;

    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let ReportSummary;
      let ReportGroup = [];

      const ReportConfig = await this.mainReport.getReportInfo(
        ReportId,
        pCompCode
      );

      //prepare data && fetch data from dynamic stored procedure
      if (ReportConfig.ReportHdr.ReportSource) {
        query = ReportConfig.ReportHdr.ReportSource;
        dynamicRes = await this.conn.query(query, [
          pCompCode,
          pBranchCode,
          pDeptCode,
          pFromDate,
          pToDate,
          pGroupOn,
        ]);
        // console.log(dynamicRes[0]);
        if (dynamicRes[0].length > 0) {
          //Set ReportDtl
          dynamicRes[0].forEach(async (row, idx) => {
            // console.log(row);
            let l_Index = ReportGroup.findIndex(
              (oo) => oo.GroupName === row.GroupName
            );
            if (l_Index >= 0) {
              ReportGroup[l_Index].DetailRows.push({
                ...row,
                SrNo: ReportGroup[l_Index].DetailRows.length + 1,
              });
            } else {
              ReportGroup.push({
                GroupCode: row.GroupCode,
                GroupName: row.GroupName,
                DetailRows: [{ ...row, SrNo: 1 }],
              });
            }
          });

          let ii = 0;
          for (ii; ii < ReportGroup.length; ii++) {
            let lv_Sum_SaleQty = 0;
            let lv_Sum_SaleValue = 0;
            let lv_Sum_CostValue = 0;
            let lv_Sum_Diff = 0;
            let lv_Sum_Margin = 0;

            let iRow = 0;
            for (iRow; iRow < ReportGroup[ii].DetailRows.length; iRow++) {
              lv_Sum_SaleQty += parseFloat(
                ReportGroup[ii].DetailRows[iRow].SaleQty
              );
              lv_Sum_SaleValue += parseFloat(
                ReportGroup[ii].DetailRows[iRow].SaleValue
              );
              lv_Sum_CostValue += parseFloat(
                ReportGroup[ii].DetailRows[iRow].CostValue
              );

              lv_Sum_Diff += parseFloat(ReportGroup[ii].DetailRows[iRow].Diff);
              lv_Sum_Margin += ReportGroup[ii].DetailRows[iRow].Margin
                ? parseFloat(ReportGroup[ii].DetailRows[iRow].Margin)
                : 0;

              ReportGroup[ii].DetailRows[iRow] = {
                ...ReportGroup[ii].DetailRows[iRow],
                SrNo: ReportGroup[ii].DetailRows[iRow].SrNo,
                ItemCode: ReportGroup[ii].DetailRows[iRow].ItemCode,
                ItemName: ReportGroup[ii].DetailRows[iRow].ItemName,
                SaleQty:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].SaleQty) === 0
                    ? 0
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].SaleQty
                      ).toFixed(2),

                SaleValue:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].SaleValue) === 0
                    ? 0
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].SaleValue
                      ).toFixed(2),
                CostValue:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].CostValue) === 0
                    ? 0
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].CostValue
                      ).toFixed(2),

                Diff:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].Diff) === 0
                    ? 0
                    : parseFloat(ReportGroup[ii].DetailRows[iRow].Diff).toFixed(
                        2
                      ),
                Margin:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].Margin) === 0 ||
                  !ReportGroup[ii].DetailRows[iRow].Margin
                    ? 0
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].Margin
                      ).toFixed(2),
              };
            }

            ReportGroup[ii] = {
              ...ReportGroup[ii],
              Sum_SaleQty:
                lv_Sum_SaleQty === 0 ? "-" : lv_Sum_SaleQty.toFixed(2),
              Sum_SaleValue:
                lv_Sum_SaleValue === 0 ? "-" : lv_Sum_SaleValue.toFixed(2),
              Sum_CostValue:
                lv_Sum_CostValue === 0 ? "-" : lv_Sum_CostValue.toFixed(2),
              Sum_Diff: lv_Sum_Diff === 0 ? "-" : lv_Sum_Diff.toFixed(2),
              Sum_Margin:
                lv_Sum_Margin === 0 || !lv_Sum_Margin
                  ? "-"
                  : lv_Sum_Margin.toFixed(2),
            };

            var ReportHdr = {
              Hdr: "Sales Detail",
              FromDate: moment(pFromDate, "YYYY-MM-DD").format(
                ReportConfig.GeneralInfo.DateFormat
              ),
              ToDate: moment(pToDate, "YYYY-MM-DD").format(
                ReportConfig.GeneralInfo.DateFormat
              ),
            };
          }
        } else {
          resposeMessage = "No data found!";
        }
      } else {
        resposeMessage = "Report config not defined!";
      }

      // console.log(ReportGroup, ReportHdr);
      return {
        message: resposeMessage,
        ReportConfig,
        data: { ReportGroup, ReportHdr },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //2021-03-15 saurav
  async getINVGetDataRPT_SalesAnalaysisSummary(
    pReportId,
    pCompCode,
    pBranchCode,
    pDeptCode,
    pFromDate,
    pToDate,
    pSummaryType
  ): Promise<any> {
    const ReportId = pReportId;

    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let ReportSummary;
      let ReportGroup = [];

      const ReportConfig = await this.mainReport.getReportInfo(
        ReportId,
        pCompCode
      );
      // console.log("ss", ReportConfig);
      //prepare data && fetch data from dynamic stored procedure
      if (ReportConfig.ReportHdr.ReportSource) {
        query = ReportConfig.ReportHdr.ReportSource;
        dynamicRes = await this.conn.query(query, [
          pCompCode,
          pBranchCode,
          pDeptCode,
          pFromDate,
          pToDate,
          pSummaryType,
        ]);
        // console.log(dynamicRes);
        if (dynamicRes[0].length > 0) {
          //Set ReportDtl
          dynamicRes[0].forEach(async (row, idx) => {
            // console.log(row);
            let l_Index = ReportGroup.findIndex((oo) => true === true);
            if (l_Index >= 0) {
              ReportGroup[l_Index].DetailRows.push({
                ...row,
                SrNo: ReportGroup[l_Index].DetailRows.length + 1,
              });
            } else {
              ReportGroup.push({
                GroupCode: row.GroupCode,
                GroupName: row.GroupName,
                DetailRows: [{ ...row, SrNo: 1 }],
              });
            }
          });

          let ii = 0;
          for (ii; ii < ReportGroup.length; ii++) {
            let lv_Sum_SaleQty = 0;
            let lv_Sum_SaleValue = 0;
            let lv_Sum_CostValue = 0;
            let lv_Sum_Diff = 0;
            let lv_Sum_Margin = 0;

            let iRow = 0;
            for (iRow; iRow < ReportGroup[ii].DetailRows.length; iRow++) {
              lv_Sum_SaleQty += parseFloat(
                ReportGroup[ii].DetailRows[iRow].SaleQty
              );
              lv_Sum_SaleValue += parseFloat(
                ReportGroup[ii].DetailRows[iRow].SaleValue
              );
              lv_Sum_CostValue += parseFloat(
                ReportGroup[ii].DetailRows[iRow].CostValue
              );

              lv_Sum_Diff += parseFloat(ReportGroup[ii].DetailRows[iRow].Diff);
              lv_Sum_Margin += ReportGroup[ii].DetailRows[iRow].Margin
                ? parseFloat(ReportGroup[ii].DetailRows[iRow].Margin)
                : 0;

              ReportGroup[ii].DetailRows[iRow] = {
                ...ReportGroup[ii].DetailRows[iRow],
                GroupCode: ReportGroup[ii].DetailRows[iRow].GroupCode,
                GroupName: ReportGroup[ii].DetailRows[iRow].GroupName,
                SrNo: ReportGroup[ii].DetailRows[iRow].SrNo,
                ItemCode: ReportGroup[ii].DetailRows[iRow].ItemCode,
                ItemName: ReportGroup[ii].DetailRows[iRow].ItemName,
                SaleQty:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].SaleQty) === 0
                    ? "0"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].SaleQty
                      ).toFixed(2),

                SaleValue:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].SaleValue) === 0
                    ? "0"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].SaleValue
                      ).toFixed(2),
                CostValue:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].CostValue) === 0
                    ? "0"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].CostValue
                      ).toFixed(2),

                Diff:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].Diff) === 0
                    ? "0"
                    : parseFloat(ReportGroup[ii].DetailRows[iRow].Diff).toFixed(
                        2
                      ),
                Margin:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].Margin) === 0 ||
                  !ReportGroup[ii].DetailRows[iRow].Margin
                    ? "0"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].Margin
                      ).toFixed(2),
              };
            }

            ReportGroup[ii] = {
              ...ReportGroup[ii],
              Sum_SaleQty:
                lv_Sum_SaleQty === 0 ? "-" : lv_Sum_SaleQty.toFixed(2),
              Sum_SaleValue:
                lv_Sum_SaleValue === 0 ? "-" : lv_Sum_SaleValue.toFixed(2),
              Sum_CostValue:
                lv_Sum_CostValue === 0 ? "-" : lv_Sum_CostValue.toFixed(2),
              Sum_Diff: lv_Sum_Diff === 0 ? "-" : lv_Sum_Diff.toFixed(2),
              Sum_Margin:
                lv_Sum_Margin === 0 || !lv_Sum_Margin
                  ? "-"
                  : lv_Sum_Margin.toFixed(2),
            };

            var ReportHdr = {
              Hdr: "Sales Summmary",
              FromDate: moment(pFromDate, "YYYY-MM-DD").format(
                ReportConfig.GeneralInfo.DateFormat
              ),
              ToDate: moment(pToDate, "YYYY-MM-DD").format(
                ReportConfig.GeneralInfo.DateFormat
              ),
            };
          }
        } else {
          resposeMessage = "No data found!";
        }
      } else {
        resposeMessage = "Report config not defined!";
      }

      // console.log(ReportGroup, ReportHdr);
      return {
        message: resposeMessage,
        ReportConfig,
        data: { ReportGroup, ReportHdr },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //2021-03-16 saurav
  async getINVGetDataRPT_SalesComparisionDetail(
    pReportId,
    pCompCode,
    pBranchCode,
    pDeptCode,
    pComparisionType,
    pGroupOn
  ): Promise<any> {
    const ReportId = pReportId;

    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let ReportSummary;
      let ReportGroup = [];

      const ReportConfig = await this.mainReport.getReportInfo(
        ReportId,
        pCompCode
      );
      // console.log("ss", ReportConfig);
      //prepare data && fetch data from dynamic stored procedure
      if (ReportConfig.ReportHdr.ReportSource) {
        query = ReportConfig.ReportHdr.ReportSource;
        dynamicRes = await this.conn.query(query, [
          pCompCode,
          pBranchCode,
          pDeptCode,
          pComparisionType,
          pGroupOn,
        ]);
        // console.log(dynamicRes);
        if (dynamicRes[0].length > 0) {
          //Set ReportDtl
          dynamicRes[0].forEach(async (row, idx) => {
            // console.log(row);
            let l_Index = ReportGroup.findIndex(
              (oo) => oo.GroupName === row.GroupName
            );
            if (l_Index >= 0) {
              ReportGroup[l_Index].DetailRows.push({
                ...row,
                SrNo: ReportGroup[l_Index].DetailRows.length + 1,
              });
            } else {
              ReportGroup.push({
                GroupCode: row.GroupCode,
                GroupName: row.GroupName,
                DetailRows: [{ ...row, SrNo: 1 }],
              });
            }
          });

          let ii = 0;
          for (ii; ii < ReportGroup.length; ii++) {
            let lv_Sum_SaleQty_Curr = 0;
            let lv_Sum_SaleValue_Curr = 0;
            let lv_Sum_CostValue_Curr = 0;
            let lv_Sum_Diff_Curr = 0;
            let lv_Sum_Margin_Curr = 0;
            let lv_Sum_SaleQty_CurrMinus1 = 0;
            let lv_Sum_SaleValue_CurrMinus1 = 0;
            let lv_Sum_CostValue_CurrMinus1 = 0;
            let lv_Sum_Diff_CurrMinus1 = 0;
            let lv_Sum_Margin_CurrMinus1 = 0;
            let lv_Sum_SaleQty_CurrMinus2 = 0;
            let lv_Sum_SaleValue_CurrMinus2 = 0;
            let lv_Sum_CostValue_CurrMinus2 = 0;
            let lv_Sum_Diff_CurrMinus2 = 0;
            let lv_Sum_Margin_CurrMinus2 = 0;

            let iRow = 0;

            for (iRow; iRow < ReportGroup[ii].DetailRows.length; iRow++) {
              lv_Sum_SaleQty_Curr += parseFloat(
                ReportGroup[ii].DetailRows[iRow].SaleQty_Curr
              );
              lv_Sum_SaleValue_Curr += parseFloat(
                ReportGroup[ii].DetailRows[iRow].SaleValue_Curr
              );
              lv_Sum_CostValue_Curr += parseFloat(
                ReportGroup[ii].DetailRows[iRow].CostValue_Curr
              );

              lv_Sum_Diff_Curr += parseFloat(
                ReportGroup[ii].DetailRows[iRow].Diff_Curr
              );
              lv_Sum_Margin_Curr += ReportGroup[ii].DetailRows[iRow].Margin_Curr
                ? parseFloat(ReportGroup[ii].DetailRows[iRow].Margin_Curr)
                : 0;
              lv_Sum_SaleQty_CurrMinus1 += parseFloat(
                ReportGroup[ii].DetailRows[iRow].SaleQty_CurrMinus1
              );
              lv_Sum_SaleValue_CurrMinus1 += parseFloat(
                ReportGroup[ii].DetailRows[iRow].SaleValue_CurrMinus1
              );
              lv_Sum_CostValue_CurrMinus1 += parseFloat(
                ReportGroup[ii].DetailRows[iRow].CostValue_CurrMinus1
              );

              lv_Sum_Diff_CurrMinus1 += parseFloat(
                ReportGroup[ii].DetailRows[iRow].Diff_CurrMinus1
              );
              lv_Sum_Margin_CurrMinus1 += ReportGroup[ii].DetailRows[iRow]
                .Margin_CurrMinus1
                ? parseFloat(ReportGroup[ii].DetailRows[iRow].Margin_CurrMinus1)
                : 0;
              lv_Sum_SaleQty_CurrMinus2 += parseFloat(
                ReportGroup[ii].DetailRows[iRow].SaleQty_CurrMinus2
              );
              lv_Sum_SaleValue_CurrMinus2 += parseFloat(
                ReportGroup[ii].DetailRows[iRow].SaleValue_CurrMinus2
              );
              lv_Sum_CostValue_CurrMinus2 += parseFloat(
                ReportGroup[ii].DetailRows[iRow].CostValue_CurrMinus2
              );

              lv_Sum_Diff_CurrMinus2 += parseFloat(
                ReportGroup[ii].DetailRows[iRow].Diff_CurrMinus2
              );
              lv_Sum_Margin_CurrMinus2 += ReportGroup[ii].DetailRows[iRow]
                .Margin_CurrMinus2
                ? parseFloat(ReportGroup[ii].DetailRows[iRow].Margin_CurrMinus2)
                : 0;

              ReportGroup[ii].DetailRows[iRow] = {
                ...ReportGroup[ii].DetailRows[iRow],
                GroupCode: ReportGroup[ii].DetailRows[iRow].GroupCode,
                GroupName: ReportGroup[ii].DetailRows[iRow].GroupName,
                lv_DateFrom_Curr:
                  ReportGroup[ii].DetailRows[iRow].lv_DateFrom_Curr,
                lv_DateTo_Curr: ReportGroup[ii].DetailRows[iRow].lv_DateTo_Curr,
                SrNo: ReportGroup[ii].DetailRows[iRow].SrNo,
                ItemCode: ReportGroup[ii].DetailRows[iRow].ItemCode,
                ItemName: ReportGroup[ii].DetailRows[iRow].ItemName,
                SaleQty_Curr:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].SaleQty_Curr) ===
                  0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].SaleQty_Curr
                      ).toFixed(2),

                SaleValue_Curr:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].SaleValue_Curr
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].SaleValue_Curr
                      ).toFixed(2),
                CostValue_Curr:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].CostValue_Curr
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].CostValue_Curr
                      ).toFixed(2),

                Diff_Curr:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].Diff_Curr) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].Diff_Curr
                      ).toFixed(2),
                Margin_Curr:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].Margin_Curr) ===
                    0 || !ReportGroup[ii].DetailRows[iRow].Margin_Curr
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].Margin_Curr
                      ).toFixed(2),
                SaleQty_CurrMinus1:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].SaleQty_CurrMinus1
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].SaleQty_CurrMinus1
                      ).toFixed(2),

                SaleValue_CurrMinus1:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].SaleValue_CurrMinus1
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].SaleValue_CurrMinus1
                      ).toFixed(2),
                CostValue_CurrMinus1:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].CostValue_CurrMinus1
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].CostValue_CurrMinus1
                      ).toFixed(2),

                Diff_CurrMinus1:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].Diff_CurrMinus1
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].Diff_CurrMinus1
                      ).toFixed(2),
                Margin_CurrMinus1:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].Margin_CurrMinus1
                  ) === 0 || !ReportGroup[ii].DetailRows[iRow].Margin_CurrMinus1
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].Margin_CurrMinus1
                      ).toFixed(2),
                SaleQty_CurrMinus2:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].SaleQty_CurrMinus2
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].SaleQty_CurrMinus2
                      ).toFixed(2),

                SaleValue_CurrMinus2:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].SaleValue_CurrMinus2
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].SaleValue_CurrMinus2
                      ).toFixed(2),
                CostValue_CurrMinus2:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].CostValue_CurrMinus2
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].CostValue_CurrMinus2
                      ).toFixed(2),

                Diff_CurrMinus2:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].Diff_CurrMinus2
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].Diff_CurrMinus2
                      ).toFixed(2),
                Margin_CurrMinus2:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].Margin_CurrMinus2
                  ) === 0 || !ReportGroup[ii].DetailRows[iRow].Margin_CurrMinus2
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].Margin_CurrMinus2
                      ).toFixed(2),

                Margin_diff1:
                  Math.abs(ReportGroup[ii].DetailRows[iRow].Margin_CurrMinus1) >
                  Math.abs(ReportGroup[ii].DetailRows[iRow].Margin_CurrMinus2)
                    ? true
                    : false,
                Margin_diff:
                  Math.abs(ReportGroup[ii].DetailRows[iRow].Margin_Curr) >
                  Math.abs(ReportGroup[ii].DetailRows[iRow].Margin_CurrMinus1)
                    ? true
                    : false,
              };
            }

            ReportGroup[ii] = {
              ...ReportGroup[ii],
              Sum_SaleQty_Curr:
                lv_Sum_SaleQty_Curr === 0
                  ? "-"
                  : lv_Sum_SaleQty_Curr.toFixed(2),
              Sum_SaleValue_Curr:
                lv_Sum_SaleValue_Curr === 0
                  ? "-"
                  : lv_Sum_SaleValue_Curr.toFixed(2),
              Sum_CostValue_Curr:
                lv_Sum_CostValue_Curr === 0
                  ? "-"
                  : lv_Sum_CostValue_Curr.toFixed(2),
              Sum_Diff_Curr:
                lv_Sum_Diff_Curr === 0 ? "-" : lv_Sum_Diff_Curr.toFixed(2),
              Sum_Margin_Curr:
                lv_Sum_Margin_Curr === 0 || !lv_Sum_Margin_Curr
                  ? "-"
                  : lv_Sum_Margin_Curr.toFixed(2),
              Sum_SaleQty_CurrMinus1:
                lv_Sum_SaleQty_CurrMinus1 === 0
                  ? "-"
                  : lv_Sum_SaleQty_CurrMinus1.toFixed(2),
              Sum_SaleValue_CurrMinus1:
                lv_Sum_SaleValue_CurrMinus1 === 0
                  ? "-"
                  : lv_Sum_SaleValue_CurrMinus1.toFixed(2),
              Sum_CostValue_CurrMinus1:
                lv_Sum_CostValue_CurrMinus1 === 0
                  ? "-"
                  : lv_Sum_CostValue_CurrMinus1.toFixed(2),
              Sum_Diff_CurrMinus1:
                lv_Sum_Diff_CurrMinus1 === 0
                  ? "-"
                  : lv_Sum_Diff_CurrMinus1.toFixed(2),
              Sum_Margin_CurrMinus1:
                lv_Sum_Margin_CurrMinus1 === 0 || !lv_Sum_Margin_CurrMinus1
                  ? "-"
                  : lv_Sum_Margin_CurrMinus1.toFixed(2),
              Sum_SaleQty_CurrMinus2:
                lv_Sum_SaleQty_CurrMinus2 === 0
                  ? "-"
                  : lv_Sum_SaleQty_CurrMinus2.toFixed(2),
              Sum_SaleValue_CurrMinus2:
                lv_Sum_SaleValue_CurrMinus2 === 0
                  ? "-"
                  : lv_Sum_SaleValue_CurrMinus2.toFixed(2),
              Sum_CostValue_CurrMinus2:
                lv_Sum_CostValue_CurrMinus2 === 0
                  ? "-"
                  : lv_Sum_CostValue_CurrMinus2.toFixed(2),
              Sum_Diff_CurrMinus2:
                lv_Sum_Diff_CurrMinus2 === 0
                  ? "-"
                  : lv_Sum_Diff_CurrMinus2.toFixed(2),
              Sum_Margin_CurrMinus2:
                lv_Sum_Margin_CurrMinus2 === 0 || !lv_Sum_Margin_CurrMinus2
                  ? "-"
                  : lv_Sum_Margin_CurrMinus2.toFixed(2),
            };

            var ReportHdr = {
              Hdr: "Sales Comparision Detail",
              CurrCaption: dynamicRes[1][0].Curr_Caption,
              CurrMinus1Caption: dynamicRes[1][0].Curr_Minus1_Caption,
              CurrMinus2Caption: dynamicRes[1][0].Curr_Minus2_Caption,
            };
          }
        } else {
          resposeMessage = "No data found!";
        }
      } else {
        resposeMessage = "Report config not defined!";
      }

      // console.log(ReportGroup, ReportHdr);
      return {
        message: resposeMessage,
        ReportConfig,
        data: { ReportGroup, ReportHdr },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //2021-03-16 saurav
  async getINVGetDataRPT_SalesComparisionSummary(
    pReportId,
    pCompCode,
    pBranchCode,
    pDeptCode,
    pComparisionType,
    pSummaryType
  ): Promise<any> {
    const ReportId = pReportId;

    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let ReportSummary;
      let ReportGroup = [];

      const ReportConfig = await this.mainReport.getReportInfo(
        ReportId,
        pCompCode
      );
      // console.log("ss", ReportConfig);
      //prepare data && fetch data from dynamic stored procedure
      if (ReportConfig.ReportHdr.ReportSource) {
        query = ReportConfig.ReportHdr.ReportSource;
        dynamicRes = await this.conn.query(query, [
          pCompCode,
          pBranchCode,
          pDeptCode,
          pComparisionType,
          pSummaryType,
        ]);
        // console.log(dynamicRes);

        if (dynamicRes[0].length > 0) {
          //Set ReportDtl
          dynamicRes[0].forEach(async (row, idx) => {
            // console.log(row);
            let l_Index = ReportGroup.findIndex((oo) => true === true);
            if (l_Index >= 0) {
              ReportGroup[l_Index].DetailRows.push({
                ...row,
                SrNo: ReportGroup[l_Index].DetailRows.length + 1,
              });
            } else {
              ReportGroup.push({
                GroupCode: row.GroupCode,
                GroupName: row.GroupName,
                DetailRows: [{ ...row, SrNo: 1 }],
              });
            }
          });

          let ii = 0;
          for (ii; ii < ReportGroup.length; ii++) {
            let lv_Sum_SaleQty_Curr = 0;
            let lv_Sum_SaleValue_Curr = 0;
            let lv_Sum_CostValue_Curr = 0;
            let lv_Sum_Diff_Curr = 0;
            let lv_Sum_Margin_Curr = 0;
            let lv_Sum_SaleQty_CurrMinus1 = 0;
            let lv_Sum_SaleValue_CurrMinus1 = 0;
            let lv_Sum_CostValue_CurrMinus1 = 0;
            let lv_Sum_Diff_CurrMinus1 = 0;
            let lv_Sum_Margin_CurrMinus1 = 0;
            let lv_Sum_SaleQty_CurrMinus2 = 0;
            let lv_Sum_SaleValue_CurrMinus2 = 0;
            let lv_Sum_CostValue_CurrMinus2 = 0;
            let lv_Sum_Diff_CurrMinus2 = 0;
            let lv_Sum_Margin_CurrMinus2 = 0;

            let iRow = 0;

            for (iRow; iRow < ReportGroup[ii].DetailRows.length; iRow++) {
              lv_Sum_SaleQty_Curr += parseFloat(
                ReportGroup[ii].DetailRows[iRow].SaleQty_Curr
              );
              lv_Sum_SaleValue_Curr += parseFloat(
                ReportGroup[ii].DetailRows[iRow].SaleValue_Curr
              );
              lv_Sum_CostValue_Curr += parseFloat(
                ReportGroup[ii].DetailRows[iRow].CostValue_Curr
              );

              lv_Sum_Diff_Curr += parseFloat(
                ReportGroup[ii].DetailRows[iRow].Diff_Curr
              );
              lv_Sum_Margin_Curr += ReportGroup[ii].DetailRows[iRow].Margin_Curr
                ? parseFloat(ReportGroup[ii].DetailRows[iRow].Margin_Curr)
                : 0;
              lv_Sum_SaleQty_CurrMinus1 += parseFloat(
                ReportGroup[ii].DetailRows[iRow].SaleQty_CurrMinus1
              );
              lv_Sum_SaleValue_CurrMinus1 += parseFloat(
                ReportGroup[ii].DetailRows[iRow].SaleValue_CurrMinus1
              );
              lv_Sum_CostValue_CurrMinus1 += parseFloat(
                ReportGroup[ii].DetailRows[iRow].CostValue_CurrMinus1
              );

              lv_Sum_Diff_CurrMinus1 += parseFloat(
                ReportGroup[ii].DetailRows[iRow].Diff_CurrMinus1
              );
              lv_Sum_Margin_CurrMinus1 += ReportGroup[ii].DetailRows[iRow]
                .Margin_CurrMinus1
                ? parseFloat(ReportGroup[ii].DetailRows[iRow].Margin_CurrMinus1)
                : 0;
              lv_Sum_SaleQty_CurrMinus2 += parseFloat(
                ReportGroup[ii].DetailRows[iRow].SaleQty_CurrMinus2
              );
              lv_Sum_SaleValue_CurrMinus2 += parseFloat(
                ReportGroup[ii].DetailRows[iRow].SaleValue_CurrMinus2
              );
              lv_Sum_CostValue_CurrMinus2 += parseFloat(
                ReportGroup[ii].DetailRows[iRow].CostValue_CurrMinus2
              );

              lv_Sum_Diff_CurrMinus2 += parseFloat(
                ReportGroup[ii].DetailRows[iRow].Diff_CurrMinus2
              );
              lv_Sum_Margin_CurrMinus2 += ReportGroup[ii].DetailRows[iRow]
                .Margin_CurrMinus2
                ? parseFloat(ReportGroup[ii].DetailRows[iRow].Margin_CurrMinus2)
                : 0;

              ReportGroup[ii].DetailRows[iRow] = {
                ...ReportGroup[ii].DetailRows[iRow],
                GroupCode: ReportGroup[ii].DetailRows[iRow].GroupCode,
                GroupName: ReportGroup[ii].DetailRows[iRow].GroupName,
                lv_DateFrom_Curr:
                  ReportGroup[ii].DetailRows[iRow].lv_DateFrom_Curr,
                lv_DateTo_Curr: ReportGroup[ii].DetailRows[iRow].lv_DateTo_Curr,
                SrNo: ReportGroup[ii].DetailRows[iRow].SrNo,
                ItemCode: ReportGroup[ii].DetailRows[iRow].ItemCode,
                ItemName: ReportGroup[ii].DetailRows[iRow].ItemName,
                SaleQty_Curr:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].SaleQty_Curr) ===
                  0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].SaleQty_Curr
                      ).toFixed(2),

                SaleValue_Curr:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].SaleValue_Curr
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].SaleValue_Curr
                      ).toFixed(2),
                CostValue_Curr:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].CostValue_Curr
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].CostValue_Curr
                      ).toFixed(2),

                Diff_Curr:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].Diff_Curr) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].Diff_Curr
                      ).toFixed(2),
                Margin_Curr:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].Margin_Curr) ===
                    0 || !ReportGroup[ii].DetailRows[iRow].Margin_Curr
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].Margin_Curr
                      ).toFixed(2),
                SaleQty_CurrMinus1:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].SaleQty_CurrMinus1
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].SaleQty_CurrMinus1
                      ).toFixed(2),

                SaleValue_CurrMinus1:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].SaleValue_CurrMinus1
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].SaleValue_CurrMinus1
                      ).toFixed(2),
                CostValue_CurrMinus1:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].CostValue_CurrMinus1
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].CostValue_CurrMinus1
                      ).toFixed(2),

                Diff_CurrMinus1:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].Diff_CurrMinus1
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].Diff_CurrMinus1
                      ).toFixed(2),
                Margin_CurrMinus1:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].Margin_CurrMinus1
                  ) === 0 || !ReportGroup[ii].DetailRows[iRow].Margin_CurrMinus1
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].Margin_CurrMinus1
                      ).toFixed(2),
                SaleQty_CurrMinus2:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].SaleQty_CurrMinus2
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].SaleQty_CurrMinus2
                      ).toFixed(2),

                SaleValue_CurrMinus2:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].SaleValue_CurrMinus2
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].SaleValue_CurrMinus2
                      ).toFixed(2),
                CostValue_CurrMinus2:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].CostValue_CurrMinus2
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].CostValue_CurrMinus2
                      ).toFixed(2),

                Diff_CurrMinus2:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].Diff_CurrMinus2
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].Diff_CurrMinus2
                      ).toFixed(2),
                Margin_CurrMinus2:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].Margin_CurrMinus2
                  ) === 0 || !ReportGroup[ii].DetailRows[iRow].Margin_CurrMinus2
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].Margin_CurrMinus2
                      ).toFixed(2),

                Margin_diff1:
                  Math.abs(ReportGroup[ii].DetailRows[iRow].Margin_CurrMinus1) >
                  Math.abs(ReportGroup[ii].DetailRows[iRow].Margin_CurrMinus2)
                    ? true
                    : false,
                Margin_diff:
                  Math.abs(ReportGroup[ii].DetailRows[iRow].Margin_Curr) >
                  Math.abs(ReportGroup[ii].DetailRows[iRow].Margin_CurrMinus1)
                    ? true
                    : false,
              };
            }

            ReportGroup[ii] = {
              ...ReportGroup[ii],
              Sum_SaleQty_Curr:
                lv_Sum_SaleQty_Curr === 0
                  ? "-"
                  : lv_Sum_SaleQty_Curr.toFixed(2),
              Sum_SaleValue_Curr:
                lv_Sum_SaleValue_Curr === 0
                  ? "-"
                  : lv_Sum_SaleValue_Curr.toFixed(2),
              Sum_CostValue_Curr:
                lv_Sum_CostValue_Curr === 0
                  ? "-"
                  : lv_Sum_CostValue_Curr.toFixed(2),
              Sum_Diff_Curr:
                lv_Sum_Diff_Curr === 0 ? "-" : lv_Sum_Diff_Curr.toFixed(2),
              Sum_Margin_Curr:
                lv_Sum_Margin_Curr === 0 || !lv_Sum_Margin_Curr
                  ? "-"
                  : lv_Sum_Margin_Curr.toFixed(2),
              Sum_SaleQty_CurrMinus1:
                lv_Sum_SaleQty_CurrMinus1 === 0
                  ? "-"
                  : lv_Sum_SaleQty_CurrMinus1.toFixed(2),
              Sum_SaleValue_CurrMinus1:
                lv_Sum_SaleValue_CurrMinus1 === 0
                  ? "-"
                  : lv_Sum_SaleValue_CurrMinus1.toFixed(2),
              Sum_CostValue_CurrMinus1:
                lv_Sum_CostValue_CurrMinus1 === 0
                  ? "-"
                  : lv_Sum_CostValue_CurrMinus1.toFixed(2),
              Sum_Diff_CurrMinus1:
                lv_Sum_Diff_CurrMinus1 === 0
                  ? "-"
                  : lv_Sum_Diff_CurrMinus1.toFixed(2),
              Sum_Margin_CurrMinus1:
                lv_Sum_Margin_CurrMinus1 === 0 || !lv_Sum_Margin_CurrMinus1
                  ? "-"
                  : lv_Sum_Margin_CurrMinus1.toFixed(2),
              Sum_SaleQty_CurrMinus2:
                lv_Sum_SaleQty_CurrMinus2 === 0
                  ? "-"
                  : lv_Sum_SaleQty_CurrMinus2.toFixed(2),
              Sum_SaleValue_CurrMinus2:
                lv_Sum_SaleValue_CurrMinus2 === 0
                  ? "-"
                  : lv_Sum_SaleValue_CurrMinus2.toFixed(2),
              Sum_CostValue_CurrMinus2:
                lv_Sum_CostValue_CurrMinus2 === 0
                  ? "-"
                  : lv_Sum_CostValue_CurrMinus2.toFixed(2),
              Sum_Diff_CurrMinus2:
                lv_Sum_Diff_CurrMinus2 === 0
                  ? "-"
                  : lv_Sum_Diff_CurrMinus2.toFixed(2),
              Sum_Margin_CurrMinus2:
                lv_Sum_Margin_CurrMinus2 === 0 || !lv_Sum_Margin_CurrMinus2
                  ? "-"
                  : lv_Sum_Margin_CurrMinus2.toFixed(2),
            };

            var ReportHdr = {
              Hdr: "Sales Comparision Summary",
              CurrCaption: dynamicRes[1][0].Curr_Caption,
              CurrMinus1Caption: dynamicRes[1][0].Curr_Minus1_Caption,
              CurrMinus2Caption: dynamicRes[1][0].Curr_Minus2_Caption,
            };
          }
        } else {
          resposeMessage = "No data found!";
        }
      } else {
        resposeMessage = "Report config not defined!";
      }

      // console.log(ReportGroup, ReportHdr);
      return {
        message: resposeMessage,
        ReportConfig,
        data: { ReportGroup, ReportHdr },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  // mk stocl summary

  async getINVGetDataRPT_StockSummaryMk(
    pReportId,
    pCompCode,
    pBranchCode,
    pDeptCode,
    pFromDate,
    pToDate,
    pGroupOn,
    pShow_Qty_Amount_Both
  ): Promise<any> {
    const ReportId = pReportId;

    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let ReportSummary;
      let ReportGroup = [];

      const ReportConfig = await this.mainReport.getReportInfo(
        ReportId,
        pCompCode
      );
      // console.log("ss", ReportConfig);
      //prepare data && fetch data from dynamic stored procedure
      if (ReportConfig.ReportHdr.ReportSource) {
        query = ReportConfig.ReportHdr.ReportSource;

        dynamicRes = await this.conn.query(query, [
          pCompCode,
          pBranchCode,
          pDeptCode,
          pFromDate,
          pToDate,
          pGroupOn,
        ]);
        // console.log(dynamicRes);
        if (dynamicRes[0].length > 0) {
          //Set ReportDtl
          dynamicRes[0].forEach(async (row, idx) => {
            // console.log(row);
            let l_Index = ReportGroup.findIndex(
              (oo) => oo.GroupName === row.GroupName
            );
            if (l_Index >= 0) {
              ReportGroup[l_Index].DetailRows.push({
                ...row,
                SrNo: ReportGroup[l_Index].DetailRows.length + 1,
              });
            } else {
              ReportGroup.push({
                GroupCode: row.GroupCode,
                GroupName: row.GroupName,
                DetailRows: [{ ...row, SrNo: 1 }],
              });
            }
          });

          let ii = 0;
          for (ii; ii < ReportGroup.length; ii++) {
            // new
            // stock In
            let lv_Total_Sum_StockInQty = 0;
            let lv_Total_Sum_StockInAmount = 0;
            //Stock Out
            let lv_Total_Sum_StockOutQty = 0;
            let lv_Total_Sum_StockOutAmount = 0;

            let Sum_StockInQty = 0;
            let Sum_StockOutAmount = 0;
            let Sum_StockOutQty = 0;
            let Sum_StockInAmount = 0;
            let i = 0;
            for (i; i < ReportGroup[ii].DetailRows.length; i++) {
              lv_Total_Sum_StockInQty =
                parseFloat(ReportGroup[ii].DetailRows[i].PurchaseQty) +
                parseFloat(ReportGroup[ii].DetailRows[i].TransferInQty) +
                parseFloat(ReportGroup[ii].DetailRows[i].SaleReturnQty) +
                parseFloat(ReportGroup[ii].DetailRows[i].StockAdjPlusQty);
              lv_Total_Sum_StockInAmount =
                parseFloat(ReportGroup[ii].DetailRows[i].PurchaseAmount) +
                parseFloat(ReportGroup[ii].DetailRows[i].TransferInAmount) +
                parseFloat(ReportGroup[ii].DetailRows[i].SaleReturnAmount) +
                parseFloat(ReportGroup[ii].DetailRows[i].StockAdjPlusAmount);

              lv_Total_Sum_StockOutQty =
                parseFloat(ReportGroup[ii].DetailRows[i].SalesQty) +
                parseFloat(ReportGroup[ii].DetailRows[i].TransferOutQty) +
                parseFloat(ReportGroup[ii].DetailRows[i].PurchaseReturnQty) +
                parseFloat(ReportGroup[ii].DetailRows[i].StockAdjMinusQty);
              lv_Total_Sum_StockOutAmount =
                parseFloat(ReportGroup[ii].DetailRows[i].SalesAmount) +
                parseFloat(ReportGroup[ii].DetailRows[i].TransferOutAmount) +
                parseFloat(ReportGroup[ii].DetailRows[i].PurchaseReturnAmount) +
                parseFloat(ReportGroup[ii].DetailRows[i].StockAdjMinusAmount);

              Sum_StockInQty += lv_Total_Sum_StockInQty;
              Sum_StockInAmount += lv_Total_Sum_StockInAmount;
              Sum_StockOutQty += lv_Total_Sum_StockOutQty;
              Sum_StockOutAmount += lv_Total_Sum_StockOutAmount;
              ReportGroup[ii].DetailRows[i] = {
                ...ReportGroup[ii].DetailRows[i],
                StockInQty:
                  lv_Total_Sum_StockInQty === 0
                    ? "-"
                    : lv_Total_Sum_StockInQty.toFixed(2),
                StockInAmount:
                  lv_Total_Sum_StockInAmount === 0
                    ? "-"
                    : lv_Total_Sum_StockInAmount.toFixed(2),
                StockOutQty:
                  lv_Total_Sum_StockOutQty === 0
                    ? "-"
                    : lv_Total_Sum_StockOutQty.toFixed(2),
                StockOutAmount:
                  lv_Total_Sum_StockOutAmount === 0
                    ? "-"
                    : lv_Total_Sum_StockOutAmount.toFixed(2),
              };
            }
            ReportGroup[ii] = {
              ...ReportGroup[ii],
              Sum_StockInQty:
                Sum_StockInQty === 0 ? "-" : Sum_StockInQty.toFixed(2),
              Sum_StockInAmount:
                Sum_StockInAmount === 0 ? "-" : Sum_StockInAmount.toFixed(2),
              Sum_StockOutQty:
                Sum_StockOutQty === 0 ? "-" : Sum_StockOutQty.toFixed(2),
              Sum_StockOutAmount:
                Sum_StockOutAmount === 0 ? "-" : Sum_StockOutAmount.toFixed(2),
            };
            // existing

            let lv_Sum_OpeningQty = 0;
            let lv_Sum_OpeningAmount = 0;
            let lv_Sum_PurchaseQty = 0;
            let lv_Sum_PurchaseAmount = 0;
            let lv_Sum_TransferInQty = 0;
            let lv_Sum_TransferInAmount = 0;
            let lv_Sum_SaleReturnQty = 0;
            let lv_Sum_SaleReturnAmount = 0;
            let lv_Sum_StockAdjPlusQty = 0;
            let lv_Sum_StockAdjPlusAmount = 0;
            let lv_Sum_SalesQty = 0;
            let lv_Sum_SalesAmount = 0;
            let lv_Sum_TransferOutQty = 0;
            let lv_Sum_TransferOutAmount = 0;
            let lv_Sum_PurchaseReturnQty = 0;
            let lv_Sum_PurchaseReturnAmount = 0;
            let lv_Sum_StockAdjMinusQty = 0;
            let lv_Sum_StockAdjMinusAmount = 0;
            let lv_Sum_ClosingQty = 0;
            let lv_Sum_ClosingAmount = 0;

            let iRow = 0;
            for (iRow; iRow < ReportGroup[ii].DetailRows.length; iRow++) {
              lv_Sum_OpeningQty += parseFloat(
                ReportGroup[ii].DetailRows[iRow].OpeningQty
              );
              lv_Sum_OpeningAmount += parseFloat(
                ReportGroup[ii].DetailRows[iRow].OpeningAmount
              );
              lv_Sum_PurchaseQty += parseFloat(
                ReportGroup[ii].DetailRows[iRow].PurchaseQty
              );
              lv_Sum_PurchaseAmount += parseFloat(
                ReportGroup[ii].DetailRows[iRow].PurchaseAmount
              );
              lv_Sum_TransferInQty += parseFloat(
                ReportGroup[ii].DetailRows[iRow].TransferInQty
              );
              lv_Sum_TransferInAmount += parseFloat(
                ReportGroup[ii].DetailRows[iRow].TransferInAmount
              );
              lv_Sum_SaleReturnQty += parseFloat(
                ReportGroup[ii].DetailRows[iRow].SaleReturnQty
              );
              lv_Sum_SaleReturnAmount += parseFloat(
                ReportGroup[ii].DetailRows[iRow].SaleReturnAmount
              );
              lv_Sum_StockAdjPlusQty += parseFloat(
                ReportGroup[ii].DetailRows[iRow].StockAdjPlusQty
              );
              lv_Sum_StockAdjPlusAmount += parseFloat(
                ReportGroup[ii].DetailRows[iRow].StockAdjPlusAmount
              );
              lv_Sum_SalesQty += parseFloat(
                ReportGroup[ii].DetailRows[iRow].SalesQty
              );
              lv_Sum_SalesAmount += parseFloat(
                ReportGroup[ii].DetailRows[iRow].SalesAmount
              );
              lv_Sum_TransferOutQty += parseFloat(
                ReportGroup[ii].DetailRows[iRow].TransferOutQty
              );
              lv_Sum_TransferOutAmount += parseFloat(
                ReportGroup[ii].DetailRows[iRow].TransferOutAmount
              );
              lv_Sum_PurchaseReturnQty += parseFloat(
                ReportGroup[ii].DetailRows[iRow].PurchaseReturnQty
              );
              lv_Sum_PurchaseReturnAmount += parseFloat(
                ReportGroup[ii].DetailRows[iRow].PurchaseReturnAmount
              );
              lv_Sum_StockAdjMinusQty += parseFloat(
                ReportGroup[ii].DetailRows[iRow].StockAdjMinusQty
              );
              lv_Sum_StockAdjMinusAmount += parseFloat(
                ReportGroup[ii].DetailRows[iRow].StockAdjMinusAmount
              );
              lv_Sum_ClosingQty += parseFloat(
                ReportGroup[ii].DetailRows[iRow].ClosingStockQty
              );
              lv_Sum_ClosingAmount += parseFloat(
                ReportGroup[ii].DetailRows[iRow].ClosingAmount
              );

              ReportGroup[ii].DetailRows[iRow] = {
                ...ReportGroup[ii].DetailRows[iRow],
                OpeningQty:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].OpeningQty) === 0
                    ? "-"
                    : parseFloat(ReportGroup[ii].DetailRows[iRow].OpeningQty),
                PurchaseQty:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].PurchaseQty) === 0
                    ? "-"
                    : parseFloat(ReportGroup[ii].DetailRows[iRow].PurchaseQty),
                TransferInQty:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].TransferInQty) ===
                  0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].TransferInQty
                      ),
                SaleReturnQty:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].SaleReturnQty) ===
                  0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].SaleReturnQty
                      ),
                StockAdjPlusQty:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].StockAdjPlusQty
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].StockAdjPlusQty
                      ),
                SalesQty:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].SalesQty) === 0
                    ? "-"
                    : parseFloat(ReportGroup[ii].DetailRows[iRow].SalesQty),
                TransferOutQty:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].TransferOutQty
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].TransferOutQty
                      ),
                PurchaseReturnQty:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].PurchaseReturnQty
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].PurchaseReturnQty
                      ),
                StockAdjMinusQty:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].StockAdjMinusQty
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].StockAdjMinusQty
                      ),
                ClosingStockQty:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].ClosingStockQty
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].ClosingStockQty
                      ),
                OpeningAmount:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].OpeningAmount) ===
                  0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].OpeningAmount
                      ).toFixed(2),
                PurchaseAmount:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].PurchaseAmount
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].PurchaseAmount
                      ).toFixed(2),
                TransferInAmount:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].TransferInAmount
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].TransferInAmount
                      ).toFixed(2),
                SaleReturnAmount:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].SaleReturnAmount
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].SaleReturnAmount
                      ).toFixed(2),
                StockAdjPlusAmount:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].StockAdjPlusAmount
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].StockAdjPlusAmount
                      ).toFixed(2),
                SalesAmount:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].SalesAmount) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].SalesAmount
                      ).toFixed(2),
                TransferOutAmount:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].TransferOutAmount
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].TransferOutAmount
                      ).toFixed(2),
                PurchaseReturnAmount:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].PurchaseReturnAmount
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].PurchaseReturnAmount
                      ).toFixed(2),
                StockAdjMinusAmount:
                  parseFloat(
                    ReportGroup[ii].DetailRows[iRow].StockAdjMinusAmount
                  ) === 0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].StockAdjMinusAmount
                      ).toFixed(2),
                ClosingAmount:
                  parseFloat(ReportGroup[ii].DetailRows[iRow].ClosingAmount) ===
                  0
                    ? "-"
                    : parseFloat(
                        ReportGroup[ii].DetailRows[iRow].ClosingAmount
                      ).toFixed(2),
              };
            }

            ReportGroup[ii] = {
              ...ReportGroup[ii],
              Sum_OpeningQty: lv_Sum_OpeningQty === 0 ? "-" : lv_Sum_OpeningQty,
              Sum_OpeningAmount:
                lv_Sum_OpeningAmount === 0
                  ? "-"
                  : lv_Sum_OpeningAmount.toFixed(2),
              Sum_PurchaseQty:
                lv_Sum_PurchaseQty === 0 ? "-" : lv_Sum_PurchaseQty,
              Sum_PurchaseAmount:
                lv_Sum_PurchaseAmount === 0
                  ? "-"
                  : lv_Sum_PurchaseAmount.toFixed(2),
              Sum_TransferInQty:
                lv_Sum_TransferInQty === 0 ? "-" : lv_Sum_TransferInQty,
              Sum_TransferInAmount:
                lv_Sum_TransferInAmount === 0
                  ? "-"
                  : lv_Sum_TransferInAmount.toFixed(2),
              Sum_SaleReturnQty:
                lv_Sum_SaleReturnQty === 0 ? "-" : lv_Sum_SaleReturnQty,
              Sum_SaleReturnAmount:
                lv_Sum_SaleReturnAmount === 0
                  ? "-"
                  : lv_Sum_SaleReturnAmount.toFixed(2),
              Sum_StockAdjPlusQty:
                lv_Sum_StockAdjPlusQty === 0 ? "-" : lv_Sum_StockAdjPlusQty,
              Sum_StockAdjPlusAmount:
                lv_Sum_StockAdjPlusAmount === 0
                  ? "-"
                  : lv_Sum_StockAdjPlusAmount.toFixed(2),
              Sum_SalesQty: lv_Sum_SalesQty === 0 ? "-" : lv_Sum_SalesQty,
              Sum_SalesAmount:
                lv_Sum_SalesAmount === 0 ? "-" : lv_Sum_SalesAmount.toFixed(2),
              Sum_TransferOutQty:
                lv_Sum_TransferOutQty === 0 ? "-" : lv_Sum_TransferOutQty,
              Sum_TransferOutAmount:
                lv_Sum_TransferOutAmount === 0
                  ? "-"
                  : lv_Sum_TransferOutAmount.toFixed(2),
              Sum_PurchaseReturnQty:
                lv_Sum_PurchaseReturnQty === 0 ? "-" : lv_Sum_PurchaseReturnQty,
              Sum_PurchaseReturnAmount:
                lv_Sum_PurchaseReturnAmount === 0
                  ? "-"
                  : lv_Sum_PurchaseReturnAmount.toFixed(2),
              Sum_StockAdjMinusQty:
                lv_Sum_StockAdjMinusQty === 0 ? "-" : lv_Sum_StockAdjMinusQty,
              Sum_StockAdjMinusAmount:
                lv_Sum_StockAdjMinusAmount === 0
                  ? "-"
                  : lv_Sum_StockAdjMinusAmount.toFixed(2),
              Sum_ClosingQty: lv_Sum_ClosingQty === 0 ? "-" : lv_Sum_ClosingQty,
              Sum_ClosingAmount:
                lv_Sum_ClosingAmount === 0
                  ? "-"
                  : lv_Sum_ClosingAmount.toFixed(2),
            };

            var ReportHdr = {
              Hdr: "Stock Summmary",
              FromDate: moment(pFromDate, "YYYY-MM-DD").format(
                ReportConfig.GeneralInfo.DateFormat
              ),
              ToDate: moment(pToDate, "YYYY-MM-DD").format(
                ReportConfig.GeneralInfo.DateFormat
              ),
            };
          }
        } else {
          resposeMessage = "No data found!";
        }
      } else {
        resposeMessage = "Report config not defined!";
      }

      return {
        message: resposeMessage,
        ReportConfig,
        data: { ReportGroup, ReportHdr },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  // sushil
  async getDataRPTCallerRMPerformance(
    pReportId,
    pCompCode,
    pGroupOn,
    pFromDate,
    pToDate
  ): Promise<any> {
    const ReportId = pReportId;
    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let ReportGroup = [];
      let ReportSummary;

      let l_TotalLeads = 0;
      // let l_TotalCredit = 0;

      const ReportConfig = await this.mainReport.getReportInfo(
        ReportId,
        pCompCode
      );
      // console.log("ss", ReportConfig);
      //prepare data && fetch data from dynamic stored procedure
      if (ReportConfig.ReportHdr.ReportSource) {
        query = ReportConfig.ReportHdr.ReportSource;
        dynamicRes = await this.conn.query(query, [
          pCompCode,
          pGroupOn,
          pFromDate,
          pToDate,
        ]);
        // console.log(pGroupOn, "pGroupOn");

        if (dynamicRes[0].length > 0) {
          //Set ReportDtl
          dynamicRes[0].forEach(async (row, idx) => {

            
            // console.log(row);
            let l_Index = ReportGroup.findIndex(
              (oo) => oo.GroupCode === row.username
            );
            
            // console.log(l_TotalLeads,"first")
            let GroupBy = null;
            if (pGroupOn === "CALLER") {
              GroupBy = "RM";
            } else {
              GroupBy = "CALLER";
            }
            if (l_Index >= 0) {
              ReportGroup[l_Index].DetailRows.push({
                ...row,
                SrNo: ReportGroup[l_Index].DetailRows.length + 1,
                AssignedId:
                  GroupBy === "RM"
                    ? row.AssignedRMName === null
                      ? "No RM Assigned Yet"
                      : row.AssignedRMName
                    : row.AssignedCallerName,
              });
            } else {
              ReportGroup.push({
                GroupCode: row.username,
                GroupName: row.Name,
                Group: GroupBy,
                DetailRows: [
                  {
                    ...row,
                    SrNo: 1,
                    AssignedId:
                      GroupBy === "RM"
                        ? row.AssignedRMName === null
                          ? "No RM Assigned Yet"
                          : row.AssignedRMName
                        : row.AssignedCallerName,
                  },
                ],
              });
            }
          });

          let ii = 0;
          for (ii; ii < ReportGroup.length; ii++) {
            let iRow = 0;
            for (iRow; iRow < ReportGroup[ii].DetailRows.length; iRow++) {
              ReportGroup[ii].DetailRows[iRow] = {
                ...ReportGroup[ii].DetailRows[iRow],
              };
            }

            var ReportHdr = {
              Hdr: ReportConfig.ReportHdr.ReportName,
              FromDate: moment(pFromDate, "YYYY-MM-DD").format(
                ReportConfig.GeneralInfo.DateFormat
              ),
              ToDate: moment(pToDate, "YYYY-MM-DD").format(
                ReportConfig.GeneralInfo.DateFormat
              ),
            };
          }
        } else {
          resposeMessage = "No data found!";
        }
      } else {
        resposeMessage = "Report config not defined!";
      }
      // console.log(ReportHdr, "ReportConfig.GeneralInfo.");
      return {
        message: resposeMessage,
        ReportConfig,
        data: { ReportGroup, ReportHdr },
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
