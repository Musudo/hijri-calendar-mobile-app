import { fetchAladhanApi } from '~/axios/configs/aladhanAxios';
import { TGenericObject } from '~/types/commonTypes';

const axiosServices = [fetchAladhanApi];

export const initAxiosServices = (queryParams: TGenericObject = {}) => {
  // axiosServices.forEach((service) => {
  // })
};
