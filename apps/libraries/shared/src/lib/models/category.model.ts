import { EntityModel } from './entity.model';

export interface CategoryModel extends EntityModel {
  name: string;
}

export const initialCategory: CategoryModel = {
  id: '',
  name: '',
  createdAt: '',
  createdBy: '',
  createdFullName: '',
  updatedAt: '',
  updatedBy: '',
  updatedFullName: '',
  isActive: true,
};
