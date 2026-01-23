import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { Common } from '../../services/common';
import Grid from '../../components/grid/grid';
import { FlexiGridModule } from 'flexi-grid';
import { BreadcrumbModel } from '../../services/breadcrumb';

@Component({
  imports: [Grid, FlexiGridModule],
  templateUrl: './vehicles.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Vehicles {
  readonly breadcrumbs = signal<BreadcrumbModel[]>([
    {
      title: 'Araçlar',
      icon: 'bi-car-front',
      url: '/vehicles',
      isActive: true,
    },
  ]);

  readonly #common = inject(Common);

  checkPermission(permission: string) {
    return this.#common.checkPermission(permission);
  }
}
