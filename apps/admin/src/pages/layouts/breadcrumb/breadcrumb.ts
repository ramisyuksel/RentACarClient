import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BreadcrumbService } from '../../../services/breadcrumb';

@Component({
  selector: 'app-breadcrumb',
  imports: [RouterLink, NgClass],
  templateUrl: './breadcrumb.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Breadcrumb {
  readonly breadcrumb = inject(BreadcrumbService);
}
