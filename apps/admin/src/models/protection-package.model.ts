import { EntityModel } from './entity.model';

export interface ProtectionPackageModel extends EntityModel {
  name: string;
  price: number;
  isRecommended: boolean;
  coverages: string[];
}

export const initialProtectionPackage: ProtectionPackageModel = {
  id: '',
  name: '',
  price: 0,
  isRecommended: false,
  coverages: [],
  createdAt: '',
  createdBy: '',
  updatedAt: '',
  updatedBy: '',
  isActive: true,
  createdFullName: '',
  updatedFullName: '',
};
