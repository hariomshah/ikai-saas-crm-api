import {
  Controller,
  Logger,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
} from "@nestjs/common";
import { Response } from "express";
import { printPdf } from "./printUtility";
import { HtmlReportsService } from "./html-reports.service";
import { HtmlInventoryReportsService } from "./html-inventory-reports.service";

const _ = require("lodash");

@Controller("html-reports")
export class HtmlReportsController {
  private logger = new Logger("HtmlReportsController");

  constructor(
    private state: HtmlReportsService,
    private invReports: HtmlInventoryReportsService
  ) {}

  @Post("getReportPDF")
  getReportPDF(@Body("data") pdata: any, @Res() res: Response): any {
    return printPdf(null, pdata, null).then((pdf) => {
      res.set({
        "Content-Type": "application/pdf",
        "Content-Length": pdf.length,
      });
      res.status(HttpStatus.CREATED).send(pdf);
    });
  }

  @Get("getReportPDFFrance")
  getReportPDFFrance(@Res() res: Response): any {
    return printPdf(null, null, null).then((pdf) => {
      res.set({
        "Content-Type": "application/pdf",
        "Content-Length": pdf.length,
      });
      res.status(HttpStatus.CREATED).send(pdf);
    });
  }

  @Post("getReportInvoicePDFFrance")
  getReportInvoicePDFFrance(
    @Body("InvoiceId") pInvoiceId: any,
    @Body("OutputType") OutputType: any,
    @Body("CompCode") CompCode: any,
    @Res() res: Response
  ): any {
    return this.state
      .getReportServiceInvoice(6, pInvoiceId, CompCode)
      .then((result) => {
        const templatePath = "\\Service\\payment-receipt";
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else if (_.upperCase(OutputType) === "HTML") {
          printPdf(templatePath, result, _.upperCase(OutputType)).then(
            (html) => {
              res.status(HttpStatus.CREATED).send(html);
            }
          );
        } else
          printPdf(templatePath, result, null).then((pdf) => {
            res.set({
              "Content-Type": "application/pdf",
              "Content-Length": pdf.length,
            });
            res.status(HttpStatus.CREATED).send(pdf);
          });
      });
  }

  @Post("getReportServiceInvoice")
  getReportServiceInvoice(
    @Body("InvoiceId") InvoiceId: any,
    @Body("OutputType") OutputType: any,
    @Body("CompCode") CompCode: any,
    @Res() res: Response
  ): any {
    return this.state
      .getReportServiceInvoice(6, InvoiceId, CompCode)
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }

  @Post("getPaymentGatewayPDF")
  getPaymentGatewayPDF(
    @Res() res: Response,
    @Body("CompCode") CompCode: any
  ): any {
    const templatePath = "\\Service\\payment-success-receipt";
    // console.log(templatePath);
    return this.state.getReportServiceInvoice(6, 8, CompCode).then((result) => {
      // res.status(HttpStatus.CREATED).send(result);
      // console.log(result);
      printPdf(templatePath, result, null).then((pdf) => {
        res.set({
          "Content-Type": "application/pdf",
          "Content-Length": pdf.length,
        });
        res.status(HttpStatus.CREATED).send(pdf);
      });
    });
  }

  @Post("getReportRestaurantInvoice")
  getReportRestaurantInvoice(
    @Body("InvoiceId") InvoiceId: any,
    @Body("OutputType") OutputType: any,
    @Body("CompCode") CompCode: any,
    @Res() res: Response
  ): any {
    // console.log(10, InvoiceId, CompCode);
    return this.state
      .getReportServiceInvoice(10, InvoiceId, CompCode)
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }

  @Post("getReportServiceKOT")
  getReportServiceKOT(
    @Body("KotId") KotId: any,
    @Body("OutputType") OutputType: any,
    @Body("CompCode") CompCode: any,
    @Res() res: Response
  ): any {
    return this.state
      .getReportServiceKOT(11, KotId, CompCode)
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          if (_.upperCase(OutputType) === "HTML") {
            let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }

  //20201229 Hari
  @Post("getReceiptsAndPaymentSlip")
  getReceiptsAndPaymentSlip(
    @Body("TranType") TranType: any,
    @Body("TranId") TranId: any,
    @Body("OutputType") OutputType: any,
    @Body("CompCode") CompCode: any,
    @Res() res: Response
  ): any {
    // console.log(TranType, TranId, OutputType, "sau");
    return this.state
      .getReceiptsAndPaymentSlip(12, TranType, TranId, CompCode)
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }

  //20210102 Savrav
  @Post("getCashBookReport")
  getCashBookReport(
    @Body("FromDate") FromDate: any,
    @Body("ToDate") ToDate: any,
    @Body("OutputType") OutputType: any,
    @Body("CompCode") CompCode: any,
    @Res() res: Response
  ): any {
    return this.state
      .getCashBookReport(13, FromDate, ToDate, CompCode)
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }

  //20210104 Savrav
  @Post("getDayBookReport")
  getDayBookReport(
    @Body("FromDate") FromDate: any,
    @Body("ToDate") ToDate: any,
    @Body("OutputType") OutputType: any,
    @Body("CompCode") CompCode: any,
    @Res() res: Response
  ): any {
    return this.state
      .getDayBookReport(14, FromDate, ToDate, CompCode)
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }

  //20210102 Savrav
  @Post("getRegisterReceiptsAndPayments")
  getRegisterReceiptsAndPayments(
    @Body("CompCode") CompCode: any,
    @Body("TranType") TranType: any,
    @Body("FromDate") FromDate: any,
    @Body("ToDate") ToDate: any,
    @Body("RefCode") RefCode: any,
    @Body("ViewType") ViewType: any,
    @Body("OutputType") OutputType: any,
    @Res() res: Response
  ): any {
    let l_ReportId;
    if (TranType === "RCT") {
      l_ReportId = 28;
    } else if (TranType === "PMT") {
      l_ReportId = 29;
    } else if (TranType === "INC") {
      l_ReportId = 30;
    } else if (TranType === "EXPS") {
      l_ReportId = 31;
    }

    return this.state
      .getRegisterReceiptsAndPayments(
        CompCode,
        l_ReportId,
        TranType,
        FromDate,
        ToDate,
        RefCode,
        ViewType
      )
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }

  //20210102 Savrav
  @Post("getRegisterPurchase")
  getRegisterPurchase(
    @Body("CompCode") CompCode: any,
    @Body("BranchCode") BranchCode: any,
    @Body("DeptCode") DeptCode: any,
    @Body("FromDate") FromDate: any,
    @Body("ToDate") ToDate: any,
    @Body("SuppId") SuppId: any,
    @Body("HideDetail") HideDetail: any,
    @Body("OutputType") OutputType: any,
    @Res() res: Response
  ): any {
    return this.state
      .getRegisterPurchase(
        16,
        CompCode,
        BranchCode,
        DeptCode,
        FromDate,
        ToDate,
        SuppId,
        HideDetail
      )
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }
  //20210115 Hari/Savrav/Siddharth
  @Post("getRPTPurchase")
  getRPTPurchase(
    @Body("VoucherId") VoucherId: any,
    @Body("OutputType") OutputType: any,
    @Body("CompCode") CompCode: any,
    @Res() res: Response
  ): any {
    return this.state.getRPTPurchase(17, VoucherId, CompCode).then((result) => {
      if (_.upperCase(OutputType) === "JSON") {
        res.status(HttpStatus.CREATED).send(result);
      } else {
        let templatePath = "";
        if (process.platform.trim() === "linux") {
          templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
        } else {
          templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
        }

        if (_.upperCase(OutputType) === "HTML") {
          // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          printPdf(templatePath, result, _.upperCase(OutputType)).then(
            (html) => {
              res.status(HttpStatus.CREATED).send(html);
            }
          );
        } else {
          // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          printPdf(templatePath, result, _.upperCase(OutputType)).then(
            (pdf) => {
              res.set({
                "Content-Type": "application/pdf",
                "Content-Length": pdf.length,
              });
              res.status(HttpStatus.CREATED).send(pdf);
            }
          );
        }
      }
    });
  }

  // 20210116 Siddharth
  @Post("getRPTSales")
  getRPTSales(
    @Body("VoucherId") VoucherId: any,
    @Body("OutputType") OutputType: any,
    @Body("CompCode") CompCode: any,
    @Res() res: Response
  ): any {
    return this.state.getRPTSales(19, VoucherId, CompCode).then((result) => {
      if (_.upperCase(OutputType) === "JSON") {
        res.status(HttpStatus.CREATED).send(result);
      } else {
        let templatePath = "";
        if (process.platform.trim() === "linux") {
          templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
        } else {
          templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
        }

        if (_.upperCase(OutputType) === "HTML") {
          // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          printPdf(templatePath, result, _.upperCase(OutputType)).then(
            (html) => {
              res.status(HttpStatus.CREATED).send(html);
            }
          );
        } else {
          // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          printPdf(templatePath, result, _.upperCase(OutputType)).then(
            (pdf) => {
              res.set({
                "Content-Type": "application/pdf",
                "Content-Length": pdf.length,
              });
              res.status(HttpStatus.CREATED).send(pdf);
            }
          );
        }
      }
    });
  }

  //20210116 Savrav
  @Post("getRegisterSales")
  getRegisterSales(
    @Body("CompCode") CompCode: any,
    @Body("BranchCode") BranchCode: any,
    @Body("DeptCode") DeptCode: any,
    @Body("FromDate") FromDate: any,
    @Body("ToDate") ToDate: any,
    @Body("CustId") CustId: any,
    @Body("HideDetail") HideDetail: any,
    @Body("OutputType") OutputType: any,
    @Res() res: Response
  ): any {
    return this.state
      .getRegisterSales(
        18,
        CompCode,
        BranchCode,
        DeptCode,
        FromDate,
        ToDate,
        CustId,
        HideDetail
      )
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }

  ///20210831 Govind
  @Post("getRegisterSalesReturn")
  getRegisterSalesReturn(
    @Body("CompCode") CompCode: any,
    @Body("BranchCode") BranchCode: any,
    @Body("DeptCode") DeptCode: any,
    @Body("FromDate") FromDate: any,
    @Body("ToDate") ToDate: any,
    @Body("CustId") CustId: any,
    @Body("HideDetail") HideDetail: any,
    @Body("OutputType") OutputType: any,
    @Res() res: Response
  ): any {
    return this.state
      .getRegisterSalesReturn(
        48,
        CompCode,
        BranchCode,
        DeptCode,
        FromDate,
        ToDate,
        CustId,
        HideDetail
      )
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }

  @Post("getRPTDataAdjustment")
  getRPTDataAdjustment(
    @Body("VoucherId") VoucherId: any,
    @Body("OutputType") OutputType: any,
    @Body("CompCode") CompCode: any,
    @Res() res: Response
  ): any {
    return this.state
      .getRPTDataAdjustment(21, VoucherId, CompCode)
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }

  //20210116 Savrav
  @Post("getRegisterAdjustments")
  getRegisterAdjustments(
    @Body("CompCode") CompCode: any,
    @Body("BranchCode") BranchCode: any,
    @Body("DeptCode") DeptCode: any,
    @Body("FromDate") FromDate: any,
    @Body("ToDate") ToDate: any,
    @Body("ReasonCode") ReasonCode: any,
    @Body("HideDetail") HideDetail: any,
    @Body("OutputType") OutputType: any,
    @Res() res: Response
  ): any {
    return this.state
      .getRegisterAdjustments(
        20,
        CompCode,
        BranchCode,
        DeptCode,
        FromDate,
        ToDate,
        ReasonCode,
        HideDetail
      )
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }

  @Post("getDataRPTReprocessing")
  getDataRPTReprocessing(
    @Body("VoucherId") VoucherId: any,
    @Body("OutputType") OutputType: any,
    @Body("CompCode") CompCode: any,
    @Res() res: Response
  ): any {
    return this.state
      .getDataRPTReprocessing(25, VoucherId, CompCode)
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }

  //20210116 Savrav
  @Post("getRegisterReprocessing")
  getRegisterReprocessing(
    @Body("CompCode") CompCode: any,
    @Body("BranchCode") BranchCode: any,
    @Body("DeptCode") DeptCode: any,
    @Body("FromDate") FromDate: any,
    @Body("ToDate") ToDate: any,
    @Body("ReasonCode") ReasonCode: any,
    @Body("HideDetail") HideDetail: any,
    @Body("OutputType") OutputType: any,
    @Res() res: Response
  ): any {
    return this.state
      .getRegisterReprocessing(
        22,
        CompCode,
        BranchCode,
        DeptCode,
        FromDate,
        ToDate,
        ReasonCode,
        HideDetail
      )
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }

  //20210116 Savrav
  @Post("getDataRegisterINVOpeningStock")
  getDataRegisterINVOpeningStock(
    @Body("CompCode") CompCode: any,
    @Body("BranchCode") BranchCode: any,
    @Body("DeptCode") DeptCode: any,
    @Body("OutputType") OutputType: any,
    @Res() res: Response
  ): any {
    return this.state
      .getDataRegisterINVOpeningStock(24, CompCode, BranchCode, DeptCode)
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }

  //20210118 Siddharth
  @Post("getReportInvoice")
  getReportInvoice(
    @Body("VoucherId") VoucherId: any,
    @Body("OutputType") OutputType: any,
    @Body("CompCode") CompCode: any,
    @Res() res: Response
  ): any {
    return this.state.getRPTSales(19, VoucherId, CompCode).then((result) => {
      if (_.upperCase(OutputType) === "JSON") {
        res.status(HttpStatus.CREATED).send(result);
      } else {
        let templatePath = "";
        if (process.platform.trim() === "linux") {
          templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
        } else {
          templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
        }

        if (_.upperCase(OutputType) === "HTML") {
          printPdf(templatePath, result, _.upperCase(OutputType)).then(
            (html) => {
              res.status(HttpStatus.CREATED).send(html);
            }
          );
        } else {
          printPdf(templatePath, result, _.upperCase(OutputType)).then(
            (pdf) => {
              res.set({
                "Content-Type": "application/pdf",
                "Content-Length": pdf.length,
              });
              res.status(HttpStatus.CREATED).send(pdf);
            }
          );
        }
      }
    });
  }

  //2021-03-01 govind
  @Post("getRegisterStockOutUnsold")
  getRegisterStockOutUnsold(
    @Body("OutputType") OutputType: any,
    @Res() res: Response,
    @Body("CompCode") CompCode: any
  ): any {
    return this.state.getRegisterStockOutUnsold(34, CompCode).then((result) => {
      if (_.upperCase(OutputType) === "JSON") {
        res.status(HttpStatus.CREATED).send(result);
      } else {
        let templatePath = "";
        if (process.platform.trim() === "linux") {
          templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
        } else {
          templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
        }

        if (_.upperCase(OutputType) === "HTML") {
          // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          printPdf(templatePath, result, _.upperCase(OutputType)).then(
            (html) => {
              res.status(HttpStatus.CREATED).send(html);
            }
          );
        } else {
          // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          printPdf(templatePath, result, _.upperCase(OutputType)).then(
            (pdf) => {
              res.set({
                "Content-Type": "application/pdf",
                "Content-Length": pdf.length,
              });
              res.status(HttpStatus.CREATED).send(pdf);
            }
          );
        }
      }
    });
  }

  //20210217 Hari/Govind/Saurav
  @Post("getDataInvRPTTopNSalesAnalysis")
  getDataInvRPTTopNSalesAnalysis(
    @Body("CompCode") CompCode: any,
    @Body("BranchCode") BranchCode: any,
    @Body("FromDate") FromDate: any,
    @Body("ToDate") ToDate: any,
    @Body("Analysis_On_QtyOrAmt") Analysis_On_QtyOrAmt: any,
    @Body("TopNRecords") TopNRecords: any,
    @Body("Analysis_Type") Analysis_Type: any,
    @Body("OutputType") OutputType: any,
    @Res() res: Response
  ): any {
    return this.invReports
      .getDataInvRPTTopNSalesAnalysis(
        27,
        CompCode,
        BranchCode,
        FromDate,
        ToDate,
        Analysis_On_QtyOrAmt,
        TopNRecords,
        Analysis_Type
      )
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }
  //20210104 Savrav
  @Post("getDayBookRegister")
  getDayBookRegister(
    @Body("FromDate") FromDate: any,
    @Body("ToDate") ToDate: any,
    @Body("OutputType") OutputType: any,
    @Body("CompCode") CompCode: any,
    @Res() res: Response
  ): any {
    return this.state
      .getDayBookReport(33, FromDate, ToDate, CompCode)
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }

  //20210301 Govind / Saurav
  @Post("getCashBookRegister")
  getCashBookRegister(
    @Body("FromDate") FromDate: any,
    @Body("ToDate") ToDate: any,
    @Body("OutputType") OutputType: any,
    @Body("CompCode") CompCode: any,
    @Res() res: Response
  ): any {
    return this.state
      .getCashBookReport(32, FromDate, ToDate, CompCode)
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }

  @Post("getTransferSlip")
  getTransferSlip(
    @Body("TranType") TranType: any,
    @Body("TranId") TranId: any,
    @Body("OutputType") OutputType: any,
    @Body("CompCode") CompCode: any,
    @Res() res: Response
  ): any {
    return this.state
      .getReceiptsAndPaymentSlip(35, TranType, TranId, CompCode)
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }

  //2021-03-13 govind
  @Post("getDataINVGetDataRPT_StockSummary")
  getDataINVGetDataRPT_StockSummary(
    @Body("CompCode") CompCode: any,
    @Body("BranchCode") BranchCode: any,
    @Body("DeptCode") DeptCode: any,
    @Body("FromDate") FromDate: any,
    @Body("ToDate") ToDate: any,
    @Body("GroupOn") GroupOn: any,
    @Body("Show_Qty_Amount_Both") Show_Qty_Amount_Both: any,
    @Body("OutputType") OutputType: any,
    @Res() res: Response
  ): any {
    return this.invReports
      .getDataINVGetDataRPT_StockSummary(
        37,
        CompCode,
        BranchCode,
        DeptCode,
        FromDate,
        ToDate,
        GroupOn,
        Show_Qty_Amount_Both
      )
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }
  //20210308 Saurav
  @Post("getBankWalletGatewayBookRegister")
  getBankWalletGatewayBookRegister(
    @Body("PayCode") PayCode: any,
    @Body("FromDate") FromDate: any,
    @Body("ToDate") ToDate: any,
    @Body("OutputType") OutputType: any,
    @Body("CompCode") CompCode: any,
    @Res() res: Response
  ): any {
    return this.state
      .getDataBankWalletGatewayBookDetail(
        36,
        PayCode,
        FromDate,
        ToDate,
        CompCode
      )
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }

  //2021-03-15 saurav
  @Post("getINVGetDataRPT_SalesAnalaysisDetail")
  getINVGetDataRPT_SalesAnalaysisDetail(
    @Body("CompCode") CompCode: any,
    @Body("BranchCode") BranchCode: any,
    @Body("DeptCode") DeptCode: any,
    @Body("FromDate") FromDate: any,
    @Body("ToDate") ToDate: any,
    @Body("GroupOn") GroupOn: any,
    @Body("OutputType") OutputType: any,
    @Res() res: Response
  ): any {
    return this.invReports
      .getINVGetDataRPT_SalesAnalaysisDetail(
        38,
        CompCode,
        BranchCode,
        DeptCode,
        FromDate,
        ToDate,
        GroupOn
      )
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }

  //2021-03-15 saurav
  @Post("getINVGetDataRPT_SalesAnalaysisSummary")
  getINVGetDataRPT_SalesAnalaysisSummary(
    @Body("CompCode") CompCode: any,
    @Body("BranchCode") BranchCode: any,
    @Body("DeptCode") DeptCode: any,
    @Body("FromDate") FromDate: any,
    @Body("ToDate") ToDate: any,
    @Body("SummaryType") SummaryType: any,
    @Body("OutputType") OutputType: any,
    @Res() res: Response
  ): any {
    return this.invReports
      .getINVGetDataRPT_SalesAnalaysisSummary(
        39,
        CompCode,
        BranchCode,
        DeptCode,
        FromDate,
        ToDate,
        SummaryType
      )
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }

  //2021-03-15 saurav
  @Post("getINVGetDataRPT_SalesComparisionDetail")
  getINVGetDataRPT_SalesComparisionDetail(
    @Body("CompCode") CompCode: any,
    @Body("BranchCode") BranchCode: any,
    @Body("DeptCode") DeptCode: any,
    @Body("ComparisionType") ComparisionType: any,
    @Body("GroupOn") GroupOn: any,
    @Body("OutputType") OutputType: any,
    @Res() res: Response
  ): any {
    return this.invReports
      .getINVGetDataRPT_SalesComparisionDetail(
        40,
        CompCode,
        BranchCode,
        DeptCode,
        ComparisionType,
        GroupOn
      )
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }

  //2021-03-16   saurav
  @Post("getINVGetDataRPT_SalesComparisionSummary")
  getINVGetDataRPT_SalesComparisionSummary(
    @Body("CompCode") CompCode: any,
    @Body("BranchCode") BranchCode: any,
    @Body("DeptCode") DeptCode: any,
    @Body("ComparisionType") ComparisionType: any,
    @Body("SummaryType") SummaryType: any,
    @Body("OutputType") OutputType: any,
    @Res() res: Response
  ): any {
    return this.invReports
      .getINVGetDataRPT_SalesComparisionSummary(
        41,
        CompCode,
        BranchCode,
        DeptCode,
        ComparisionType,
        SummaryType
      )
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }

  @Post("getSalesInvoiceNew")
  getSalesInvoiceNew(
    @Body("CompCode") CompCode: any,
    @Body("VoucherId") VoucherId: any,
    @Body("OutputType") OutputType: any,
    @Res() res: Response
  ): any {
    return this.state.getRPTSales(42, CompCode, VoucherId).then((result) => {
      // console.log(res,"sad")
      if (_.upperCase(OutputType) === "JSON") {
        res.status(HttpStatus.CREATED).send(result);
      } else {
        let templatePath = "";
        if (process.platform.trim() === "linux") {
          templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
        } else {
          templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
        }

        if (_.upperCase(OutputType) === "HTML") {
          printPdf(templatePath, result, _.upperCase(OutputType)).then(
            (html) => {
              res.status(HttpStatus.CREATED).send(html);
            }
          );
        } else {
          printPdf(templatePath, result, _.upperCase(OutputType)).then(
            (pdf) => {
              res.set({
                "Content-Type": "application/pdf",
                "Content-Length": pdf.length,
              });
              res.status(HttpStatus.CREATED).send(pdf);
            }
          );
        }
      }
    });
  }
  @Post("getINVGetDataRPT_StockSummaryMk")
  getINVGetDataRPT_StockSummaryMk(
    @Body("CompCode") CompCode: any,
    @Body("BranchCode") BranchCode: any,
    @Body("DeptCode") DeptCode: any,
    @Body("FromDate") FromDate: any,
    @Body("ToDate") ToDate: any,
    @Body("GroupOn") GroupOn: any,
    @Body("Show_Qty_Amount_Both") Show_Qty_Amount_Both: any,
    @Body("OutputType") OutputType: any,
    @Res() res: Response
  ): any {
    return this.invReports
      .getINVGetDataRPT_StockSummaryMk(
        42,
        CompCode,
        BranchCode,
        DeptCode,
        FromDate,
        ToDate,
        GroupOn,
        Show_Qty_Amount_Both
      )
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }

  @Post("getINVGetDataMKStockValuation")
  InvGetDataMKStockValuation(
    @Body("CompCode") pCompCode: any,
    @Body("FromDate") pFromDate: any,
    @Body("ToDate") pToDate: any,
    @Body("FromDateDOD") FromDateDOD: any,
    @Body("ToDateDOD") ToDateDOD: any,
    @Body("BoxNo") BoxNo: any,
    @Body("PacketNo") pPacketNo: any,
    @Body("DeliveryStatus") pDeliveryStatus: any,
    @Body("OutputType") OutputType: any,
    @Res() res: Response
  ): any {
    return this.state
      .InvGetDataMKStockValuation(
        43,
        pCompCode,
        pFromDate,
        pToDate,
        ToDateDOD,
        FromDateDOD,
        BoxNo,
        pPacketNo,
        pDeliveryStatus
      )
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }

  // 20210803 Siddharth
  @Post("getRPTSalesReturn")
  getRPTSalesReturn(
    @Body("VoucherId") VoucherId: any,
    @Body("OutputType") OutputType: any,
    @Body("CompCode") CompCode: any,
    @Res() res: Response
  ): any {
    return this.state
      .getRPTSalesReturn(44, VoucherId, CompCode)
      .then((result) => {
        // console.log(result);
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                // console.log(html, "html");
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }

  @Post("getRPTSalesOrder")
  getRPTSalesOrder(
    @Body("VoucherId") VoucherId: any,
    @Body("OutputType") OutputType: any,
    @Body("CompCode") CompCode: any,
    @Res() res: Response
  ): any {
    return this.state
      .getRPTSalesOrder(45, VoucherId, CompCode)
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }

  // sushil
  @Post("getDataRPTCallerRMPerformance")
  getDataRPTCallerRMPerformance(
    @Body("CompCode") CompCode: any,
    @Body("FromDate") FromDate: any,
    @Body("ToDate") ToDate: any,
    @Body("GroupOn") GroupOn: any,
    @Body("OutputType") OutputType: any,
    @Res() res: Response
  ): any {
    return this.invReports
      .getDataRPTCallerRMPerformance(50, CompCode, GroupOn, FromDate, ToDate)
      .then((result) => {
        if (_.upperCase(OutputType) === "JSON") {
          res.status(HttpStatus.CREATED).send(result);
        } else {
          let templatePath = "";
          if (process.platform.trim() === "linux") {
            templatePath = `${result.ReportConfig.Config.TemplatePath}/${result.ReportConfig.Config.TemplateName}`;
          } else {
            templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
          }

          if (_.upperCase(OutputType) === "HTML") {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (html) => {
                res.status(HttpStatus.CREATED).send(html);
              }
            );
          } else {
            // let templatePath = `\\${result.ReportConfig.Config.TemplatePath}\\${result.ReportConfig.Config.TemplateName}`;
            printPdf(templatePath, result, _.upperCase(OutputType)).then(
              (pdf) => {
                res.set({
                  "Content-Type": "application/pdf",
                  "Content-Length": pdf.length,
                });
                res.status(HttpStatus.CREATED).send(pdf);
              }
            );
          }
        }
      });
  }
}
