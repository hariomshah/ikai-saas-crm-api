// import  * as puppeteer from 'puppeteer'
//  import * as fs from 'fs';
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

const express = require("express");
// const app = express();
// // app.use(express.static('C:/Working/SkyelintAPI/src/html-reports'))
// // app.listen(3000);

export const printPdf = async (templatePath, data, pOutputType) => {
  // console.log(
  //   "current os is",
  //   process.platform,
  //   process.cwd(),
  //   `/src/html-reports/Templates/${templatePath}.html`
  // );
  // console.log('template',templatePath.split("\\").join("/"))
  const templateHtml = fs.readFileSync(
    path.join(
      process.cwd(),
      process.platform === "linux" || process.platform === "darwin"
        ? `/src/html-reports/Templates/${templatePath.split("\\").join("/")}.html`
        : `src\\html-reports\\Templates\\${templatePath}.html`
    ),
    "utf8"
  );
      // console.log('sss',templateHtml)
  const template = handlebars.compile(templateHtml);

  handlebars.registerHelper("if_checkStatus", function(a, opts) {
    if (a === "RJCT" || a === "CNL") {
      return opts.fn(this);
    } else {
      return opts.inverse(this);
    }
  });
  handlebars.registerHelper("if_ViewType", function(a, opts) {
    if (a === "DETAIL") {
      return opts.fn(this);
    } else {
      return opts.inverse(this);
    }
  });
  handlebars.registerHelper("json", function(context) {
    // console.log('some contecst',context, JSON.stringify(context))
    return JSON.stringify(context);
  });

  // let tempData = {
  //   image: fs.readFileSync(path.join(
  //     process.cwd(),
  //     `src\\html-reports\\logo.png`
  //   )).toString("base64"),
  // };

  // Buffer.allocUnsafe(), or Buffer.from()
  // let covImage = ;

  // let tempData = {
  //   image: "http://localhost:3000/logo.png",
  // };
  // console.log(tempData)
  // let tempData = {
  //   image: `file:///${path.join(process.cwd(), `src\\html-reports\\logo.png`)}`,
  // };

  // function base64_encode(file) {
  //   var bitmap = fs.readFileSync(file);
  //   return Buffer.from(bitmap).toString("base64");
  // }

  // let tempData = {
  //   image:
  //     "data:image/png;base64," +
  //    await base64_encode(path.join(process.cwd(), `src\\html-reports\\logo.png`)),
  // };

  // console.log(tempData);
  const html = template(data);
  // console.log(html);
  let milis = Math.round(+new Date() / 1000); //new Date();
  // milis = milis.getTime();

  // let pdfPath ="";
  // if (process.platform === "linux"){
  //   pdfPath= path.join("src/html-reports/TempPdfs", `${milis}.pdf`);
  // }else{
  //   pdfPath= path.join("src\\html-reports\\TempPdfs", `${milis}.pdf`);
  // }
  const pdfPath =
    process.platform === "linux"  || process.platform === "darwin"
      ? path.join(process.cwd() + "/src/html-reports/TempPdfs", `${milis}.pdf`)
      : path.join("src\\html-reports\\TempPdfs", `${milis}.pdf`);
  // const pdfPath =`${milis}.pdf`;

  let options = {};

  if (data.ReportConfig.Config.Width !== null) {
    options = { ...options, width: data.ReportConfig.Config.Width };
  }

  if (data.ReportConfig.Config.Height !== null) {
    options = { ...options, height: data.ReportConfig.Config.Height };
  }

  if (data.ReportConfig.Config.headerTemplate !== null) {
    options = {
      ...options,
      headerTemplate: data.ReportConfig.Config.headerTemplate,
    };
  }

  if (data.ReportConfig.Config.footerTemplate !== null) {
    options = {
      ...options,
      footerTemplate: data.ReportConfig.Config.footerTemplate,
    };
  }

  if (data.ReportConfig.Config.Printbaground !== null) {
    options = {
      ...options,
      printBackground:
        data.ReportConfig.Config.Printbaground === "Y" ? true : false,
    };
  }

  if (data.ReportConfig.Config.Landscape !== null) {
    options = {
      ...options,
      landscape: data.ReportConfig.Config.Landscape === "Y" ? true : false,
    };
  }

  if (data.ReportConfig.Config.Scale !== null) {
    options = {
      ...options,
      scale: parseFloat(data.ReportConfig.Config.Scale),
    };
  }

  if (data.ReportConfig.Config.PageFormats !== null) {
    options = {
      ...options,
      format: data.ReportConfig.Config.PageFormats,
    };
  }

  if (data.ReportConfig.Config.PageRanges !== null) {
    options = {
      ...options,
      PageRanges: data.ReportConfig.Config.PageRanges,
    };
  }

  options = {
    ...options,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    margin:
      data.ReportConfig.Config.MarginTop !== null &&
      data.ReportConfig.Config.MarginBottom !== null &&
      data.ReportConfig.Config.MarginLeft !== null &&
      data.ReportConfig.Config.MarginRight !== null
        ? {
            top:
              data.ReportConfig.Config.MarginTop !== null
                ? data.ReportConfig.Config.MarginTop
                : "0px",
            bottom:
              data.ReportConfig.Config.MarginBottom !== null
                ? data.ReportConfig.Config.MarginBottom
                : "0px",
            left:
              data.ReportConfig.Config.MarginLeft !== null
                ? data.ReportConfig.Config.MarginLeft
                : "0px",
            right:
              data.ReportConfig.Config.MarginRight !== null
                ? data.ReportConfig.Config.MarginRight
                : "0px",
          }
        : 0,
    path: pdfPath,
  };
  // console.log(options,"optiosn");
  const browser = await puppeteer.launch({
    // args: ["--no-sandbox"],
    headless: true,
  });

  if (pOutputType === "HTML") {
    return html;
  }

  const page = await browser.newPage();

  // await page.goto(`data:text/html,${html}`, { waitUntil: "networkidle0" });
  await page.setContent(html, { waitUntil: "networkidle0" });

  if (process.platform.trim() === "linux" || process.platform === "darwin") {
    await page.addStyleTag({
      path: path.join(process.cwd(), "/src/html-reports/style.css"),
    });
  } else {
    await page.addStyleTag({
      path: path.join(process.cwd(), "src\\html-reports\\style.css"),
    });
  }
  // console.log(options, "options");
  const pdf = await page.pdf({
    ...options,
  });

  await browser.close();

  fs.unlink(pdfPath, function(err) {
    if (err) throw err;
    console.log("Temp File deleted!");
  });

  return pdf;
};
