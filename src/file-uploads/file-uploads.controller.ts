import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Res,
  Param,
  Body,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { editFileName, imageFileFilter } from "../utils/file-upload.utils";
import { extname } from "path";
import AuthGuard from "src/auth/auth.guard";
import { UseGuards } from "@nestjs/common";
// var multer = require('multer')
var fs = require("fs");
// var upload = multer({ dest: 'uploads/' })

// @UseGuards(AuthGuard())
@Controller("file-uploads")
export class FileUploadsController {
  @Post()
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: `${process.platform === "linux" ? ".." : "."}/uploads`,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  async uploadedFiles(@UploadedFile() file) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    return response;
  }

  @Post("single")
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: function(req, file, callback) {
          // const reg = /[|]/g;
          // console.log(
          //  file.originalname
          // );
          let path;

          if (process.env.NODE_ENV === "production") {
            console.log("6")
            path = `${process.platform === "linux" ? ".." : "."}/uploads/${
              file.originalname.replace("|", "/").split("|")[0]
            }`;
          } else {
            console.log("5")
            path = `./uploads/${
              file.originalname.replace("|", "/").split("|")[0]
            }`;
          }

          fs.mkdirSync(path, { recursive: true });
          return callback(null, path);
        },
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  async uploadedFile(@UploadedFile() file, @Body() body) {
    // console.log(file, "file", body)
    const response = {
      originalname: file.originalname,
      fileName: file.filename,
    };
    return response;
  }

  // @Post('single')
  // async uploadedFile(@UploadedFile() file, @Body() body) {
  //     console.log(file, "file", body)
  //     var storage = multer.diskStorage({
  //         destination: function (req, file, cb) {
  //             cb(null, '/tmp/my-uploads')
  //         },
  //         filename: function (req, file, cb) {
  //             cb(null, file.fieldname + '-' + Date.now())
  //         }
  //     })

  //     var upload = multer({ storage: storage })
  //     // const response = {
  //     //     originalname: file.originalname,
  //     //     filename: file.filename,
  //     // };
  //     // return response;
  // }

  @Post("multiple")
  @UseInterceptors(
    FilesInterceptor("image", 20, {
      storage: diskStorage({
        destination: `${process.platform === "linux" ? ".." : "."}/uploads`,
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  async uploadMultipleFiles(@UploadedFiles() files) {
    const response = [];
    files.forEach((file) => {
      const fileReponse = {
        originalname: file.originalname,
        filename: file.filename,
      };
      response.push(fileReponse);
    });
    return response;
  }

  @Get(":imgpath")
  seeUploadedFile(@Param("imgpath") image, @Res() res) {
    return res.sendFile(image, {
      root: `${process.platform === "linux" ? ".." : "."}/uploads`,
    });
  }

  @Post("singleMutiFile")
  @UseInterceptors(
    FileInterceptor("image", {
      storage: diskStorage({
        destination: function(req, file, callback) {
          const Filename = file.originalname.split("|")[
            file.originalname.split("|").length - 1
          ];
          const reg = /[|]/g;
          console.log("3")
          const UploadingDir = file.originalname.replace(Filename, "");

          let path;

          if (process.env.NODE_ENV === "production") {
            console.log("4")
            path = `${
              process.platform === "linux" ? ".." : "."
            }/uploads/${UploadingDir.replace(reg, "/")}`;
          } else {
            console.log("2")
            path = `./uploads/${UploadingDir.replace(reg, "/")}`;
          }

          // console.log("file", UploadingDir, reg, path);
          fs.mkdirSync(path, { recursive: true });
          return callback(null, path);
        },
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  async uploadedFileMultiFile(@UploadedFile() file, @Body() body) {
    const response = {
      originalname: file.originalname,
      fileName: file.filename,
    };
    return response;
  }
}
