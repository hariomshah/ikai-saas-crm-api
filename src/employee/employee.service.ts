import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { Connection } from "typeorm";

@Injectable()
export class EmployeeService {
  private logger = new Logger("HelpService");

  constructor(private readonly conn: Connection) {}

  async insUpdtEmployeeMaster(data: any): Promise<any> {
    try {
      let query = `CALL spInsUpdtEmployeeMaster (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
      console.log(data, "data");
      //return await this.conn.query(query);
      const res = await this.conn.query(query, [
        data.CompCode,
        data.InsUpdtType,
        data.Id,
        data.EmpType,
        data.FirstName,
        data.MiddleName,
        data.LastName,
        data.bio,
        data.CategoryCode,
        data.QualificationCode,
        data.ExperienceCode,
        data.GradeCode,
        data.DOB,
        data.Gender,
        data.Address1,
        data.Address2,
        data.Address3,
        data.City,
        data.PinCode,
        data.State,
        data.Country,
        data.tel,
        data.mobile1,
        data.mobile2,
        data.email,
        data.AadharNo,
        data.PanNo,
        data.IsActive,
        data.UpdtUsr,
        data.DesignationCode,
        data.ProfilePicture,
        data.pathType === null ? "U" : data.pathType,
        data.ReportingManager,
      ]);
      // console.log('employee design', data.DesignationCode)
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);
      // console.log(error.message);
      throw new InternalServerErrorException();
    }
  }

  async getEmployees(CompCode): Promise<any> {
    try {
      let query = `CALL spGetEmployees (?)`;
      const res = await this.conn.query(query, [CompCode]);
      return { message: "successful", data: res[0] };
    } catch (error) {
      this.logger.error(error);

      throw new InternalServerErrorException();
    }
  }
}
