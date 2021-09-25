
import * as bcrypt from 'bcryptjs';

export class User {

  id: number;

  username: string;

  password: string;

  salt: string;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hashSync(password, this.salt);
    return hash === this.password;
  }
}
