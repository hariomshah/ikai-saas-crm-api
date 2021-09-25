import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from "@nestjs/common";
import { Any, Connection } from "typeorm";
import { resolve } from "dns";
import moment = require("moment");
import { replace } from "lodash";
import { CLIENT_RENEG_LIMIT, rootCertificates } from "tls";
import e = require("express");
import { elementAt } from "rxjs/operators";
const _ = require("lodash");

@Injectable()
export class HtmlReportsService {
  private logger = new Logger("HtmlReportsService");

  constructor(private readonly conn: Connection) {}

  async _inWords(num) {
    const a = [
      "",
      "One ",
      "Two ",
      "Three ",
      "Four ",
      "Five ",
      "Six ",
      "Seven ",
      "Eight ",
      "Nine ",
      "Ten ",
      "Eleven ",
      "Twelve ",
      "Thirteen ",
      "Fourteen ",
      "Fifteen ",
      "Sixteen ",
      "Seventeen ",
      "Eighteen ",
      "Nineteen ",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    let n;
    if ((num = num.toString()).length > 9) {
      return "overflow";
    } else {
      n = ("000000000" + num)
        .substr(-9)
        .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
      if (!n) return;

      var str = "Rupees ";
      str +=
        n[1] != 0
          ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + "Crore "
          : "";
      str +=
        n[2] != 0
          ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + "Lakh "
          : "";
      str +=
        n[3] != 0
          ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + "Thousand "
          : "";
      str +=
        n[4] != 0
          ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + "Hundred "
          : "";
      str +=
        n[5] != 0
          ? (str != "" ? "and " : "") +
            (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) +
            "Only"
          : "";
      return str;
    }
  }

  async getReportInfo(pReportId, CompCode): Promise<any> {
    // console.log(pReportId, CompCode);
    let ReportConfig;
    try {
      let query = `select * from system_report_hdr Where CompCode='${CompCode}' and ReportId = ${pReportId}`;
      const SysReportHdr = await this.conn.query(query);
      // console.log("s1", SysReportHdr);

      query = `select * from system_report_print_hdr Where CompCode='${CompCode}' and ReportId = ${pReportId}`;
      const SysReportPrintHdr = await this.conn.query(query);
      // console.log("s2", SysReportPrintHdr);

      query = `call spGetReportsGeneralInfo('${CompCode}')`;
      const ReportGeneralInfo = await this.conn.query(query);
      // console.log('s3',ReportGeneralInfo)

      ReportConfig = {
        Config: {
          TemplateName: SysReportPrintHdr[0].template_name,
          TemplatePath: SysReportPrintHdr[0].template_path,
          Printbackground: SysReportPrintHdr[0].chrome_config_printbackground,
          Landscape: SysReportPrintHdr[0].chrome_config_landscape,
          Scale: SysReportPrintHdr[0].chrome_config_scale,
          PageRanges: SysReportPrintHdr[0].chrome_config_pageRanges,
          PageFormats: SysReportPrintHdr[0].chrome_config_page_format,
          Width: SysReportPrintHdr[0].chrome_config_width,
          Height: SysReportPrintHdr[0].chrome_config_height,
          MarginTop: SysReportPrintHdr[0].chrome_config_margin_top,
          MarginRight: SysReportPrintHdr[0].chrome_config_margin_right,
          MarginBottom: SysReportPrintHdr[0].chrome_config_margin_bottom,
          MarginLeft: SysReportPrintHdr[0].chrome_config_margin_left,
          headerTemplate: SysReportPrintHdr[0].chrome_config_header,
          footerTemplate: SysReportPrintHdr[0].chrome_config_footer,
          showReportHeader:
            SysReportPrintHdr[0].show_report_hdr === "Y" ? true : false,
        },
        GeneralInfo: ReportGeneralInfo[0][0],
        ReportHdr: {
          ReportName: SysReportHdr[0].ReportName,
          ReportDesc: SysReportHdr[0].ReportDesc,
          ReportSource: SysReportHdr[0].ReportSource,
        },
      };

      return ReportConfig;
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
  async getReportServiceInvoice(pReportId, pInvoiceId, CompCode): Promise<any> {
    const ReportId = pReportId;

    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let InvoiceHdr;
      let InvoiceDtl = [];
      let TaxBreakup = [];
      const ReportConfig = await this.getReportInfo(ReportId, CompCode);

      //prepare data && fetch data from dynamic stored procedure
      if (ReportConfig.ReportHdr.ReportSource) {
        query = ReportConfig.ReportHdr.ReportSource;
        // console.log("ss", query);
        dynamicRes = await this.conn.query(query, [CompCode, pInvoiceId]);
        if (dynamicRes[0].length > 0) {
          InvoiceHdr = {
            InvoiceId: dynamicRes[0][0].InvoiceId,
            OrderId: dynamicRes[0][0].SysOption1,
            ScheduleId: dynamicRes[0][0].SysOption2,
            InvoiceNo: dynamicRes[0][0].InvoiceNo,
            InvoiceDate: moment(dynamicRes[0][0].InvoiceDate).format(
              "DD-MM-YYYY"
            ),
            InvoiceRemark: dynamicRes[0][0].InvoiceRemark,
            GrossAmount: parseFloat(dynamicRes[0][0].GrossAmount),
            DiscAmount: parseFloat(dynamicRes[0][0].DiscAmount),
            TaxAmount: parseFloat(dynamicRes[0][0].TaxAmount),
            RoundOff: parseFloat(dynamicRes[0][0].RoundOff),
            InvoiceAmount: parseFloat(dynamicRes[0][0].InvoiceAmount),
            AmountInWords: await this._inWords(
              parseInt(dynamicRes[0][0].InvoiceAmount)
            ),
            CustId: dynamicRes[0][0].UserId,
            Name: dynamicRes[0][0].Name,
            gender: dynamicRes[0][0].gender,
            email: dynamicRes[0][0].email,
            CustMobile: dynamicRes[0][0].mobile,
            GstNo: dynamicRes[0][0].GstNo,
            AddressId: dynamicRes[0][0].AddressId,
            latitude: dynamicRes[0][0].latitude,
            longitude: dynamicRes[0][0].longitude,
            geoLocationName: dynamicRes[0][0].geoLocationName,
            add1: dynamicRes[0][0].add1,
            add2: dynamicRes[0][0].add2,
            add3: dynamicRes[0][0].add3,
            AddressTag: dynamicRes[0][0].AddressTag,
            City: dynamicRes[0][0].City,
            PinCode: dynamicRes[0][0].PinCode,
            currentData: moment().format("DD-MM-YYYY hh:mm:ss"),
            TaxExclusiveAmount: (
              dynamicRes[0][0].GrossAmount -
              dynamicRes[0][0].DiscAmount -
              dynamicRes[0][0].TaxAmount
            ).toFixed(3),
            Cashier: dynamicRes[0][0].crt_usrId,
          };

          //Set invoice dtl
          dynamicRes[0].forEach((row) => {
            InvoiceDtl.push({
              SrNo: row.SrNo,
              ItemType: row.ItemType,
              ItemCode: row.ItemCode,
              ItemName: row.ItemName,
              ItemDesc: row.ItemDesc,
              HSNSACCode: row.HSNSACCode,
              hsnsacdesc: row.hsnsacdesc,
              TaxCode: row.TaxCode,
              TaxName: row.TaxName,
              UnitCode: row.UnitCode,
              UnitName: row.UnitName,
              Qty: parseInt(row.Qty),
              Rate: parseFloat(row.Rate),
              Disc: parseFloat(row.Disc),
              Amount: parseFloat(row.Amount),
              SGST: parseFloat(row.SGST),
              CGST: parseFloat(row.CGST),
              UGST: parseFloat(row.UGST),
              IGST: parseFloat(row.IGST),
              Surcharge: parseFloat(row.Surcharge),
              Cess: parseFloat(row.Cess),
              AmountInclTax: (
                parseFloat(row.Amount) +
                parseFloat(row.SGST) +
                parseFloat(row.CGST) +
                parseFloat(row.UGST) +
                parseFloat(row.IGST)
              ).toFixed(3),
            });
          });

          //Set Tax Breakup
          dynamicRes[0].forEach((row) => {
            let idx = TaxBreakup.findIndex((tt) => tt.TaxCode === row.TaxCode);
            if (idx >= 0) {
              TaxBreakup[idx].TaxableAmount += parseFloat(row.Amount);
              TaxBreakup[idx].SGST += parseFloat(row.SGST);
              TaxBreakup[idx].CGST += parseFloat(row.CGST);
              TaxBreakup[idx].UGST += parseFloat(row.UGST);
              TaxBreakup[idx].IGST += parseFloat(row.IGST);
              TaxBreakup[idx].Surcharge += parseFloat(row.Surcharge);
              TaxBreakup[idx].Cess += parseFloat(row.Cess);
            } else {
              TaxBreakup.push({
                TaxCode: row.TaxCode,
                TaxName: row.TaxName,
                TaxableAmount: parseFloat(row.Amount),
                SGST: parseFloat(row.SGST),
                CGST: parseFloat(row.CGST),
                UGST: parseFloat(row.UGST),
                IGST: parseFloat(row.IGST),
                Surcharge: parseFloat(row.Surcharge),
                Cess: parseFloat(row.Cess),
              });
            }
          });
        } else {
          resposeMessage = "No data found!";
        }
      } else {
        resposeMessage = "Report config not defined!";
      }

      return {
        message: resposeMessage,
        ReportConfig,
        data: { InvoiceHdr, InvoiceDtl, TaxBreakup },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getReportServiceKOT(pReportId, pKotNo, CompCode): Promise<any> {
    const ReportId = pReportId;
    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;
      let adOnRes;
      let KOTHdr;
      let KOTDtl = [];
      let addInfo;
      const ReportConfig = await this.getReportInfo(ReportId, CompCode);
      // console.log("ss", ReportConfig);
      //prepare data && fetch data from dynamic stored procedure
      if (ReportConfig.ReportHdr.ReportSource) {
        query = ReportConfig.ReportHdr.ReportSource;
        dynamicRes = await this.conn.query(query, [CompCode, pKotNo]);
        // adOnRes = await this.conn.query(`
        // select * from pos_kot_dtl_addons where KOTId=${pKotNo}`);
        if (dynamicRes[0].length > 0) {
          KOTHdr = {
            KotId: dynamicRes[0][0].KOTId,
            KotDateTime: moment(dynamicRes[0][0].KOT_Date).format(
              "DD-MM-YYYY hh:mm:ss"
            ),
            KotRemark: dynamicRes[0][0].KOT_Remark,
            OrderType: dynamicRes[0][0].OrderType,
            TableNo: dynamicRes[0][0].TableNo,
          };
          let tempQty = 0;
          //Set invoice dtl
          dynamicRes[0].forEach(async (row) => {
            // let addonTemp = await adOnRes.filter(afil => afil.KOT_DTL_Id === row.KOT_DTL_Id && afil.SrNo === row.SrNo)
            // let displayAddOn = ""
            // addonTemp.forEach((element, index) => {
            //   displayAddOn += `${element.ItemName}${index + 1 === addonTemp.length ? '' : ','} `
            // });

            if (row.ItemStatus !== "CNL" && row.ItemStatus !== "RJCT") {
              // console.log(row.Qty, "imcreased", tempQty);
              tempQty += parseInt(row.Qty);
              // console.log(tempQty, "inc +")
            }
            KOTDtl.push({
              ...row,
              Qty: parseInt(row.Qty),
              // displayAddOn: displayAddOn
            });
          });
          //Set AdditionalInfo
          await tempQty;
          addInfo = await { TotalQty: await tempQty };
        } else {
          resposeMessage = "No data found!";
        }
      } else {
        resposeMessage = "Report config not defined!";
      }
      // console.log({ KOTHdr, KOTDtl, addInfo }, "data");
      return {
        message: resposeMessage,
        ReportConfig,
        data: await { KOTHdr, KOTDtl, addInfo },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getReceiptsAndPaymentSlip(
    pReportId,
    pTranType,
    pTranId,
    CompCode
  ): Promise<any> {
    // console.log(pTranType, pTranId, CompCode);
    const ReportId = pReportId;
    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;
      let TransferSummary;
      let TranHdr;
      let TranDtl = [];
      const ReportConfig = await this.getReportInfo(ReportId, CompCode);
      // console.log("ss", ReportConfig);
      //prepare data && fetch data from dynamic stored procedure
      if (ReportConfig.ReportHdr.ReportSource) {
        query = ReportConfig.ReportHdr.ReportSource;
        dynamicRes = await this.conn.query(query, [
          CompCode,
          pTranType,
          pTranId,
        ]);
        // console.log(
        //   dynamicRes[0][0].TranDate,
        //   "DATE",
        //   moment(dynamicRes[0][0].TranDate, "DD-MM-YYYY")
        // );
        if (dynamicRes[0].length > 0) {
          // console.log("step 1")
          TranHdr = {
            TranType: dynamicRes[0][0].TranType,
            TranId: dynamicRes[0][0].TranId,
            DType: dynamicRes[0][0].DType,
            RefNo: dynamicRes[0][0].RefNo,
            RefDesc: dynamicRes[0][0].RefDesc,
            TranDate: moment(dynamicRes[0][0].TranDate).format("DD-MM-YYYY"),
            TranNo: dynamicRes[0][0].TranNo,
            Amount: dynamicRes[0][0].Amount,
            BalAmount: dynamicRes[0][0].BalAmount,
            Remark:
              dynamicRes[0][0].Remark !== null && dynamicRes[0][0].Remark !== ""
                ? dynamicRes[0][0].Remark
                : "-",
            LastModifiedBy: dynamicRes[0][0].LastModifiedBy,
            LastModifiedOn: moment(dynamicRes[0][0].LastModifiedOn).format(
              "DD-MM-YYYY hh:mm:ss"
            ),
            PayDesc: dynamicRes[0][0].PayDesc,
            ReportTitle:
              dynamicRes[0][0].TranType === "RCT"
                ? "Receipt Slip"
                : dynamicRes[0][0].TranType === "INC"
                ? "Income Slip"
                : dynamicRes[0][0].TranType === "PMT"
                ? "Payment Slip"
                : dynamicRes[0][0].TranType === "EXPS"
                ? "Expense Slip"
                : dynamicRes[0][0].TranType === "TRNFR"
                ? "Transfer Slip"
                : dynamicRes[0][0].TranType === "ADJS"
                ? "Adjustment Slip"
                : dynamicRes[0][0].TranType === "CHEQUE"
                ? "Cheque Slip"
                : "",
            AmountInWords: await this._inWords(
              parseInt(dynamicRes[0][0].Amount)
            ),
          };
          // console.log("step 2")
          let TransferFromDesc = "";
          let TransferFromAmount = "";
          let TransferToDesc = "";
          let TransferToAmount = "";
          if (pTranType === "TRNFR") {
            TransferFromDesc = dynamicRes[0][0].PayDesc;
            TransferFromAmount = Math.abs(dynamicRes[0][0].DtlAmount).toFixed(
              2
            );
            TransferToDesc = dynamicRes[0][1].PayDesc;
            TransferToAmount = Math.abs(dynamicRes[0][1].DtlAmount).toFixed(2);
          }
          TransferSummary = {
            TransferFromDesc,
            TransferFromAmount,
            TransferToDesc,
            TransferToAmount,
          };
          //Set Tran dtl
          // console.log("step 3")
          dynamicRes[0].forEach((row, idx) => {
            TranDtl.push({
              SrNo: idx + 1,
              PaymentMode: row.PaymentMode,
              PayDesc: row.PayDesc,
              DtlAmount: parseFloat(row.DtlAmount).toFixed(2),
              DtlRemark: row.DtlRemark,
            });
          });
          // console.log(TranHdr, TranDtl, TransferSummary, "asfdh")
        } else {
          resposeMessage = "No data found!";
        }
      } else {
        resposeMessage = "Report config not defined!";
      }

      return {
        message: resposeMessage,
        ReportConfig,
        data: { TranHdr, TranDtl, TransferSummary },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //20200104 Saurav
  async getCashBookReport(
    pReportId,
    pFromDate,
    pToDate,
    CompCode
  ): Promise<any> {
    const ReportId = pReportId;

    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let ReportSummary;
      let ReportDtl = [];

      let l_TotalDebit = 0;
      let l_TotalCredit = 0;

      const ReportConfig = await this.getReportInfo(ReportId, CompCode);
      // console.log("ss", ReportConfig);
      //prepare data && fetch data from dynamic stored procedure
      if (ReportConfig.ReportHdr.ReportSource) {
        query = ReportConfig.ReportHdr.ReportSource;
        dynamicRes = await this.conn.query(query, [
          CompCode,
          pFromDate,
          pToDate,
        ]);
        // console.log(dynamicRes);
        if (dynamicRes[0].length > 0) {
          //Set ReportDtl
          dynamicRes[0].forEach(async (row, idx) => {
            l_TotalDebit += parseFloat(row.Debit);
            l_TotalCredit += parseFloat(row.Credit);

            await ReportDtl.push({
              SrNo: idx + 1,
              TranType: row.TranType,
              TranId: row.TranId,
              DType: row.DType,
              RefNo: row.RefNo,
              RefDesc: row.RefDesc,
              TranDate: row.TranDate
                ? moment(row.TranDate).format(
                    ReportConfig.GeneralInfo.DateFormat
                  )
                : null,
              TranNo: row.TranNo,
              Debit:
                parseFloat(row.Debit) === 0
                  ? "-"
                  : parseFloat(row.Debit).toFixed(2),
              Credit:
                parseFloat(row.Credit) === 0
                  ? "-"
                  : parseFloat(row.Credit).toFixed(2),
              Remark: row.Remark,
              Particulars: `${row.RefDesc} (${row.Remark})`,
              LastModifiedBy: row.LastModifiedBy,
              LastModifiedOn: row.LastModifiedOn
                ? moment(row.LastModifiedOn).format(
                    ReportConfig.GeneralInfo.DateTimeFormat
                  )
                : null,
            });
          });

          ReportSummary = {
            ReportTitle: `Cash Book   Dated ${moment(pFromDate).format(
              ReportConfig.GeneralInfo.DateFormat
            )} to ${moment(pToDate).format(
              ReportConfig.GeneralInfo.DateFormat
            )}`,
            TotalDebit: l_TotalDebit.toFixed(2),
            TotalCredit: l_TotalCredit.toFixed(2),
            ClosingBalanceDebit: (l_TotalDebit - l_TotalCredit > 0
              ? l_TotalDebit - l_TotalCredit
              : 0
            ).toFixed(2),
            ClosingBalanceCredit: (l_TotalCredit - l_TotalDebit > 0
              ? l_TotalCredit - l_TotalDebit
              : 0
            ).toFixed(2),
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
        data: { ReportSummary, ReportDtl },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //20200104 Saurav
  async getDayBookReport(
    pReportId,
    pFromDate,
    pToDate,
    CompCode
  ): Promise<any> {
    const ReportId = pReportId;
    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let ReportSummary;
      let ReportDtl = [];

      let l_TotalDebit = 0;
      let l_TotalCredit = 0;

      const ReportConfig = await this.getReportInfo(ReportId, CompCode);
      if (ReportConfig.ReportHdr.ReportSource) {
        query = ReportConfig.ReportHdr.ReportSource;
        dynamicRes = await this.conn.query(query, [
          CompCode,
          pFromDate,
          pToDate,
        ]);
        if (dynamicRes[0].length > 0) {
          //Set ReportDtl

          dynamicRes[0].forEach((row, idx) => {
            l_TotalDebit += parseFloat(row.Debit);
            l_TotalCredit += parseFloat(row.Credit);

            ReportDtl.push({
              SrNo: idx + 1,
              TranType: row.TranType,
              TranId: row.TranId,
              DType: row.DType,
              RefNo: row.RefNo,
              RefDesc: row.RefDesc,
              TranDate: row.TranDate
                ? moment(row.TranDate).format(
                    ReportConfig.GeneralInfo.DateFormat
                  )
                : null,
              TranNo: row.TranNo,
              Debit:
                parseFloat(row.Debit) === 0
                  ? "-"
                  : parseFloat(row.Debit).toFixed(2),
              Credit:
                parseFloat(row.Credit) === 0
                  ? "-"
                  : parseFloat(row.Credit).toFixed(2),
              Remark: row.Remark,
              Particulars: `${row.RefDesc} (${row.Remark})`,
              LastModifiedBy: row.LastModifiedBy,
              LastModifiedOn: row.LastModifiedOn
                ? moment(row.LastModifiedOn).format(
                    ReportConfig.GeneralInfo.DateTimeFormat
                  )
                : null,
            });
          });
          ReportSummary = {
            ReportTitle: `Day Book   Dated ${moment(pFromDate).format(
              ReportConfig.GeneralInfo.DateFormat
            )} to ${moment(pToDate).format(
              ReportConfig.GeneralInfo.DateFormat
            )}`,
            TotalDebit: l_TotalDebit.toFixed(2),
            TotalCredit: l_TotalCredit.toFixed(2),
            ClosingBalanceDebit: (l_TotalDebit - l_TotalCredit > 0
              ? l_TotalDebit - l_TotalCredit
              : 0
            ).toFixed(2),
            ClosingBalanceCredit: (l_TotalCredit - l_TotalDebit > 0
              ? l_TotalCredit - l_TotalDebit
              : 0
            ).toFixed(2),
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
        data: { ReportSummary, ReportDtl },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //13012021 Saurav
  async getRegisterReceiptsAndPayments(
    CompCode,
    pReportId,
    pTranType,
    pFromDate,
    pToDate,
    pRefCode,
    ViewType
  ): Promise<any> {
    const ReportId = pReportId;
    // console.log(CompCode, pTranType);
    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let ReportSummary;
      let ReportDtl = [];
      let ReportGroup = [];
      let l_TotalAmount = 0;
      let temptable = [];
      const ReportConfig = await this.getReportInfo(ReportId, CompCode);

      //prepare data && fetch data from dynamic stored procedure
      if (ReportConfig.ReportHdr.ReportSource) {
        query = ReportConfig.ReportHdr.ReportSource;
        dynamicRes = await this.conn.query(query, [
          CompCode,
          pTranType,
          pFromDate,
          pToDate,
          pRefCode,
        ]);

        //
        if (dynamicRes[0].length > 0) {
          let groupedTmpTable = _.mapValues(
            _.groupBy(dynamicRes[0], (xx) => xx.RefDesc)
          );

          Object.values(groupedTmpTable).forEach((groupValue: any[], i1) => {
            let total_TempAmount = 0;
            groupValue.forEach((element, i2) => {
              total_TempAmount = parseFloat(element.Amount) + total_TempAmount;
            });

            temptable.push({
              SrNo: i1 + 1,
              TranDesc: Object.keys(groupedTmpTable)[i1],
              Amount: total_TempAmount.toFixed(2),
            });
          });

          //Set ReportDtl
          dynamicRes[0].forEach(async (row, idx) => {
            l_TotalAmount += parseFloat(row.Amount);

            await ReportDtl.push({
              SrNo: idx + 1,
              TranType: row.TranType,
              TranId: row.TranId,
              DType: row.DType,
              RefNo: row.RefNo,
              RefDesc: row.RefDesc,
              TranDate: row.TranDate
                ? moment(row.TranDate).format(
                    ReportConfig.GeneralInfo.DateFormat
                  )
                : null,
              TranNo: row.TranNo,
              Remark: row.Remark === null ? "-" : row.Remark,
              LastModifiedBy: row.LastModifiedBy,
              LastModifiedOn: row.LastModifiedOn
                ? moment(row.LastModifiedOn).format(
                    ReportConfig.GeneralInfo.DateTimeFormat
                  )
                : null,
              Amount: parseFloat(row.Amount).toFixed(2),
            });
          });

          ReportSummary = {
            ReportTitle: `${
              pTranType === "INC"
                ? ` Income Register Dated`
                : pTranType === "RCT"
                ? `Reciept Register Dated`
                : pTranType === "PMT"
                ? `Payment Register Dated`
                : pTranType === "EXPS"
                ? `Expense Register Dated`
                : ""
            } ${moment(pFromDate).format(
              ReportConfig.GeneralInfo.DateFormat
            )} to ${moment(pToDate).format(
              ReportConfig.GeneralInfo.DateFormat
            )}`,
            TotalAmount: l_TotalAmount.toFixed(2),
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
        ViewType,
        data: { ReportSummary, ReportDtl, GroupedData: temptable },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //14012021 Saurav
  async getRegisterPurchase(
    pReportId,
    pCompCode,
    pBranchCode,
    pDeptCode,
    pFromDate,
    pToDate,
    pSuppId,
    pHideDetail
  ): Promise<any> {
    const ReportId = pReportId;
    // console.log(
    //   pCompCode,
    //   pBranchCode,
    //   pDeptCode,
    //   pFromDate,
    //   pToDate,
    //   pSuppId,
    //   pHideDetail
    // );
    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let PurchaseSummary;
      let PurchaseHdr = [];
      let l_TotalGrossAmount = 0;
      let l_TotalDiscountAmount = 0;
      let l_TotalTaxAmount = 0;
      let l_TotalNetAmount = 0;

      const ReportConfig = await this.getReportInfo(ReportId, pCompCode);
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
          pSuppId,
          pHideDetail,
        ]);
        // console.log(dynamicRes);
        if (dynamicRes[0].length > 0) {
          //Set ReportDtl
          dynamicRes[0].forEach(async (row, idx) => {
            l_TotalGrossAmount += parseFloat(row.GrossAmount);
            l_TotalDiscountAmount += parseFloat(row.DiscAmount);
            l_TotalTaxAmount += parseFloat(row.TaxAmount);
            l_TotalNetAmount += parseFloat(row.NetAmount);

            let zFindIndex = PurchaseHdr.findIndex(
              (ll) => ll.VoucherId === row.VoucherId
            );
            if (zFindIndex >= 0) {
              if (row.dtl_SrNo) {
                PurchaseHdr[zFindIndex].hasDetail = row.dtl_SrNo ? true : false;
                PurchaseHdr[zFindIndex].ReportDtl.push({
                  SrNo: row.dtl_SrNo,
                  ItemCode: row.dtl_ItemCode,
                  ItemName: row.dtl_ItemName,
                  InwardSeq: row.dtl_InwardSeq,
                  BatchNo: row.dtl_BatchNo,
                  ExpiryDate: row.dtl_ExpiryDate,
                  TotalPurQty: row.dtl_TotalPurQty,
                  CostPrice: parseFloat(row.dtl_CostPrice).toFixed(2),
                  SalePrice: parseFloat(row.dtl_SalePrice).toFixed(2),
                  MRP: parseFloat(row.dtl_MRP).toFixed(2),
                  DiscPer: row.dtl_DiscPer,
                  DiscAmount: parseFloat(row.dtl_DiscAmount).toFixed(2),
                  TaxCode: row.dtl_TaxCode,
                  TaxPerc: row.dtl_TaxPerc,
                  TaxAmount: parseFloat(row.dtl_TaxAmount).toFixed(2),
                  ItemTotalCost: parseFloat(row.dtl_ItemTotalCost).toFixed(2),
                  Amount: parseFloat(row.dtl_Amount).toFixed(2),
                });
              }
            } else {
              PurchaseHdr.push({
                // SrNo: idx + 1,
                VoucherId: row.VoucherId,
                VoucherNo: row.VoucherNo,
                VoucherDate: moment(row.VoucherDate).format(
                  ReportConfig.GeneralInfo.DateFormat
                ),
                SuppId: row.SuppId,
                suppCode: row.suppCode,
                suppName: row.suppName,
                DeliveryChallanNo: row.DeliveryChallanNo,
                DeliveryChallanDate: moment(row.DeliveryChallanDate).format(
                  ReportConfig.GeneralInfo.DateFormat
                ),
                PurchaseBillNo: row.PurchaseBillNo,
                PurchaseBillDate: moment(row.PurchaseBillDate).format(
                  ReportConfig.GeneralInfo.DateFormat
                ),
                EWayBillNo: row.EWayBillNo,
                VehicleNo: row.VehicleNo,
                CreditDays: row.CreditDays,
                GrossAmount: parseFloat(row.GrossAmount).toFixed(2),
                DiscAmount: parseFloat(row.DiscAmount).toFixed(2),
                TaxAmount: parseFloat(row.TaxAmount).toFixed(2),
                MiscAmount: parseFloat(row.MiscAmount).toFixed(2),
                RoundOff: parseFloat(row.RoundOff).toFixed(2),
                NetAmount: parseFloat(row.NetAmount).toFixed(2),
                SettlementAmount: parseFloat(row.SettlementAmount).toFixed(2),
                ReportDtl: [],
                hasDetail: false,
              });
              if (row.dtl_SrNo) {
                PurchaseHdr[PurchaseHdr.length - 1].hasDetail = true;
                PurchaseHdr[PurchaseHdr.length - 1].ReportDtl.push({
                  SrNo: row.dtl_SrNo,
                  ItemCode: row.dtl_ItemCode,
                  ItemName: row.dtl_ItemName,
                  InwardSeq: row.dtl_InwardSeq,
                  BatchNo: row.dtl_BatchNo,
                  ExpiryDate: row.dtl_ExpiryDate,
                  TotalPurQty: row.dtl_TotalPurQty,
                  CostPrice: parseFloat(row.dtl_CostPrice).toFixed(2),
                  SalePrice: parseFloat(row.dtl_SalePrice).toFixed(2),
                  MRP: parseFloat(row.dtl_MRP).toFixed(2),
                  DiscPer: row.dtl_DiscPer,
                  DiscAmount: parseFloat(row.dtl_DiscAmount).toFixed(2),
                  TaxCode: row.dtl_TaxCode,
                  TaxPerc: row.dtl_TaxPerc,
                  TaxAmount: parseFloat(row.dtl_TaxAmount).toFixed(2),
                  ItemTotalCost: parseFloat(row.dtl_ItemTotalCost).toFixed(2),
                  Amount: parseFloat(row.dtl_Amount).toFixed(2),
                });
              }
            }
          });
          PurchaseSummary = {
            TotalGrossAmount: l_TotalGrossAmount.toFixed(2),
            TotalDiscountAmount: l_TotalDiscountAmount.toFixed(2),
            TotalTaxAmount: l_TotalTaxAmount.toFixed(2),
            TotalNetAmount: l_TotalNetAmount.toFixed(2),
          };
        } else {
          resposeMessage = "No data found!";
        }
      } else {
        resposeMessage = "Report config not defined!";
      }
      // console.log(PurchaseHdr[0].ReportDtl, "PurchaseHdr");
      let ReportParams = {
        CompCode: pCompCode,
        BranchCode: pBranchCode,
        DeptCode: pDeptCode,
        FromDate: pFromDate,
        ToDate: pToDate,
        SuppId: pSuppId,
        HideDetail: pHideDetail === "Y" ? true : false,
      };
      var ReportHdr = {
        ReportTitle: `Purchase Register   ${moment(pFromDate).format(
          ReportConfig.GeneralInfo.DateFormat
        )} 
        to ${moment(pToDate).format(ReportConfig.GeneralInfo.DateFormat)}`,
      };
      return {
        message: resposeMessage,
        ReportConfig,
        data: { PurchaseHdr, PurchaseSummary, ReportParams, ReportHdr },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //20210115 hari/Saurav/Siddharth
  async getRPTPurchase(pReportId, pVoucherId, CompCode): Promise<any> {
    const ReportId = pReportId;

    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let PurchaseHdr;
      let PurchaseDtl = [];
      let PurchaseSummary;
      let l_TotalGrossAmount = 0;
      let l_TotalDiscountAmount = 0;
      let l_TotalTaxAmount = 0;
      let l_TotalNetAmount = 0;

      const ReportConfig = await this.getReportInfo(ReportId, CompCode);
      // console.log("ss", ReportConfig);
      //prepare data && fetch data from dynamic stored procedure
      if (ReportConfig.ReportHdr.ReportSource) {
        query = ReportConfig.ReportHdr.ReportSource;
        dynamicRes = await this.conn.query(query, [CompCode, pVoucherId]);
        // console.log(dynamicRes);
        if (dynamicRes[0].length > 0) {
          //set PurchaseHdr

          PurchaseHdr = {
            VoucherId: dynamicRes[0][0].VoucherId,
            VoucherNo: dynamicRes[0][0].VoucherNo,
            VoucherDate: moment(dynamicRes[0][0].VoucherDate).format(
              ReportConfig.GeneralInfo.DateFormat
            ),
            BranchCode: dynamicRes[0][0].BranchCode,
            DeptCode: dynamicRes[0][0].DeptCode,
            SuppId: dynamicRes[0][0].SuppId,
            suppCode: dynamicRes[0][0].suppCode,
            suppName: dynamicRes[0][0].suppName,
            mobileNo: dynamicRes[0][0].mobileNo,
            DeliveryChallanNo: dynamicRes[0][0].DeliveryChallanNo
              ? dynamicRes[0][0].DeliveryChallanNo
              : "-",
            DeliveryChallanDate: moment(
              dynamicRes[0][0].DeliveryChallanDate
            ).format(ReportConfig.GeneralInfo.DateFormat),
            PurchaseBillNo: dynamicRes[0][0].PurchaseBillNo
              ? dynamicRes[0][0].PurchaseBillNo
              : "-",
            PurchaseBillDate:
              dynamicRes[0][0].PurchaseBillDate !== null
                ? moment(dynamicRes[0][0].PurchaseBillDate).format(
                    ReportConfig.GeneralInfo.DateFormat
                  )
                : "-",
            EWayBillNo: dynamicRes[0][0].EWayBillNo,
            VehicleNo: dynamicRes[0][0].VehicleNo,
            CreditDays: dynamicRes[0][0].CreditDays,
            GrossAmount: parseFloat(dynamicRes[0][0].GrossAmount).toFixed(2),
            DiscAmount: parseFloat(dynamicRes[0][0].DiscAmount).toFixed(2),
            TaxAmount: parseFloat(dynamicRes[0][0].TaxAmount).toFixed(2),
            MiscAmount: parseFloat(dynamicRes[0][0].MiscAmount).toFixed(2),
            RoundOff: parseFloat(dynamicRes[0][0].RoundOff).toFixed(2),
            NetAmount: parseFloat(dynamicRes[0][0].NetAmount).toFixed(2),
            SettlementAmount: parseFloat(
              dynamicRes[0][0].SettlementAmount
            ).toFixed(2),
            TotalGrossAmount: l_TotalGrossAmount,
            Remark: dynamicRes[0][0].SysOption1,
            LastModifiedOn: moment(dynamicRes[0][0].LastModifiedOn).format(
              ReportConfig.GeneralInfo.DateTimeFormat
            ),
            LastModifiedBy: dynamicRes[0][0].LastModifiedBy,
          };
          //Set ReportDtl
          dynamicRes[0].forEach(async (row, idx) => {
            l_TotalNetAmount += parseFloat(row.NetAmount);
            l_TotalTaxAmount += parseFloat(row.dtl_TaxAmount);
            l_TotalDiscountAmount += parseFloat(row.dtl_DiscAmount);
            l_TotalGrossAmount += parseFloat(row.GrossAmount);
            PurchaseDtl.push({
              SrNo: idx + 1,
              ItemCode: row.dtl_ItemCode,
              ItemName: row.dtl_ItemName,
              InwardSeq: row.dtl_InwardSeq,
              BatchNo: row.dtl_BatchNo,
              ExpiryDate: row.dtl_ExpiryDate,
              TotalPurQty: parseFloat(row.dtl_TotalPurQty).toFixed(0),
              CostPrice: parseFloat(row.dtl_CostPrice).toFixed(2),
              SalePrice: parseFloat(row.dtl_SalePrice).toFixed(2),
              MRP: parseFloat(row.dtl_MRP).toFixed(2),
              DiscPer: row.dtl_DiscPer,
              DiscAmount: parseFloat(row.dtl_DiscAmount).toFixed(2),
              TaxCode: row.dtl_TaxCode,
              TaxPerc: row.dtl_TaxPerc,
              TaxAmount: parseFloat(row.dtl_TaxAmount).toFixed(2),
              ItemTotalCost: parseFloat(row.dtl_ItemTotalCost).toFixed(2),
              Amount: parseFloat(row.dtl_Amount).toFixed(2),
              GrossAmount: parseFloat(row.GrossAmount).toFixed(2),
              NetAmount: parseFloat(row.NetAmount).toFixed(2),
              FreeQty: parseFloat(row.dtl_FreeQty).toFixed(0),
              Qty: parseFloat(row.dtl_Qty).toFixed(0),
            });
          });
          PurchaseSummary = {
            TotalGrossAmount: l_TotalGrossAmount.toFixed(2),
            TotalTaxAmount: l_TotalTaxAmount.toFixed(2),
            TotalDiscountAmount: l_TotalDiscountAmount.toFixed(2),
            TotalNetAmount: l_TotalNetAmount.toFixed(2),
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
        data: { PurchaseHdr, PurchaseDtl, PurchaseSummary },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getRegisterSales(
    pReportId,
    pCompCode,
    pBranchCode,
    pDeptCode,
    pFromDate,
    pToDate,
    pCustId,
    pHideDetail
  ): Promise<any> {
    const ReportId = pReportId;

    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let SalesSummary;
      let SalesHdr = [];
      let l_TotalGrossAmount = 0;
      let l_TotalDiscountAmount = 0;
      let l_TotalTaxAmount = 0;
      let l_TotalMiscAmount = 0;
      let l_TotalNetAmount = 0;

      const ReportConfig = await this.getReportInfo(ReportId, pCompCode);
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
          pCustId,
          pHideDetail,
        ]);
        // console.log(dynamicRes);
        if (dynamicRes[0].length > 0) {
          //Set ReportDtl
          dynamicRes[0].forEach(async (row, idx) => {
            l_TotalGrossAmount += parseFloat(row.GrossAmount);
            l_TotalDiscountAmount += parseFloat(row.DiscAmount);
            l_TotalTaxAmount += parseFloat(row.TaxAmount);
            l_TotalMiscAmount += parseFloat(row.MiscAmount);
            l_TotalNetAmount += parseFloat(row.NetAmount);
            let zFindIndex = SalesHdr.findIndex(
              (ll) => ll.VoucherId === row.VoucherId
            );
            if (zFindIndex >= 0) {
              if (row.dtl_SrNo) {
                SalesHdr[zFindIndex].hasDetail = row.dtl_SrNo ? true : false;
                SalesHdr[zFindIndex].SalesDtl.push({
                  SrNo: row.dtl_SrNo,
                  ItemCode: row.dtl_ItemCode,
                  ItemName: row.dtl_ItemName,
                  InwardSeq: row.dtl_InwardSeq,
                  BatchNo: row.dtl_BatchNo,
                  ExpiryDate: row.dtl_ExpiryDate,
                  SaleQty: parseFloat(row.dtl_SaleQty).toFixed(0),
                  CostPrice: parseFloat(row.dtl_CostPrice).toFixed(2),
                  SalePrice: parseFloat(row.dtl_SalePrice).toFixed(2),
                  LandingSalePrice: parseFloat(
                    row.dtl_LandingSalePrice
                  ).toFixed(2),
                  SchemeDiscAmount: parseFloat(
                    row.dtl_SchemeDiscAmount
                  ).toFixed(2),
                  SchemeCode: parseFloat(row.dtl_SchemeCode).toFixed(2),
                  MRP: parseFloat(row.dtl_MRP).toFixed(2),
                  DiscPer: row.dtl_DiscPer,
                  DiscAmount: parseFloat(row.dtl_DiscAmount).toFixed(2),
                  TaxCode: row.dtl_TaxCode,
                  TaxPerc: row.dtl_TaxPerc,
                  TaxAmount: parseFloat(row.dtl_TaxAmount).toFixed(2),
                  ItemTotal: parseFloat(row.dtl_ItemTotal).toFixed(2),
                  Amount: parseFloat(row.dtl_Amount).toFixed(2),
                  GrossAmount: parseFloat(row.GrossAmount).toFixed(2),
                  NetAmount: parseFloat(row.NetAmount).toFixed(2),
                });
              }
            } else {
              SalesHdr.push({
                // SrNo: idx + 1,
                VoucherId: row.VoucherId,
                VoucherNo: row.VoucherNo,
                VoucherDate: moment(row.VoucherDate).format(
                  ReportConfig.GeneralInfo.DateFormat
                ),
                BranchCode: row.BranchCode,
                DeptCode: row.DeptCode,
                CustId: row.CustId,
                CustName: row.CustName,
                CustMobile: row.CustMobile,
                CreditDays: row.CreditDays,
                GrossAmount: parseFloat(row.GrossAmount).toFixed(2),
                DiscAmount: parseFloat(row.DiscAmount).toFixed(2),
                SchemeDiscAmount: parseFloat(row.SchemeDiscAmount).toFixed(2),
                TaxAmount: parseFloat(row.TaxAmount).toFixed(2),
                MiscAmount: parseFloat(row.MiscAmount).toFixed(2),
                RoundOff: parseFloat(row.RoundOff).toFixed(2),
                NetAmount: parseFloat(row.NetAmount).toFixed(2),
                SettlementAmount: parseFloat(row.SettlementAmount).toFixed(2),
                Discount: parseFloat(
                  row.DiscAmount + row.SchemeDiscAmount
                ).toFixed(2),
                SalesDtl: [],
                hasDetail: false,
              });
              if (row.dtl_SrNo) {
                SalesHdr[SalesHdr.length - 1].hasDetail = true;
                SalesHdr[SalesHdr.length - 1].SalesDtl.push({
                  SrNo: row.dtl_SrNo,
                  ItemCode: row.dtl_ItemCode,
                  ItemName: row.dtl_ItemName,
                  InwardSeq: row.dtl_InwardSeq,
                  BatchNo: row.dtl_BatchNo,
                  ExpiryDate: row.dtl_ExpiryDate,
                  SaleQty: parseFloat(row.dtl_SaleQty).toFixed(0),
                  CostPrice: parseFloat(row.dtl_CostPrice).toFixed(2),
                  SalePrice: parseFloat(row.dtl_SalePrice).toFixed(2),
                  LandingSalePrice: parseFloat(
                    row.dtl_LandingSalePrice
                  ).toFixed(2),
                  SchemeDiscAmount: parseFloat(
                    row.dtl_SchemeDiscAmount
                  ).toFixed(2),
                  SchemeCode: parseFloat(row.dtl_SchemeCode).toFixed(2),
                  MRP: parseFloat(row.dtl_MRP).toFixed(2),
                  DiscPer: row.dtl_DiscPer,
                  DiscAmount: parseFloat(row.dtl_DiscAmount).toFixed(2),
                  TaxCode: row.dtl_TaxCode,
                  TaxPerc: row.dtl_TaxPerc,
                  TaxAmount: parseFloat(row.dtl_TaxAmount).toFixed(2),
                  ItemTotal: parseFloat(row.dtl_ItemTotal).toFixed(2),
                  Amount: parseFloat(row.dtl_Amount).toFixed(2),
                  GrossAmount: parseFloat(row.GrossAmount).toFixed(2),
                  NetAmount: parseFloat(row.NetAmount).toFixed(2),
                });
              }
            }
          });
          SalesSummary = {
            TotalGrossAmount: l_TotalGrossAmount.toFixed(2),
            TotalTaxAmount: l_TotalTaxAmount.toFixed(2),
            TotalDiscountAmount: l_TotalDiscountAmount.toFixed(2),
            TotalMiscAmount: l_TotalMiscAmount.toFixed(2),
            TotalNetAmount: l_TotalNetAmount.toFixed(2),
          };
          var ReportHdr = {
            ReportTitle: `Sales Register   ${moment(pFromDate).format(
              ReportConfig.GeneralInfo.DateFormat
            )} 
            to ${moment(pToDate).format(ReportConfig.GeneralInfo.DateFormat)}`,
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
        data: { SalesHdr, SalesSummary, ReportHdr },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //20210831
  async getRegisterSalesReturn(
    pReportId,
    pCompCode,
    pBranchCode,
    pDeptCode,
    pFromDate,
    pToDate,
    pCustId,
    pHideDetail
  ): Promise<any> {
    const ReportId = pReportId;

    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let SalesReturnSummary;
      let SalesReturnHdr = [];
      let l_TotalGrossAmount = 0;
      let l_TotalDiscountAmount = 0;
      let l_TotalTaxAmount = 0;
      let l_TotalMiscAmount = 0;
      let l_TotalNetAmount = 0;

      const ReportConfig = await this.getReportInfo(ReportId, pCompCode);
      // console.log(ReportConfig);
      //prepare data && fetch data from dynamic stored procedure
      if (ReportConfig.ReportHdr.ReportSource) {
        query = ReportConfig.ReportHdr.ReportSource;
        dynamicRes = await this.conn.query(query, [
          pCompCode,
          pBranchCode,
          pDeptCode,
          pFromDate,
          pToDate,
          pCustId,
          pHideDetail,
        ]);

        if (dynamicRes[0].length > 0) {
          //Set ReportDtl
          dynamicRes[0].forEach(async (row, idx) => {
            l_TotalGrossAmount += parseFloat(row.GrossAmount);
            l_TotalDiscountAmount += parseFloat(row.DiscAmount);
            l_TotalTaxAmount += parseFloat(row.TaxAmount);
            l_TotalMiscAmount += parseFloat(row.MiscAmount);
            l_TotalNetAmount += parseFloat(row.NetAmount);
            let zFindIndex = SalesReturnHdr.findIndex(
              (ll) => ll.VoucherId === row.VoucherId
            );
            if (zFindIndex >= 0) {
              if (row.dtl_SrNo) {
                SalesReturnHdr[zFindIndex].hasDetail = row.dtl_SrNo
                  ? true
                  : false;
                SalesReturnHdr[zFindIndex].SalesDtl.push({
                  SrNo: row.dtl_SrNo,
                  ItemCode: row.dtl_ItemCode,
                  ItemName: row.dtl_ItemName,
                  InwardSeq: row.dtl_InwardSeq,
                  BatchNo: row.dtl_BatchNo,
                  ExpiryDate: row.dtl_ExpiryDate,
                  SaleQty: parseFloat(row.dtl_SaleQty).toFixed(0),
                  CostPrice: parseFloat(row.dtl_CostPrice).toFixed(2),
                  SalePrice: parseFloat(row.dtl_SalePrice).toFixed(2),
                  LandingSalePrice: parseFloat(
                    row.dtl_LandingSalePrice
                  ).toFixed(2),
                  SchemeDiscAmount: parseFloat(
                    row.dtl_SchemeDiscAmount
                  ).toFixed(2),
                  SchemeCode: parseFloat(row.dtl_SchemeCode).toFixed(2),
                  MRP: parseFloat(row.dtl_MRP).toFixed(2),
                  DiscPer: row.dtl_DiscPer,
                  DiscAmount: parseFloat(row.dtl_DiscAmount).toFixed(2),
                  TaxCode: row.dtl_TaxCode,
                  TaxPerc: row.dtl_TaxPerc,
                  TaxAmount: parseFloat(row.dtl_TaxAmount).toFixed(2),
                  ItemTotal: parseFloat(row.dtl_ItemTotal).toFixed(2),
                  Amount: parseFloat(row.dtl_Amount).toFixed(2),
                  GrossAmount: parseFloat(row.GrossAmount).toFixed(2),
                  NetAmount: parseFloat(row.NetAmount).toFixed(2),
                });
              }
            } else {
              SalesReturnHdr.push({
                // SrNo: idx + 1,
                VoucherId: row.VoucherId,
                VoucherNo: row.VoucherNo,
                VoucherDate: moment(row.VoucherDate).format(
                  ReportConfig.GeneralInfo.DateFormat
                ),
                BranchCode: row.BranchCode,
                DeptCode: row.DeptCode,
                CustId: row.CustId,
                CustName: row.CustName,
                CustMobile: row.CustMobile,
                CreditDays: row.CreditDays,
                GrossAmount: parseFloat(row.GrossAmount).toFixed(2),
                DiscAmount: parseFloat(row.DiscAmount).toFixed(2),
                SchemeDiscAmount: parseFloat(row.SchemeDiscAmount).toFixed(2),
                TaxAmount: parseFloat(row.TaxAmount).toFixed(2),
                MiscAmount: parseFloat(row.MiscAmount).toFixed(2),
                RoundOff: parseFloat(row.RoundOff).toFixed(2),
                NetAmount: parseFloat(row.NetAmount).toFixed(2),
                SettlementAmount: parseFloat(row.SettlementAmount).toFixed(2),
                Discount: parseFloat(
                  row.DiscAmount + row.SchemeDiscAmount
                ).toFixed(2),
                SalesReturnDtl: [],
                hasDetail: false,
              });
              if (row.dtl_SrNo) {
                SalesReturnHdr[SalesReturnHdr.length - 1].hasDetail = true;
                SalesReturnHdr[SalesReturnHdr.length - 1].SalesReturnDtl.push({
                  SrNo: row.dtl_SrNo,
                  ItemCode: row.dtl_ItemCode,
                  ItemName: row.dtl_ItemName,
                  InwardSeq: row.dtl_InwardSeq,
                  BatchNo: row.dtl_BatchNo,
                  ExpiryDate: row.dtl_ExpiryDate,
                  SaleQty: parseFloat(row.dtl_SaleQty).toFixed(0),
                  CostPrice: parseFloat(row.dtl_CostPrice).toFixed(2),
                  SalePrice: parseFloat(row.dtl_SalePrice).toFixed(2),
                  LandingSalePrice: parseFloat(
                    row.dtl_LandingSalePrice
                  ).toFixed(2),
                  SchemeDiscAmount: parseFloat(
                    row.dtl_SchemeDiscAmount
                  ).toFixed(2),
                  SchemeCode: parseFloat(row.dtl_SchemeCode).toFixed(2),
                  MRP: parseFloat(row.dtl_MRP).toFixed(2),
                  DiscPer: row.dtl_DiscPer,
                  DiscAmount: parseFloat(row.dtl_DiscAmount).toFixed(2),
                  TaxCode: row.dtl_TaxCode,
                  TaxPerc: row.dtl_TaxPerc,
                  TaxAmount: parseFloat(row.dtl_TaxAmount).toFixed(2),
                  ItemTotal: parseFloat(row.dtl_ItemTotal).toFixed(2),
                  Amount: parseFloat(row.dtl_Amount).toFixed(2),
                  GrossAmount: parseFloat(row.GrossAmount).toFixed(2),
                  NetAmount: parseFloat(row.NetAmount).toFixed(2),
                });
              }
            }
          });
          SalesReturnSummary = {
            TotalGrossAmount: l_TotalGrossAmount.toFixed(2),
            TotalTaxAmount: l_TotalTaxAmount.toFixed(2),
            TotalDiscountAmount: l_TotalDiscountAmount.toFixed(2),
            TotalMiscAmount: l_TotalMiscAmount.toFixed(2),
            TotalNetAmount: l_TotalNetAmount.toFixed(2),
          };
          var ReportHdr = {
            ReportTitle: `Sales Return Register   ${moment(pFromDate).format(
              ReportConfig.GeneralInfo.DateFormat
            )} 
            to ${moment(pToDate).format(ReportConfig.GeneralInfo.DateFormat)}`,
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
        data: { SalesReturnHdr, SalesReturnSummary, ReportHdr },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //20210116 Siddharth
  async getRPTSales(pReportId, pVoucherId, pCompCode): Promise<any> {
    const ReportId = pReportId;

    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let SaleHdr;
      let SaleDtl = [];
      let SaleSummary;
      let l_TotalGrossAmount = 0;
      let l_TotalDiscountAmount = 0;
      let l_TotalTaxAmount = 0;
      let l_TotalNetAmount = 0;
      let l_TotalSaleQty = 0;
      let l_TotalAmount = 0;
      let l_TotalSavedAmount = 0;
      // let zFindIndex = SaleHdr.findIndex(
      //   (ll) => ll.VoucherId === dynamicRes[0][0].VoucherId
      // );

      const ReportConfig = await this.getReportInfo(ReportId, pCompCode);

      //prepare data && fetch data from dynamic stored procedure
      if (ReportConfig.ReportHdr.ReportSource) {
        query = ReportConfig.ReportHdr.ReportSource;
        dynamicRes = await this.conn.query(query, [pCompCode, pVoucherId]);
        // console.log(dynamicRes[0]);

        if (dynamicRes[0].length > 0) {
          //set PurchaseHdr
          SaleHdr = {
            VoucherId: dynamicRes[0][0].VoucherId,
            VoucherNo: dynamicRes[0][0].VoucherNo,
            VoucherDate: moment(dynamicRes[0][0].crt_dttm).format(
              ReportConfig.GeneralInfo.DateTimeFormat
            ),
            BranchCode: dynamicRes[0][0].BranchCode,
            DeptCode: dynamicRes[0][0].DeptCode,
            CustId: dynamicRes[0][0].CustId,
            CustName:
              dynamicRes[0][0].CustName === null
                ? "Cash Sale"
                : dynamicRes[0][0].CustName,
            CustMobile: dynamicRes[0][0].CustMobile,
            CustBillingAddressId: dynamicRes[0][0].CustBillingAddressId,
            CustDeliveryAddressId: dynamicRes[0][0].CustDeliveryAddressId,
            CreditDays: dynamicRes[0][0].CreditDays,
            GrossAmount: parseFloat(dynamicRes[0][0].GrossAmount).toFixed(2),
            DiscAmount: parseFloat(dynamicRes[0][0].DiscAmount).toFixed(2),
            SchemeDiscAmount: parseFloat(
              dynamicRes[0][0].SchemeDiscAmount
            ).toFixed(0),
            TaxAmount: parseFloat(dynamicRes[0][0].TaxAmount).toFixed(2),
            MiscAmount: parseFloat(dynamicRes[0][0].MiscAmount).toFixed(2),
            RoundOff: parseFloat(dynamicRes[0][0].RoundOff).toFixed(2),
            NetAmount: parseFloat(dynamicRes[0][0].NetAmount).toFixed(2),
            SettlementAmount: parseFloat(
              dynamicRes[0][0].SettlementAmount
            ).toFixed(2),
            TotalGrossAmount: l_TotalGrossAmount,
            hasCustomer: _.includes(
              [null, "", undefined],
              dynamicRes[0][0].CustName
            )
              ? false
              : true,
          };
          //Set ReportDtl
          dynamicRes[0].forEach(async (row, idx) => {
            l_TotalSaleQty += parseFloat(row.dtl_SaleQty);
            l_TotalAmount += parseFloat(row.dtl_Amount);
            l_TotalTaxAmount += parseFloat(row.dtl_TaxAmount);
            l_TotalDiscountAmount += parseFloat(row.dtl_DiscAmount);
            l_TotalGrossAmount += parseFloat(row.GrossAmount);
            l_TotalSavedAmount +=
              parseFloat(row.dtl_MRP) +
              parseFloat(row.DiscAmount) -
              parseFloat(row.dtl_SalePrice);
            l_TotalNetAmount = parseFloat(row.NetAmount);
            // SaleHdr[SaleHdr.length - 1].hasDetail = true;
            SaleDtl.push({
              SrNo: row.dtl_SrNo,
              ItemCode: row.dtl_ItemCode,
              ItemName: row.dtl_ItemName,
              ItemNamePrint: _.truncate(row.dtl_ItemName, {
                length: 20,
                omission: "..",
              }),
              InwardSeq: row.dtl_InwardSeq,
              BatchNo: row.dtl_BatchNo,
              ExpiryDate: row.dtl_ExpiryDate,
              SaleQty: _.concat(
                _.round(parseFloat(row.dtl_SaleQty), 2) + " " + row.dtl_Unit
              ),
              SaleUnit: row.dtl_Unit,
              CostPrice: parseFloat(row.dtl_CostPrice).toFixed(0),
              SalePrice: parseFloat(row.dtl_SalePrice).toFixed(0),
              LandingSalePrice: parseFloat(row.dtl_LandingSalePrice).toFixed(2),
              SchemeDiscAmount: parseFloat(row.dtl_SchemeDiscAmount).toFixed(2),
              SchemeCode: parseFloat(row.dtl_SchemeCode).toFixed(2),
              MRP: parseFloat(row.dtl_MRP).toFixed(0),
              DiscPer: row.dtl_DiscPer,
              DiscAmount: parseFloat(row.dtl_DiscAmount).toFixed(0),
              TaxCode: row.dtl_TaxCode,
              TaxPerc: row.dtl_TaxPerc,
              TaxAmount: parseFloat(row.dtl_TaxAmount).toFixed(0),
              ItemTotal: parseFloat(row.dtl_ItemTotal).toFixed(2),
              Amount: parseFloat(row.dtl_Amount).toFixed(0),
              GrossAmount: parseFloat(row.GrossAmount).toFixed(2),
              NetAmount: parseFloat(row.NetAmount).toFixed(2),
              // hasDetail: SavedAmount: ,
            });
          });
          SaleSummary = {
            TotalSaleQty: l_TotalSaleQty.toFixed(0),
            TotalAmount: l_TotalAmount.toFixed(0),
            TotalGrossAmount: l_TotalGrossAmount.toFixed(0),
            TotalTaxAmount: l_TotalTaxAmount.toFixed(0),
            TotalDiscountAmount: l_TotalDiscountAmount.toFixed(0),
            TotalNetAmount: l_TotalNetAmount.toFixed(0),
            TotalSaveAmount: l_TotalSavedAmount.toFixed(0),
          };
        } else {
          resposeMessage = "No data found!";
        }
      } else {
        resposeMessage = "Report config not defined!";
      }
      // console.log(SaleHdr, SaleDtl[0], SaleSummary, "ReportConfig");
      return {
        message: resposeMessage,
        ReportConfig,
        data: { SaleHdr, SaleDtl, SaleSummary },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //20210118 Saurav
  async getRegisterAdjustments(
    pReportId,
    pCompCode,
    pBranchCode,
    pDeptCode,
    pFromDate,
    pToDate,
    pReasonCode,
    pHideDetail
  ): Promise<any> {
    const ReportId = pReportId;

    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let AdjustmentsSummary;
      let AdjustmentsHdr = [];

      const ReportConfig = await this.getReportInfo(ReportId, pCompCode);
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
          pReasonCode,
          pHideDetail,
        ]);
        // console.log(dynamicRes);
        if (dynamicRes[0].length > 0) {
          //Set ReportDtl
          dynamicRes[0].forEach(async (row, idx) => {
            let zFindIndex = AdjustmentsHdr.findIndex(
              (ll) => ll.VoucherId === row.VoucherId
            );
            if (zFindIndex >= 0) {
              if (row.dtlSrNo) {
                AdjustmentsHdr[zFindIndex].hasDetail = row.dtlSrNo
                  ? true
                  : false;
                AdjustmentsHdr[zFindIndex].totalCostPrice =
                  parseFloat(AdjustmentsHdr[zFindIndex].totalCostPrice) +
                  parseFloat(row.CostPrice).toFixed(2);
                AdjustmentsHdr[zFindIndex].AdjustmentsDtl.push({
                  SrNo: row.dtlSrNo,
                  ItemCode: row.dtlItemCode,
                  ItemName: row.dtlItemName,
                  InwardSeq: row.InwardSeq,
                  BatchNo: row.BatchNo,
                  ExpiryDate: row.ExpiryDate,
                  Qty: parseFloat(row.Qty).toFixed(0),
                  CostPrice: parseFloat(row.CostPrice).toFixed(2),
                  SalePrice: parseFloat(row.SalePrice).toFixed(2),
                  MRP: parseFloat(row.MRP).toFixed(2),
                  CostAmount: parseFloat(row.CostAmount).toFixed(2),
                  Remark: row.Remark,
                  dataExist: true,
                });
              }
            } else {
              AdjustmentsHdr.push({
                // SrNo: idx + 1,
                VoucherId: row.VoucherId,
                VoucherNo: row.VoucherNo,
                VoucherDate: moment(row.VoucherDate).format(
                  ReportConfig.GeneralInfo.DateFormat
                ),
                BranchCode: row.BranchCode,
                DeptCode: row.DeptCode,
                Reason: row.Reason,
                // ReasonCode: row.ReasonCode,
                // AdjustmentType: row.AdjustmentType,
                Remark: row.Remark,
                AdjustmentsDtl: [],
                hasDetail: false,
                totalCostPrice: 0,
              });
              if (row.dtlSrNo) {
                AdjustmentsHdr[AdjustmentsHdr.length - 1].hasDetail = true;
                AdjustmentsHdr[
                  AdjustmentsHdr.length - 1
                ].totalCostPrice = parseFloat(row.CostPrice).toFixed(2);
                // console.log(AdjustmentsHdr[AdjustmentsHdr.length - 1].totalCostPrice, "text")
                AdjustmentsHdr[AdjustmentsHdr.length - 1].AdjustmentsDtl.push({
                  SrNo: row.dtlSrNo,
                  ItemCode: row.dtlItemCode,
                  ItemName: row.dtlItemName,
                  InwardSeq: row.InwardSeq,
                  BatchNo: row.BatchNo,
                  ExpiryDate: row.ExpiryDate,
                  Qty: parseFloat(row.Qty).toFixed(0),
                  CostPrice: parseFloat(row.CostPrice).toFixed(2),
                  SalePrice: parseFloat(row.SalePrice).toFixed(2),
                  MRP: parseFloat(row.MRP).toFixed(2),
                  CostAmount: parseFloat(row.CostAmount).toFixed(2),
                  Remark: row.Remark,
                  dataExist: zFindIndex >= 0 ? true : false,
                });
              }
            }
          });
          AdjustmentsSummary = {
            ReportTitle: `Stock Adjustment Register Dated ${moment(
              pFromDate
            ).format(ReportConfig.GeneralInfo.DateFormat)} to ${moment(
              pToDate
            ).format(ReportConfig.GeneralInfo.DateFormat)}`,
            hasDetail: pHideDetail === "Y" ? false : true,
          };
        } else {
          resposeMessage = "No data found!";
        }
      } else {
        resposeMessage = "Report config not defined!";
      }
      // console.log(AdjustmentsHdr);
      return {
        message: resposeMessage,
        ReportConfig,
        data: { AdjustmentsHdr, AdjustmentsSummary },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //20210118 Siddharth
  async getRPTDataAdjustment(pReportId, pVoucherId, CompCode): Promise<any> {
    const ReportId = pReportId;

    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let AdjustmentsHdr;
      let AdjustmentsDtl = [];
      let AdjustmentsSummary;

      const ReportConfig = await this.getReportInfo(ReportId, CompCode);
      // console.log("ss", ReportConfig);
      //prepare data && fetch data from dynamic stored procedure
      if (ReportConfig.ReportHdr.ReportSource) {
        query = ReportConfig.ReportHdr.ReportSource;
        dynamicRes = await this.conn.query(query, [CompCode, pVoucherId]);
        // console.log(dynamicRes);
        if (dynamicRes[0].length > 0) {
          //set PurchaseHdr
          AdjustmentsHdr = {
            VoucherId: dynamicRes[0][0].VoucherId,
            VoucherNo: dynamicRes[0][0].VoucherNo,
            VoucherDate: moment(dynamicRes[0][0].VoucherDate).format(
              ReportConfig.GeneralInfo.DateFormat
            ),
            BranchCode: dynamicRes[0][0].BranchCode,
            DeptCode: dynamicRes[0][0].DeptCode,
            ReasonCode: dynamicRes[0][0].ReasonCode,
            AdjustmentType: dynamicRes[0][0].AdjustmentType,
            Remark: dynamicRes[0][0].Remark,
            LastModifiedOn: moment(dynamicRes[0][0].LastModifiedOn).format(
              "DD-MM-YYYY hh:mm:ss"
            ),
            LastModifiedBy: dynamicRes[0][0].LastModifiedBy,
            Reason: dynamicRes[0][0].Reason,
          };
          //Set ReportDtl
          dynamicRes[0].forEach(async (row, idx) => {
            AdjustmentsDtl.push({
              RIType: row.RIType,
              SrNo: row.dtlSrNo,
              ItemCode: row.dtlItemCode,
              ItemName: row.dtlItemName,
              InwardSeq: row.InwardSeq,
              BatchNo: row.BatchNo,
              ExpiryDate: row.ExpiryDate,
              Qty: parseFloat(row.Qty),
              CostPrice: parseFloat(row.CostPrice).toFixed(2),
              SalePrice: parseFloat(row.SalePrice).toFixed(2),
              MRP: parseFloat(row.MRP).toFixed(2),
              CostAmount: parseFloat(row.CostAmount).toFixed(2),
              Remark: parseFloat(row.Remark).toFixed(2),
            });
          });
          AdjustmentsSummary = {
            ReportTitle: `Stock Adjustment Receipt`,
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
        data: { AdjustmentsHdr, AdjustmentsDtl, AdjustmentsSummary },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getDataRPTReprocessing(pReportId, pVoucherId, CompCode): Promise<any> {
    const ReportId = pReportId;

    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let ReprocessingHdr;
      let ReprocessingDtl = [];
      let ReprocessingSummary;

      const ReportConfig = await this.getReportInfo(ReportId, CompCode);
      // console.log("ss", ReportConfig);
      //prepare data && fetch data from dynamic stored procedure
      if (ReportConfig.ReportHdr.ReportSource) {
        query = ReportConfig.ReportHdr.ReportSource;
        dynamicRes = await this.conn.query(query, [CompCode, pVoucherId]);
        if (dynamicRes[0].length > 0) {
          //set PurchaseHdr

          ReprocessingHdr = {
            VoucherId: dynamicRes[0][0].VoucherId,
            VoucherNo: dynamicRes[0][0].VoucherNo,
            VoucherDate: moment(dynamicRes[0][0].VoucherDate).format(
              ReportConfig.GeneralInfo.DateFormat
            ),
            BranchCode: dynamicRes[0][0].BranchCode,
            DeptCode: dynamicRes[0][0].DeptCode,
            Reason: dynamicRes[0][0].Reason,
          };
          //Set ReportDtl
          dynamicRes[0].forEach(async (row, idx) => {
            ReprocessingDtl.push({
              RIType: row.RIType,
              SrNo: row.dtlSrNo,
              ItemCode: row.dtlItemCode,
              ItemName: row.dtlItemName,
              InwardSeq: row.InwardSeq,
              BatchNo: row.BatchNo,
              ExpiryDate: row.ExpiryDate,
              Qty: Math.abs(parseFloat(row.Qty)),
              CostPrice: parseFloat(row.CostPrice).toFixed(2),
              SalePrice: parseFloat(row.SalePrice).toFixed(2),
              MRP: parseFloat(row.MRP).toFixed(2),
              CostAmount: parseFloat(row.CostAmount).toFixed(2),
              Remark: row.Remark,
            });
          });
          ReprocessingSummary = {
            ReportTitle: `Stock Reprocessing Receipt`,
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
        data: { ReprocessingHdr, ReprocessingDtl, ReprocessingSummary },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
  //20210118 Saurav
  async getRegisterReprocessing(
    pReportId,
    pCompCode,
    pBranchCode,
    pDeptCode,
    pFromDate,
    pToDate,
    pReasonCode,
    pHideDetail
  ): Promise<any> {
    const ReportId = pReportId;

    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let ReprocessingSummary;
      let ReprocessingHdr = [];

      const ReportConfig = await this.getReportInfo(ReportId, pCompCode);
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
          pReasonCode,
          pHideDetail,
        ]);
        // console.log(dynamicRes);
        if (dynamicRes[0].length > 0) {
          //Set ReportDtl
          dynamicRes[0].forEach(async (row, idx) => {
            let zFindIndex = ReprocessingHdr.findIndex(
              (ll) => ll.VoucherId === row.VoucherId
            );
            if (zFindIndex >= 0) {
              if (row.dtlSrNo) {
                ReprocessingHdr[zFindIndex].hasDetail = row.dtlSrNo
                  ? true
                  : false;
                ReprocessingHdr[zFindIndex].ReprocessingDtl.push({
                  SrNo: row.dtlSrNo,
                  ItemCode: row.dtlItemCode,
                  ItemName: row.dtlItemName,
                  RIType: row.RIType,
                  InwardSeq: row.InwardSeq,
                  BatchNo: row.BatchNo,
                  ExpiryDate: row.ExpiryDate,
                  Qty: parseFloat(row.Qty),
                  CostPrice: parseFloat(row.CostPrice).toFixed(2),
                  SalePrice: parseFloat(row.SalePrice).toFixed(2),
                  MRP: parseFloat(row.MRP).toFixed(2),
                  CostAmount: parseFloat(row.CostAmount).toFixed(2),
                  Remark: row.Remark,
                });
              }
            } else {
              ReprocessingHdr.push({
                // SrNo: idx + 1,
                VoucherId: row.VoucherId,
                VoucherNo: row.VoucherNo,
                VoucherDate: moment(row.VoucherDate).format(
                  ReportConfig.GeneralInfo.DateFormat
                ),
                BranchCode: row.BranchCode,
                DeptCode: row.DeptCode,
                Reason: row.Reason,
                // ReasonCode: row.ReasonCode,
                // AdjustmentType: row.AdjustmentType,
                Remark: row.Remark,
                ReprocessingDtl: [],
                hasDetail: false,
              });
              if (row.dtlSrNo) {
                ReprocessingHdr[ReprocessingHdr.length - 1].hasDetail = true;
                ReprocessingHdr[
                  ReprocessingHdr.length - 1
                ].ReprocessingDtl.push({
                  SrNo: row.dtlSrNo,
                  ItemCode: row.dtlItemCode,
                  ItemName: row.dtlItemName,
                  RIType: row.RIType,
                  InwardSeq: row.InwardSeq,
                  BatchNo: row.BatchNo,
                  ExpiryDate: row.ExpiryDate,
                  Qty: parseFloat(row.Qty),
                  CostPrice: parseFloat(row.CostPrice).toFixed(2),
                  SalePrice: parseFloat(row.SalePrice).toFixed(2),
                  MRP: parseFloat(row.MRP).toFixed(2),
                  CostAmount: parseFloat(row.CostAmount).toFixed(2),
                  Remark: row.Remark,
                });
              }
            }
          });
          ReprocessingSummary = {
            ReportTitle: `Stock Reprocessing Register Dated ${moment(
              pFromDate
            ).format(ReportConfig.GeneralInfo.DateFormat)} to ${moment(
              pToDate
            ).format(ReportConfig.GeneralInfo.DateFormat)}`,
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
        data: { ReprocessingHdr, ReprocessingSummary },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //20210118 Saurav
  async getDataRegisterINVOpeningStock(
    pReportId,
    pCompCode,
    pBranchCode,
    pDeptCode
  ): Promise<any> {
    const ReportId = pReportId;

    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let OpeningStockSummary;
      let OpeningStockDtl = [];
      let OpeningStockHdr = null;

      const ReportConfig = await this.getReportInfo(ReportId, pCompCode);
      // console.log("ss", pReportId, pCompCode, pBranchCode, pDeptCode);
      //prepare data && fetch data from dynamic stored procedure
      if (ReportConfig.ReportHdr.ReportSource) {
        query = ReportConfig.ReportHdr.ReportSource;
        dynamicRes = await this.conn.query(query, [
          pCompCode,
          pBranchCode,
          pDeptCode,
        ]);
        if (dynamicRes[0].length > 0) {
          //set PurchaseHdr

          dynamicRes[0].forEach(async (row, idx) => {
            // console.log("1");
            OpeningStockDtl.push({
              SrNo: idx + 1,
              CompCode: row.CompCode,
              BranchCode: row.BranchCode,
              DeptCode: row.DeptCode,
              ItemCode: row.ItemCode,
              ItemDesc: row.ItemDesc.replace(/'/gi, " "),
              ItemName: row.ItemName,
              SubCategory: row.SubCategory,
              Category: row.Category,
              InwardSeq: row.InwardSeq,
              BatchNo: row.BatchNo,
              ExpiryDate: row.ExpiryDate,
              Rate:
                row.Rate === null ? "0.00" : parseFloat(row.Rate).toFixed(2),
              LRate:
                row.LRate === null ? "0.00" : parseFloat(row.LRate).toFixed(2),
              Amount:
                row.Amount === null
                  ? "0.00"
                  : parseFloat(row.Amount).toFixed(2),
              SaleRate:
                row.SaleRate === null
                  ? "0.00"
                  : parseFloat(row.SaleRate).toFixed(2),
              MRP: row.MRP === null ? "0.00" : parseFloat(row.MRP).toFixed(2),
              TaxAmount:
                row.TaxAmount === null
                  ? "0.00"
                  : parseFloat(row.TaxAmount).toFixed(2),
              Qty: row.Qty === null ? "0.00" : parseFloat(row.Qty),
              Remark: row.Remark,
              TaxCode: row.TaxCode,
              TaxPerc: row.TaxPerc,
            });
          });
          OpeningStockSummary = {
            ReportTitle: `Inventory Opening Stock Register`,
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
        data: { OpeningStockHdr, OpeningStockSummary, OpeningStockDtl },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //govind
  async getRegisterStockOutUnsold(pReportId, CompCode): Promise<any> {
    const ReportId = pReportId;

    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let ReportSummary;
      let AdjustmentsHdr = [];
      let l_Qty = 0;
      let l_EstimatedAmount = 0;
      let l_ActualAmount = 0;
      let l_Diff = 0;

      const ReportConfig = await this.getReportInfo(ReportId, CompCode);
      // console.log("ss", ReportConfig);
      //prepare data && fetch data from dynamic stored procedure
      if (ReportConfig.ReportHdr.ReportSource) {
        query = ReportConfig.ReportHdr.ReportSource;
        dynamicRes = await this.conn.query(query, [CompCode]);
        // console.log(dynamicRes);
        if (dynamicRes[0].length > 0) {
          //Set ReportDtl
          dynamicRes[0].forEach(async (row, idx) => {
            l_Qty += parseFloat(row.Qty);
            l_EstimatedAmount += parseFloat(row.EstimatedAmount);
            l_ActualAmount += parseFloat(row.ActualAmount);
            l_Diff += Math.abs(parseFloat(row.Diff));

            AdjustmentsHdr.push({
              // SrNo: idx + 1,
              VoucherId: row.VoucherId,
              VoucherNo: row.VoucherNo,
              VoucherDate: moment(row.VoucherDate).format(
                ReportConfig.GeneralInfo.DateFormat
              ),

              BoxNo: row.BoxNo,
              TotalWeight: parseFloat(row.TotalWeight).toFixed(2),
              dtlSrNo: row.dtlSrNo,
              dtlItemCode: row.dtlItemCode,
              dtlItemName: row.dtlItemName,
              Qty: parseFloat(row.Qty).toFixed(0),
              PacketNo: row.PacketNo,
              Weight: parseFloat(row.Weight).toFixed(2),
              ES: parseFloat(row.ES).toFixed(0),
              DeliveryStatus: row.DeliveryStatus,
              DOD: parseFloat(row.DOB).toFixed(0),
              EstimatedAmount: parseFloat(row.EstimatedAmount).toFixed(0),
              ActualSalePrice: parseFloat(row.ActualSalePrice).toFixed(0),
              ActualAmount: parseFloat(row.ActualAmount).toFixed(0),
              Diff: Math.abs(row.Diff).toFixed(0),
              SoldStatus: row.SoldStatus,
            });
          });
          ReportSummary = {
            TotalQty: l_Qty,
            TotalEstimatedAmount: l_EstimatedAmount.toFixed(2),
            TotalActualAmount: l_ActualAmount.toFixed(2),
            TotalDiff: l_Diff.toFixed(2),
          };
          // console.log(ReportSummary, "summary");

          var AdjustmentsSummary = {
            ReportTitle: "Stock Out Unsold",
          };
        } else {
          resposeMessage = "No data found!";
        }
      } else {
        resposeMessage = "Report config not defined!";
      }
      // console.log(AdjustmentsHdr);
      return {
        message: resposeMessage,
        ReportConfig,
        data: { AdjustmentsHdr, ReportSummary, AdjustmentsSummary },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //20210308 Saurav
  async getDataBankWalletGatewayBookDetail(
    CompCode,
    pReportId,
    pPayCode,
    pFromDate,
    pToDate
  ): Promise<any> {
    const ReportId = pReportId;

    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let BankWalletGatewayBookSummary;
      let BankWalletGatewayBookDtl = [];
      let BankWalletGatewayBookHdr;

      let l_TotalDebit = 0;
      let l_TotalCredit = 0;

      const ReportConfig = await this.getReportInfo(ReportId, CompCode);

      //prepare data && fetch data from dynamic stored procedure
      if (ReportConfig.ReportHdr.ReportSource) {
        query = ReportConfig.ReportHdr.ReportSource;
        dynamicRes = await this.conn.query(query, [
          pPayCode,
          pFromDate,
          pToDate,
        ]);
        if (dynamicRes[0].length > 0) {
          BankWalletGatewayBookHdr = {
            PayDesc: dynamicRes[1][0].PayDesc,
            OpeningBalance: Math.abs(dynamicRes[1][0].OpeningBalance).toFixed(
              2
            ),
            IsPaymentGateway: dynamicRes[1][0].IsPaymentGateway,
            PaymentGatewayComp: dynamicRes[1][0].PaymentGatewayComp,
            PrimaryPayCode: dynamicRes[1][0].PrimaryPayCode,
            AccountNo:
              dynamicRes[1][0].PaymentType === "BANK"
                ? _.includes(
                    [null, undefined, "", NaN],
                    dynamicRes[1][0].SysOption1
                  )
                  ? false
                  : dynamicRes[1][0].SysOption1
                : false,
            CompanyName:
              dynamicRes[1][0].PaymentType === "GATEWAY" || "WALLET"
                ? _.includes(
                    [null, undefined, "", NaN],
                    dynamicRes[1][0].SysOption1
                  )
                  ? false
                  : dynamicRes[1][0].SysOption1
                : false,
            Beneficiary:
              dynamicRes[1][0].PaymentType === "BANK"
                ? _.includes(
                    [null, undefined, "", NaN],
                    dynamicRes[1][0].SysOption2
                  )
                  ? false
                  : dynamicRes[1][0].SysOption2
                : false,
            IFSCCode:
              dynamicRes[1][0].PaymentType === "BANK"
                ? _.includes(
                    [null, undefined, "", NaN],
                    dynamicRes[1][0].SysOption3
                  )
                  ? false
                  : dynamicRes[1][0].SysOption3
                : false,
            PaymentType: dynamicRes[1][0].PaymentType,
            IsActive: dynamicRes[1][0].IsActive,
            AsOfBalance: moment(dynamicRes[1][0].AsOfBalance).format(
              ReportConfig.GeneralInfo.DateFormat
            ),
          };
          //Set ReportDtl
          dynamicRes[0].forEach(async (row, idx) => {
            l_TotalDebit += parseFloat(row.Debit);
            l_TotalCredit += parseFloat(row.Credit);

            await BankWalletGatewayBookDtl.push({
              SrNo: idx + 1,
              TranType: row.TranType,
              TranTypeDesc: row.TranTypeDesc,
              TranId: row.TranId,
              DType: row.DType,
              RefNo: row.RefNo,
              RefDesc: row.RefDesc,
              TranDate: row.TranDate
                ? moment(row.TranDate).format(
                    ReportConfig.GeneralInfo.DateFormat
                  )
                : null,
              TranNo: row.TranNo,
              Debit:
                parseFloat(row.Debit) === 0
                  ? "-"
                  : parseFloat(row.Debit).toFixed(2),
              Credit:
                parseFloat(row.Credit) === 0
                  ? "-"
                  : parseFloat(row.Credit).toFixed(2),
              Remark: row.Remark,
              Particulars: `${row.RefDesc} (${row.Remark})`,
              LastModifiedBy: row.LastModifiedBy,
              LastModifiedOn: row.LastModifiedOn
                ? moment(row.LastModifiedOn).format(
                    ReportConfig.GeneralInfo.DateTimeFormat
                  )
                : null,
              OriginalSource: row.OriginPaymentSource,
              // PayDesc: row.PayDesc
            });
          });

          BankWalletGatewayBookSummary = {
            ReportTitle: `${
              dynamicRes[1][0].PaymentType === "BANK" || "GATEWAY" || "WALLET"
                ? `Bank Book Statement Dated`
                : dynamicRes[1][0].PaymentType === "CASH"
                ? "Cash Book Statement Dated"
                : ""
            } 
            ${moment(pFromDate).format(ReportConfig.GeneralInfo.DateFormat)} 
            to ${moment(pToDate).format(ReportConfig.GeneralInfo.DateFormat)}`,
            TotalDebit: l_TotalDebit.toFixed(2),
            TotalCredit: l_TotalCredit.toFixed(2),
            ClosingBalanceDebit: (l_TotalDebit - l_TotalCredit > 0
              ? l_TotalDebit - l_TotalCredit
              : 0
            ).toFixed(2),
            ClosingBalanceCredit: (l_TotalCredit - l_TotalDebit > 0
              ? l_TotalCredit - l_TotalDebit
              : 0
            ).toFixed(2),
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
        data: {
          BankWalletGatewayBookSummary,
          BankWalletGatewayBookDtl,
          BankWalletGatewayBookHdr,
        },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async InvGetDataMKStockValuation(
    pReportId,
    CompCode,
    pFromDate,
    pToDate,
    pToDateDOD,
    pFromDateDOD,
    pBoxNo,
    pPacketNo,
    pDeliveryStatus
  ): Promise<any> {
    const ReportId = pReportId;

    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let ReportGroup = [];
      const ReportConfig = await this.getReportInfo(ReportId, CompCode);

      let ReportFinalSummary;
      //prepare data && fetch data from dynamic stored procedure
      if (ReportConfig.ReportHdr.ReportSource) {
        query = ReportConfig.ReportHdr.ReportSource;
        // console.log(query);
        dynamicRes = await this.conn.query(query, [
          CompCode,
          pFromDate,
          pToDate,
          pToDateDOD,
          pFromDateDOD,
          pBoxNo,
          pPacketNo,
          pDeliveryStatus,
        ]);

        let ReportData = [];
        dynamicRes[0].forEach((row) => {
          let l_idx = ReportData.findIndex((oo) => oo.BoxNo === row.BoxNo);
          if (l_idx >= 0) {
            ReportData[l_idx].details.push({
              ...row,
            });
          } else {
            ReportData.push({
              BoxNo: row.BoxNo,
              VoucherId: row.VoucherId,
              VoucherNo: row.VoucherNo ? row.VoucherNo : "-",
              VoucherDate: row.VoucherDate
                ? moment(row.VoucherDate).format(
                    ReportConfig.GeneralInfo.DateFormat
                  )
                : null,
              details: [
                {
                  ...row,
                },
              ],
            });
          }
        });

        for (let kk = 0; kk < ReportData.length; kk++) {
          let total_Qty = 0;
          let actual_total_Weight = 0;
          let total_EstAmt = 0;
          let total_ActualAmt = 0;
          let total_Diff = 0;
          let total_CostAmount = 0;
          let total_SaleAmount = 0;

          ReportData[kk].details.forEach((row, idx) => {
            ///summary

            total_Qty = parseFloat(row.Qty)
              ? parseFloat(row.Qty) + total_Qty
              : 0;
            actual_total_Weight = parseFloat(row.Weight)
              ? parseFloat(row.Weight) + actual_total_Weight
              : 0;
            total_EstAmt = parseFloat(row.EstimatedAmount)
              ? parseFloat(row.EstimatedAmount) + total_EstAmt
              : 0;
            total_ActualAmt = parseFloat(row.ActualAmount)
              ? parseFloat(row.ActualAmount) + total_ActualAmt
              : 0;
            total_Diff = parseFloat(row.DiffAmount)
              ? parseFloat(row.DiffAmount) + total_Diff
              : 0;
            total_CostAmount +=
              (parseFloat(row.CostPrice) ? parseFloat(row.CostPrice) : 0) *
              (parseFloat(row.Qty) ? parseFloat(row.Qty) : 0);
            total_SaleAmount += parseFloat(row.ActualSalePrice)
              ? parseFloat(row.ActualSalePrice) + total_SaleAmount
              : 0;

            ReportData[kk].details[idx] = {
              ...ReportData[kk].details[idx],
              Qty: parseFloat(ReportData[kk].details[idx].Qty).toFixed(2),
              Weight: parseFloat(ReportData[kk].details[idx].Weight).toFixed(2),
              ActualAmount: parseFloat(
                ReportData[kk].details[idx].ActualAmount
              ).toFixed(2),
              EstimatedAmount: parseFloat(
                ReportData[kk].details[idx].EstimatedAmount
              ).toFixed(2),
              DiffAmount: parseFloat(
                ReportData[kk].details[idx].DiffAmount
              ).toFixed(2),
              EP: parseFloat(ReportData[kk].details[idx].EP).toFixed(2),
            };
          });

          ReportData[kk] = {
            ...ReportData[kk],
            total_Qty: total_Qty.toFixed(2),
            actual_total_Weight: actual_total_Weight.toFixed(2),
            total_EstAmt: total_EstAmt.toFixed(2),
            total_ActualAmt: total_ActualAmt.toFixed(2),
            total_Diff: total_Diff.toFixed(2),
            total_CostAmount: total_CostAmount.toFixed(2),
            TotalWeight: parseFloat(
              ReportData[kk].details[0].TotalWeight
            ).toFixed(2),
            PacketQty: ReportData[kk].details.length,
            NetProfit: (total_ActualAmt - total_CostAmount).toFixed(2),
            NetProfitPercnt: (
              ((total_ActualAmt - total_CostAmount) / total_CostAmount) *
              100
            ).toFixed(2),
          };
        }
        var ReportHdr = {
          Hdr: "Stock Valuation",
          FromDate: moment(pFromDate, "YYYY-MM-DD").format(
            ReportConfig.GeneralInfo.DateFormat
          ),
          ToDate: moment(pToDate, "YYYY-MM-DD").format(
            ReportConfig.GeneralInfo.DateFormat
          ),
        };

        return {
          message: resposeMessage,
          ReportConfig,
          data: {
            ReportHdr,
            ReportGroup,
            ReportData: ReportData,
            ReportFinalSummary,
          },
        };
      } else {
        resposeMessage = "Report config not defined!";
      }
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  async getRPTSalesReturn(pReportId, pVoucherId, pCompCode): Promise<any> {
    const ReportId = pReportId;

    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let SaleReturnHdr;
      let SaleReturnDtl = [];
      let SaleReturnSummary;
      let l_TotalGrossAmount = 0;
      let l_TotalDiscountAmount = 0;
      let l_TotalTaxAmount = 0;
      let l_TotalNetAmount = 0;
      let l_TotalSaleQty = 0;
      let l_TotalAmount = 0;

      const ReportConfig = await this.getReportInfo(ReportId, pCompCode);

      //prepare data && fetch data from dynamic stored procedure
      if (ReportConfig.ReportHdr.ReportSource) {
        query = ReportConfig.ReportHdr.ReportSource;
        // console.log("ss", pCompCode, pVoucherId, query);
        dynamicRes = await this.conn.query(query, [pCompCode, pVoucherId]);
        // console.log(dynamicRes[0], "res");

        if (dynamicRes[0].length > 0) {
          //set PurchaseHdr

          SaleReturnHdr = {
            VoucherId: dynamicRes[0][0].VoucherId,
            VoucherNo: dynamicRes[0][0].VoucherNo,
            VoucherDate: moment(dynamicRes[0][0].VoucherDate).format(
              ReportConfig.GeneralInfo.DateFormat
            ),
            BranchCode: dynamicRes[0][0].BranchCode,
            DeptCode: dynamicRes[0][0].DeptCode,
            CustId: dynamicRes[0][0].CustId,
            CustName:
              dynamicRes[0][0].CustName === null
                ? "-"
                : dynamicRes[0][0].CustName,
            CustMobile: dynamicRes[0][0].CustMobile,
            CustBillingAddressId: dynamicRes[0][0].CustBillingAddressId,
            CustDeliveryAddressId: dynamicRes[0][0].CustDeliveryAddressId,
            CreditDays: dynamicRes[0][0].CreditDays,
            GrossAmount: parseFloat(dynamicRes[0][0].GrossAmount).toFixed(2),
            DiscAmount: parseFloat(dynamicRes[0][0].DiscAmount).toFixed(2),
            SchemeDiscAmount: parseFloat(
              dynamicRes[0][0].SchemeDiscAmount
            ).toFixed(2),
            TaxAmount: parseFloat(dynamicRes[0][0].TaxAmount).toFixed(2),
            MiscAmount: parseFloat(dynamicRes[0][0].MiscAmount).toFixed(2),
            RoundOff: parseFloat(dynamicRes[0][0].RoundOff).toFixed(2),
            NetAmount: parseFloat(dynamicRes[0][0].NetAmount).toFixed(2),
            SettlementAmount: parseFloat(
              dynamicRes[0][0].SettlementAmount
            ).toFixed(2),
            TotalGrossAmount: l_TotalGrossAmount,
            hasCustomer: _.includes(
              [null, "", undefined],
              dynamicRes[0][0].CustName
            )
              ? false
              : true,
          };
          //Set ReportDtl
          dynamicRes[0].forEach(async (row, idx) => {
            l_TotalSaleQty += parseFloat(row.dtl_SaleQty);
            l_TotalAmount += parseFloat(row.dtl_Amount);
            l_TotalNetAmount += parseFloat(row.NetAmount);
            l_TotalTaxAmount += parseFloat(row.dtl_TaxAmount);
            l_TotalDiscountAmount += parseFloat(row.dtl_DiscAmount);
            l_TotalGrossAmount += parseFloat(row.GrossAmount);
            // SaleHdr[SaleHdr.length - 1].hasDetail = true;
            SaleReturnDtl.push({
              SrNo: row.dtl_SrNo,
              ItemCode: row.dtl_ItemCode,
              ItemName: row.dtl_ItemName,
              ItemNamePrint: _.truncate(row.dtl_ItemName, {
                length: 16,
                omission: "",
              }),
              InwardSeq: row.dtl_InwardSeq,
              BatchNo: row.dtl_BatchNo,
              ExpiryDate: row.dtl_ExpiryDate,
              SaleQty: parseFloat(row.dtl_SaleQty).toFixed(0),
              CostPrice: parseFloat(row.dtl_CostPrice).toFixed(0),
              SalePrice: parseFloat(row.dtl_SalePrice).toFixed(0),
              LandingSalePrice: parseFloat(row.dtl_LandingSalePrice).toFixed(2),
              SchemeDiscAmount: parseFloat(row.dtl_SchemeDiscAmount).toFixed(2),
              SchemeCode: parseFloat(row.dtl_SchemeCode).toFixed(2),
              MRP: parseFloat(row.dtl_MRP).toFixed(0),
              DiscPer: row.dtl_DiscPer,
              DiscAmount: parseFloat(row.dtl_DiscAmount).toFixed(0),
              TaxCode: row.dtl_TaxCode,
              TaxPerc: row.dtl_TaxPerc,
              TaxAmount: parseFloat(row.dtl_TaxAmount).toFixed(0),
              ItemTotal: parseFloat(row.dtl_ItemTotal).toFixed(2),
              Amount: parseFloat(row.dtl_Amount).toFixed(0),
              GrossAmount: parseFloat(row.GrossAmount).toFixed(2),
              NetAmount: parseFloat(row.NetAmount).toFixed(2),
              // hasDetail: false
            });
          });
          SaleReturnSummary = {
            TotalSaleQty: l_TotalSaleQty.toFixed(0),
            TotalAmount: l_TotalAmount.toFixed(0),
            TotalGrossAmount: l_TotalGrossAmount.toFixed(2),
            TotalTaxAmount: l_TotalTaxAmount.toFixed(2),
            TotalDiscountAmount: l_TotalDiscountAmount.toFixed(2),
            TotalNetAmount: l_TotalNetAmount.toFixed(2),
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
        data: { SaleReturnHdr, SaleReturnDtl, SaleReturnSummary },
      };
    } catch (error) {
      console.log(error);
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  // getRPTSalesOrder
  async getRPTSalesOrder(pReportId, pVoucherId, pCompCode): Promise<any> {
    const ReportId = pReportId;

    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let SaleOrderHdr;
      let SaleOrderDtl = [];
      let SaleOrderSummary;
      let l_TotalGrossAmount = 0;
      let l_TotalDiscountAmount = 0;
      let l_TotalTaxAmount = 0;
      let l_TotalNetAmount = 0;
      let l_TotalSaleQty = 0;
      let l_TotalAmount = 0;
      let l_TotalSavedAmount = 0;

      const ReportConfig = await this.getReportInfo(ReportId, pCompCode);

      //prepare data && fetch data from dynamic stored procedure
      if (ReportConfig.ReportHdr.ReportSource) {
        query = ReportConfig.ReportHdr.ReportSource;
        dynamicRes = await this.conn.query(query, [pCompCode, pVoucherId]);

        if (dynamicRes[0].length > 0) {
          //set PurchaseHdr

          SaleOrderHdr = {
            VoucherId: dynamicRes[0][0].VoucherId,
            VoucherNo: dynamicRes[0][0].VoucherNo,
            VoucherDate: moment(dynamicRes[0][0].crt_dttm).format(
              ReportConfig.GeneralInfo.DateTimeFormat
            ),
            BranchCode: dynamicRes[0][0].BranchCode,
            DeptCode: dynamicRes[0][0].DeptCode,
            CustId: dynamicRes[0][0].CustId,
            CustName:
              dynamicRes[0][0].CustName === null
                ? "Cash Sale"
                : dynamicRes[0][0].CustName,
            CustMobile: dynamicRes[0][0].CustMobile,
            CustBillingAddressId: dynamicRes[0][0].CustBillingAddressId,
            CustDeliveryAddressId: dynamicRes[0][0].CustDeliveryAddressId,
            CreditDays: dynamicRes[0][0].CreditDays,
            GrossAmount: parseFloat(dynamicRes[0][0].GrossAmount).toFixed(2),
            DiscAmount: parseFloat(dynamicRes[0][0].DiscAmount).toFixed(2),
            SchemeDiscAmount: parseFloat(
              dynamicRes[0][0].SchemeDiscAmount
            ).toFixed(0),
            TaxAmount: parseFloat(dynamicRes[0][0].TaxAmount).toFixed(2),
            MiscAmount: parseFloat(dynamicRes[0][0].MiscAmount).toFixed(2),
            RoundOff: parseFloat(dynamicRes[0][0].RoundOff).toFixed(2),
            NetAmount: parseFloat(dynamicRes[0][0].NetAmount).toFixed(2),
            SettlementAmount: parseFloat(
              dynamicRes[0][0].SettlementAmount
            ).toFixed(2),
            TotalGrossAmount: l_TotalGrossAmount,
            hasCustomer: _.includes(
              [null, "", undefined],
              dynamicRes[0][0].CustName
            )
              ? false
              : true,
          };
          //Set ReportDtl
          dynamicRes[0].forEach(async (row, idx) => {
            l_TotalSaleQty += parseFloat(row.dtl_SaleQty);
            l_TotalAmount += parseFloat(row.dtl_Amount);
            l_TotalTaxAmount += parseFloat(row.dtl_TaxAmount);
            l_TotalDiscountAmount += parseFloat(row.dtl_DiscAmount);
            l_TotalGrossAmount += parseFloat(row.GrossAmount);
            l_TotalSavedAmount +=
              parseFloat(row.dtl_MRP) +
              parseFloat(row.DiscAmount) -
              parseFloat(row.dtl_SalePrice);
            l_TotalNetAmount = parseFloat(row.NetAmount);
            // SaleHdr[SaleHdr.length - 1].hasDetail = true;
            SaleOrderDtl.push({
              SrNo: row.dtl_SrNo,
              ItemCode: row.dtl_ItemCode,
              ItemName: row.dtl_ItemName,
              ItemNamePrint: _.truncate(row.dtl_ItemName, {
                length: 20,
                omission: "..",
              }),
              InwardSeq: row.dtl_InwardSeq,
              BatchNo: row.dtl_BatchNo,
              ExpiryDate: row.dtl_ExpiryDate,
              SaleQty: _.round(parseFloat(row.dtl_SaleQty), 2),
              CostPrice: parseFloat(row.dtl_CostPrice).toFixed(0),
              SalePrice: parseFloat(row.dtl_SalePrice).toFixed(0),
              LandingSalePrice: parseFloat(row.dtl_LandingSalePrice).toFixed(2),
              SchemeDiscAmount: parseFloat(row.dtl_SchemeDiscAmount).toFixed(2),
              SchemeCode: parseFloat(row.dtl_SchemeCode).toFixed(2),
              MRP: parseFloat(row.dtl_MRP).toFixed(0),
              DiscPer: row.dtl_DiscPer,
              DiscAmount: parseFloat(row.dtl_DiscAmount).toFixed(0),
              TaxCode: row.dtl_TaxCode,
              TaxPerc: row.dtl_TaxPerc,
              TaxAmount: parseFloat(row.dtl_TaxAmount).toFixed(0),
              ItemTotal: parseFloat(row.dtl_ItemTotal).toFixed(2),
              Amount: parseFloat(row.dtl_Amount).toFixed(0),
              GrossAmount: parseFloat(row.GrossAmount).toFixed(2),
              NetAmount: parseFloat(row.NetAmount).toFixed(2),
              // hasDetail: SavedAmount: ,
            });
          });
          SaleOrderSummary = {
            TotalSaleQty: l_TotalSaleQty.toFixed(0),
            TotalAmount: l_TotalAmount.toFixed(0),
            TotalGrossAmount: l_TotalGrossAmount.toFixed(0),
            TotalTaxAmount: l_TotalTaxAmount.toFixed(0),
            TotalDiscountAmount: l_TotalDiscountAmount.toFixed(0),
            TotalNetAmount: l_TotalNetAmount.toFixed(0),
            TotalSaveAmount: l_TotalSavedAmount.toFixed(0),
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
        data: { SaleOrderHdr, SaleOrderDtl, SaleOrderSummary },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //20210830 Saurav
  async getRPTPurchaseRetrun(pReportId, pVoucherId, CompCode): Promise<any> {
    const ReportId = pReportId;

    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let PurchaseReturnHdr;
      let PurchaseReturnDtl = [];
      let PurchaseReturnSummary;
      let l_TotalGrossAmount = 0;
      let l_TotalDiscountAmount = 0;
      let l_TotalTaxAmount = 0;
      let l_TotalNetAmount = 0;

      const ReportConfig = await this.getReportInfo(ReportId, CompCode);
      // console.log("ss", ReportConfig);
      //prepare data && fetch data from dynamic stored procedure
      if (ReportConfig.ReportHdr.ReportSource) {
        query = ReportConfig.ReportHdr.ReportSource;
        dynamicRes = await this.conn.query(query, [CompCode, pVoucherId]);
        // console.log(dynamicRes);
        if (dynamicRes[0].length > 0) {
          //set PurchaseHdr

          PurchaseReturnHdr = {
            VoucherId: dynamicRes[0][0].VoucherId,
            VoucherNo: dynamicRes[0][0].VoucherNo,
            VoucherDate: moment(dynamicRes[0][0].VoucherDate).format(
              ReportConfig.GeneralInfo.DateFormat
            ),
            BranchCode: dynamicRes[0][0].BranchCode,
            DeptCode: dynamicRes[0][0].DeptCode,
            TaxType: dynamicRes[0][0].TaxType,
            SuppId: dynamicRes[0][0].SuppId,
            suppCode: dynamicRes[0][0].suppCode,
            suppName: dynamicRes[0][0].suppName,
            mobileNo: dynamicRes[0][0].mobileNo,
            PurchaseType: dynamicRes[0][0].mobileNo,
            RefNo: dynamicRes[0][0].RefNo,
            RefDate:
              dynamicRes[0][0].RefDate !== null
                ? moment(dynamicRes[0][0].RefDate).format(
                    ReportConfig.GeneralInfo.DateFormat
                  )
                : "-",
            PurchaseRtnBillNo:
              dynamicRes[0][0].PurchaseRtnBillNo === null ? "-" : "",
            PurchaseRtnBillDate:
              dynamicRes[0][0].PurchaseRtnBillDate !== null
                ? moment(dynamicRes[0][0].PurchaseRtnBillDate).format(
                    ReportConfig.GeneralInfo.DateFormat
                  )
                : "-",
            EWayBillNo: dynamicRes[0][0].EWayBillNo,
            VehicleNo: dynamicRes[0][0].VehicleNo,
            CreditDays: dynamicRes[0][0].CreditDays,
            PurchaseId: dynamicRes[0][0].PurchaseId,
            PurchaseNo: dynamicRes[0][0].PurchaseNo,
            PurchaseDate:
              dynamicRes[0][0].PurchaseDate !== null
                ? moment(dynamicRes[0][0].PurchaseDate).format(
                    ReportConfig.GeneralInfo.DateFormat
                  )
                : "-",
            SysOption1: dynamicRes[0][0].PurchaseNo,
            SysOption2: dynamicRes[0][0].SysOption2,
            SysOption3: dynamicRes[0][0].SysOption3,
            SysOption4: dynamicRes[0][0].SysOption4,
            SysOption5: dynamicRes[0][0].SysOption5,
            SysOption6: dynamicRes[0][0].SysOption6,
            SysOption7: dynamicRes[0][0].SysOption7,
            SysOption8: dynamicRes[0][0].SysOption8,
            SysOption9: dynamicRes[0][0].SysOption9,
            SysOption10: dynamicRes[0][0].SysOption10,
            GrossAmount: parseFloat(dynamicRes[0][0].GrossAmount).toFixed(2),
            DiscAmount: parseFloat(dynamicRes[0][0].DiscAmount).toFixed(2),
            TaxAmount: parseFloat(dynamicRes[0][0].TaxAmount).toFixed(2),
            MiscAmount: parseFloat(dynamicRes[0][0].MiscAmount).toFixed(2),
            RoundOff: parseFloat(dynamicRes[0][0].RoundOff).toFixed(2),
            NetAmount: parseFloat(dynamicRes[0][0].NetAmount).toFixed(2),
            SettlementAmount: parseFloat(
              dynamicRes[0][0].SettlementAmount
            ).toFixed(2),
            TotalGrossAmount: l_TotalGrossAmount,
            Remark: dynamicRes[0][0].SysOption1,
            LastModifiedOn: moment(dynamicRes[0][0].LastModifiedOn).format(
              ReportConfig.GeneralInfo.DateTimeFormat
            ),
            LastModifiedBy: dynamicRes[0][0].LastModifiedBy,
          };
          //Set ReportDtl
          dynamicRes[0].forEach(async (row, idx) => {
            l_TotalNetAmount += parseFloat(row.NetAmount);
            l_TotalTaxAmount += parseFloat(row.dtl_TaxAmount);
            l_TotalDiscountAmount += parseFloat(row.dtl_DiscAmount);
            l_TotalGrossAmount += parseFloat(row.GrossAmount);
            PurchaseReturnDtl.push({
              SrNo: idx + 1,
              ItemCode: row.dtl_ItemCode,
              ItemName: row.dtl_ItemName,
              InwardSeq: row.dtl_InwardSeq,
              BatchNo: row.dtl_BatchNo,
              ExpiryDate: row.dtl_ExpiryDate,
              ReturnQty: parseFloat(row.dtl_ReturnQty).toFixed(0),
              CostPrice: parseFloat(row.dtl_CostPrice).toFixed(2),
              SalePrice: parseFloat(row.dtl_SalePrice).toFixed(2),
              MRP: parseFloat(row.dtl_MRP).toFixed(2),
              DiscPer: row.dtl_DiscPer,
              DiscAmount: parseFloat(row.dtl_DiscAmount).toFixed(2),
              TaxCode: row.dtl_TaxCode,
              TaxPerc: row.dtl_TaxPerc,
              TaxAmount: parseFloat(row.dtl_TaxAmount).toFixed(2),
              Amount: parseFloat(row.dtl_Amount).toFixed(2),
              SysOption1: row.dtl_SysOption1,
              SysOption2: row.dtl_SysOption2,
              SysOption3: row.dtl_SysOption3,
              SysOption4: row.dtl_SysOption4,
              SysOption5: row.dtl_SysOption5,
              CGST: row.dtl_CGST,
              SGST: row.dtl_SGST,
              IGST: row.dtl_IGST,
              UTGST: row.dtl_UTGST,
              Surcharge: row.dtl_Surcharge,
              Cess: row.dtl_Cess,
            });
          });
          PurchaseReturnSummary = {
            TotalGrossAmount: l_TotalGrossAmount.toFixed(2),
            TotalTaxAmount: l_TotalTaxAmount.toFixed(2),
            TotalDiscountAmount: l_TotalDiscountAmount.toFixed(2),
            TotalNetAmount: l_TotalNetAmount.toFixed(2),
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
        data: { PurchaseReturnHdr, PurchaseReturnDtl, PurchaseReturnSummary },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }

  //14012021 Saurav
  async getRegisterPurchaseReturn(
    pReportId,
    pCompCode,
    pBranchCode,
    pDeptCode,
    pFromDate,
    pToDate,
    pSuppId,
    pHideDetail
  ): Promise<any> {
    const ReportId = pReportId;

    try {
      //Get Report configs
      let dynamicRes;
      let resposeMessage;
      let query;

      let PurchaseReturnSummary;
      let PurchaseReturnHdr = [];
      let l_TotalGrossAmount = 0;
      let l_TotalMiscAmount = 0;
      let l_TotalDiscountAmount = 0;
      let l_TotalTaxAmount = 0;
      let l_TotalNetAmount = 0;

      const ReportConfig = await this.getReportInfo(ReportId, pCompCode);
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
          pSuppId,
          pHideDetail,
        ]);
        // console.log(dynamicRes);
        if (dynamicRes[0].length > 0) {
          //Set ReportDtl
          dynamicRes[0].forEach(async (row, idx) => {
            l_TotalGrossAmount += parseFloat(row.GrossAmount);
            l_TotalMiscAmount += row.MiscAmount;
            l_TotalDiscountAmount += parseFloat(row.DiscAmount);
            l_TotalTaxAmount += parseFloat(row.TaxAmount);
            l_TotalNetAmount += parseFloat(row.NetAmount);

            let zFindIndex = PurchaseReturnHdr.findIndex(
              (ll) => ll.VoucherId === row.VoucherId
            );
            if (zFindIndex >= 0) {
              if (row.dtl_SrNo) {
                PurchaseReturnHdr[zFindIndex].hasDetail = row.dtl_SrNo
                  ? true
                  : false;
                PurchaseReturnHdr[zFindIndex].ReportDtl.push({
                  SrNo: idx + 1,
                  ItemCode: row.dtl_ItemCode,
                  ItemName: row.dtl_ItemName,
                  InwardSeq: row.dtl_InwardSeq,
                  BatchNo: row.dtl_BatchNo,
                  ExpiryDate: row.dtl_ExpiryDate,
                  ReturnQty: parseFloat(row.dtl_ReturnQty).toFixed(0),
                  CostPrice: parseFloat(row.dtl_CostPrice).toFixed(2),
                  SalePrice: parseFloat(row.dtl_SalePrice).toFixed(2),
                  MRP: parseFloat(row.dtl_MRP).toFixed(2),
                  DiscPer: row.dtl_DiscPer,
                  DiscAmount: parseFloat(row.dtl_DiscAmount).toFixed(2),
                  TaxCode: row.dtl_TaxCode,
                  TaxPerc: row.dtl_TaxPerc,
                  TaxAmount: parseFloat(row.dtl_TaxAmount).toFixed(2),
                  Amount: parseFloat(row.dtl_Amount).toFixed(2),
                  SysOption1: row.dtl_SysOption1,
                  SysOption2: row.dtl_SysOption2,
                  SysOption3: row.dtl_SysOption3,
                  SysOption4: row.dtl_SysOption4,
                  SysOption5: row.dtl_SysOption5,
                  CGST: row.dtl_CGST,
                  SGST: row.dtl_SGST,
                  IGST: row.dtl_IGST,
                  UTGST: row.dtl_UTGST,
                  Surcharge: row.dtl_Surcharge,
                  Cess: row.dtl_Cess,
                });
              }
            } else {
              PurchaseReturnHdr.push({
                // SrNo: idx + 1,
                VoucherId: row.VoucherId,
                VoucherNo: row.VoucherNo,
                VoucherDate: moment(row.VoucherDate).format(
                  ReportConfig.GeneralInfo.DateFormat
                ),
                BranchCode: row.BranchCode,
                DeptCode: row.DeptCode,
                TaxType: row.TaxType,
                SuppId: row.SuppId,
                suppCode: row.suppCode,
                suppName: row.suppName,
                mobileNo: row.mobileNo,
                PurchaseType: row.mobileNo,
                RefNo: row.RefNo,
                RefDate:
                  row.RefDate !== null
                    ? moment(row.RefDate).format(
                        ReportConfig.GeneralInfo.DateFormat
                      )
                    : "-",
                PurchaseRtnBillNo:
                  row.PurchaseRtnBillNo === null ? "-" : row.PurchaseRtnBillNo,
                PurchaseRtnBillDate:
                  row.PurchaseRtnBillDate !== null
                    ? moment(row.PurchaseRtnBillDate).format(
                        ReportConfig.GeneralInfo.DateFormat
                      )
                    : "-",
                EWayBillNo: row.EWayBillNo,
                VehicleNo: row.VehicleNo,
                CreditDays: row.CreditDays,
                PurchaseId: row.PurchaseId,
                PurchaseNo: row.PurchaseNo,
                PurchaseDate:
                  row.PurchaseDate !== null
                    ? moment(row.PurchaseDate).format(
                        ReportConfig.GeneralInfo.DateFormat
                      )
                    : "-",
                SysOption1: row.SysOption1,
                SysOption2: row.SysOption2,
                SysOption3: row.SysOption3,
                SysOption4: row.SysOption4,
                SysOption5: row.SysOption5,
                SysOption6: row.SysOption6,
                SysOption7: row.SysOption7,
                SysOption8: row.SysOption8,
                SysOption9: row.SysOption9,
                SysOption10: row.SysOption10,
                GrossAmount: parseFloat(row.GrossAmount).toFixed(2),
                DiscAmount: parseFloat(row.DiscAmount).toFixed(2),
                TaxAmount: parseFloat(row.TaxAmount).toFixed(2),
                MiscAmount: row.MiscAmount
                  ? parseFloat(row.MiscAmount).toFixed(2)
                  : "-",
                RoundOff: parseFloat(row.RoundOff).toFixed(2),
                NetAmount: parseFloat(row.NetAmount).toFixed(2),
                SettlementAmount: parseFloat(row.SettlementAmount).toFixed(2),
                ReportDtl: [],
                hasDetail: false,
              });
              if (row.dtl_SrNo) {
                PurchaseReturnHdr[
                  PurchaseReturnHdr.length - 1
                ].hasDetail = true;
                PurchaseReturnHdr[PurchaseReturnHdr.length - 1].ReportDtl.push({
                  SrNo: idx + 1,
                  ItemCode: row.dtl_ItemCode,
                  ItemName: row.dtl_ItemName,
                  InwardSeq: row.dtl_InwardSeq,
                  BatchNo: row.dtl_BatchNo,
                  ExpiryDate: row.dtl_ExpiryDate,
                  ReturnQty: parseFloat(row.dtl_ReturnQty).toFixed(0),
                  CostPrice: parseFloat(row.dtl_CostPrice).toFixed(2),
                  SalePrice: parseFloat(row.dtl_SalePrice).toFixed(2),
                  MRP: parseFloat(row.dtl_MRP).toFixed(2),
                  DiscPer: row.dtl_DiscPer,
                  DiscAmount: parseFloat(row.dtl_DiscAmount).toFixed(2),
                  TaxCode: row.dtl_TaxCode,
                  TaxPerc: row.dtl_TaxPerc,
                  TaxAmount: parseFloat(row.dtl_TaxAmount).toFixed(2),
                  Amount: parseFloat(row.dtl_Amount).toFixed(2),
                  SysOption1: row.dtl_SysOption1,
                  SysOption2: row.dtl_SysOption2,
                  SysOption3: row.dtl_SysOption3,
                  SysOption4: row.dtl_SysOption4,
                  SysOption5: row.dtl_SysOption5,
                  CGST: row.dtl_CGST,
                  SGST: row.dtl_SGST,
                  IGST: row.dtl_IGST,
                  UTGST: row.dtl_UTGST,
                  Surcharge: row.dtl_Surcharge,
                  Cess: row.dtl_Cess,
                });
              }
            }
          });
          PurchaseReturnSummary = {
            TotalGrossAmount: l_TotalGrossAmount.toFixed(2),
            TotalMiscAmount: l_TotalMiscAmount.toFixed(2),
            TotalDiscountAmount: l_TotalDiscountAmount.toFixed(2),
            TotalTaxAmount: l_TotalTaxAmount.toFixed(2),
            TotalNetAmount: l_TotalNetAmount.toFixed(2),
          };
        } else {
          resposeMessage = "No data found!";
        }
      } else {
        resposeMessage = "Report config not defined!";
      }
      // console.log(PurchaseReturnHdr[0].ReportDtl, "PurchaseReturnHdr");
      let ReportParams = {
        CompCode: pCompCode,
        BranchCode: pBranchCode,
        DeptCode: pDeptCode,
        FromDate: pFromDate,
        ToDate: pToDate,
        SuppId: pSuppId,
        HideDetail: pHideDetail === "Y" ? true : false,
      };
      var ReportHdr = {
        ReportTitle: `Purchase Register   ${moment(pFromDate).format(
          ReportConfig.GeneralInfo.DateFormat
        )} 
        to ${moment(pToDate).format(ReportConfig.GeneralInfo.DateFormat)}`,
      };
      return {
        message: resposeMessage,
        ReportConfig,
        data: {
          PurchaseReturnHdr,
          PurchaseReturnSummary,
          ReportParams,
          ReportHdr,
        },
      };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
}
