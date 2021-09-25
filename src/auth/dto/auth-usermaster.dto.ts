import { IsString,IsNumber, MinLength, MaxLength, Matches } from 'class-validator';


export class AuthUserMasterDto {
  @IsString()
  CompCode: string;

  @IsString()
  @MinLength(1)
  @MaxLength(1)
  userType: string;

  @IsString()
  userId: string;

//   @IsNumber()
  @IsString()
  mobileno: string;
}
