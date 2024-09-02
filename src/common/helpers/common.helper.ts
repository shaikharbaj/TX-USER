import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import * as bcrypt from "bcrypt";
import * as crypto from 'crypto';

@Injectable()
export class CommonHelper {
  constructor(private configService: ConfigService) { }

  /**
   * @description
   * Function to pluck particular key from array of object
   */
  public recursivePluck(data: any, keyToPluck: string): Array<string> {
    let result = [];
    function recursive(obj: any) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === "object") {
            // If the current property is an object, recursively call the function
            recursive(obj[key]);
          } else if (key === keyToPluck) {
            // If the key matches, add its value to the result array
            result.push(obj[key]);
          }
        }
      }
    }
    // Start the recursive process
    data.forEach((d: any) => {
      recursive(d);
    });
    return result;
  }

  /**
   * @description
   * Function to pluck particular key from array of object
   */
  public pluck(
    data: any,
    keyToPluck: string,
    stringArray: boolean = false
  ): Array<string> {
    // Use map to extract the specified key from each object
    const pluckedData = data.map((obj: any) => {
      if (stringArray === true) {
        return obj[keyToPluck].toString();
      } else {
        return obj[keyToPluck];
      }
    });
    return pluckedData;
  }

  /**
   * @description
   * Function to pluck particular key from array of object
   */
  public groupArray(data: any, key: string) {
    const groupedArr = data.reduce((acc: any, d: any) => {
      const groupKey = d[key];
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(d);
      return acc;
    }, {});
    return groupedArr;
  }

  /**
   * @description
   * Function to convert array of objects to key value pair object
   */
  public arrayToKeyValueObject(array: any, valueKey: string) {
    const resultObject = array.reduce((acc: any, obj: any) => {
      acc[obj[valueKey]] = obj;
      return acc;
    }, {});
    return resultObject;
  }

  /**
   * @description
   * Function to encode password
   */
  async encodePassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  /**
   * @description
   * Function to check valid password
   */
  public isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }


  /**
   * @description
   * Function to generate unique id
   */
  generateUniqueId(alias: string, serialNumber: number) {
    const paddedNumber = String(serialNumber).padStart(5, "0");
    return `${alias}-${paddedNumber}`;
  }

  /**
   * @description
   * Function to generate random otp
   */
  public generateRandomOtp(): number {
    return Math.floor(1000 + Math.random() * 9000);
  }

  /**
 * @description
 * Function to get user path of s3 bucket
 */
  public userFolderPath(folder: string, userId: number) {
    const environment = this.configService.get('APP_ENV');
    let userFolderPath = `users/${userId}/${folder}/`;
    if (environment === 'development') {
      userFolderPath = `users/local/${userId}/${folder}/`;
    }
    return userFolderPath;
  }

  /**
* @description
* Function to get extension from mimetype
*/
  public mimeTypeExtension(mimeType: string) {
    const extension = mimeType.split('/');
    return extension?.[1];
  }

  /**
 * @description
 * Function to generate random file name
 */
  public generateRandomFileName(extension: string) {
    const randomBytes = crypto.randomBytes(16); // Adjust length as needed
    return randomBytes.toString('hex') + '.' + extension;
  }


  /**
* @description
* Function to generate email payload
*/
  public generateEmailPayload(payload: any) {
    return {
      template: payload.template,
      email: {
        to: payload.to,
        subject: payload.subject,
        data: payload.data,
      },
    };
  }
  /**
 * @description
 * Function to generate email payload
 */
  public generateResetPasswordLink(token: string) {
    const baseUrl = "http://localhost:3000/reset-password";
    const resetLink = `${baseUrl}?token=${token}`;
    return resetLink;
  }

}
