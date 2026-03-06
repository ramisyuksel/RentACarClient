import { EntityModel } from './entity.model';

export interface RentalExtraModel extends EntityModel {
  name: string;
  description: string;
  price: number;
}

export const initialRentalExtra: RentalExtraModel = {
  id: '',
  name: '',
  description: '',
  price: 0,
  createdAt: '',
  createdBy: '',
  updatedAt: '',
  updatedBy: '',
  isActive: true,
  createdFullName: '',
  updatedFullName: '',
};
