/**
 * @fileoverview
 * Serial number configuration service file to handle all serial number related functionality.
 *
 * @version
 * API version 1.0.
 *
 * @author
 * KATALYST TEAM
 *
 * @license
 * Licensing information, if applicable.
 */
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SerialNumberConfigurationRepository } from './repository';

@Injectable()
export class SerialNumberConfigurationService {
  constructor(
    private serialNumberConfigurationRepository: SerialNumberConfigurationRepository,
  ) {}

  /**
   * @description
   * Function to fetch current serial as per module
   */
  async fetchSerialNumber(moduleName: string) {
    try {
      const serialNumberCondition = {
        select: {
          id: true,
          module: true,
          alias: true,
          current_number: true,
        },
        where: {
          module: moduleName,
        },
      };
      const data = await this.serialNumberConfigurationRepository.findOne(
        serialNumberCondition.select,
        serialNumberCondition.where,
      );
      if (!data) {
        throw new BadRequestException('Error while generating unique id.');
      }
      await this.incrementUniqueId(data.id, data.current_number);
      return {
        alias: data.alias,
        uniqueNumber: data.current_number
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to increase current serial number
   */
  public async incrementUniqueId(id: number, currentValue: number) {
    try {
      let incrementedCurrentValue = currentValue + 1;
      const serialNumberCondition = {
        where: {
          id: id,
        },
        payload: {
          current_number: incrementedCurrentValue,
        },
      };
      await this.serialNumberConfigurationRepository.update(
        serialNumberCondition.where,
        serialNumberCondition.payload,
      );
    } catch (error) {
      throw error;
    }
  }
}
