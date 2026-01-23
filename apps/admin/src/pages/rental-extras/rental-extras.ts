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
  templateUrl: './rental-extras.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RentalExtras {
  readonly breadcrumbs = signal<BreadcrumbModel[]>([
    {
      title: 'Ekstralar',
      icon: 'bi-plus-square',
      url: '/extra',
      isActive: true,
    },
  ]);

  readonly #common = inject(Common);

  checkPermission(permission: string) {
    return this.#common.checkPermission(permission);
  }
}
