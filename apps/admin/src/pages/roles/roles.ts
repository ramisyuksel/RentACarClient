import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FlexiGridModule } from 'flexi-grid';
import Grid from '../../components/grid/grid';
import { BreadcrumbModel } from '../../services/breadcrumb';
import { RouterLink } from '@angular/router';
import { Common } from '../../services/common';

@Component({
  selector: 'app-roles',
  imports: [Grid, FlexiGridModule, RouterLink],
  templateUrl: './roles.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Roles {
  readonly bredcrumbs = signal<BreadcrumbModel[]>([
    {
      title: 'Roller',
      icon: 'bi-clipboard2-check',
      url: '/roles',
      isActive: true,
    },
  ]);

  readonly #common = inject(Common);

  checkPermission(permission: string) {
    return this.#common.checkPermission(permission);
  }
}
