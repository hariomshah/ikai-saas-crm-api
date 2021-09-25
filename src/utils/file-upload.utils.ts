import { extname } from 'path';
import moment = require("moment");

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.split("|")[file.originalname.split("|").length - 1].match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

export const editFileName = (req, file, callback) => {
  const name = file.originalname.split("|")[file.originalname.split("|").length - 1].split('.')[0];
  const fileExtName = extname(file.originalname.split("|")[file.originalname.split("|").length - 1]);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${moment().format("DD-MM-YYYY")}-${randomName}${fileExtName}`);
};
