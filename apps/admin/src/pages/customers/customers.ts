import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { BreadcrumbModel, BreadcrumbService } from '../../services/breadcrumb';
import Grid from '../../components/grid/grid';
import { FlexiGridModule } from 'flexi-grid';
import { NgxMaskPipe } from 'ngx-mask';

@Component({
  imports: [Grid, FlexiGridModule, NgxMaskPipe],
  templateUrl: './customers.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Customers {
  readonly breadcrumbs = signal<BreadcrumbModel[]>([
    {
      title: 'Müşteriler',
      icon: 'bi-people',
      url: '/customers',
      isActive: true,
    },
  ]);

  constructor() {
    inject(BreadcrumbService).reset(this.breadcrumbs());
  }
}
