import { IsString,IsNumber, MinLength, MaxLength, Matches } from 'class-validator';


export class AuthCredentialsDto {
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(1)
  @MaxLength(10)
  CompCode: string;

  @IsString()
  password: string;
}
