import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  signal,
  ViewEncapsulation
} from '@angular/core';
import { BreadcrumbModel, BreadcrumbService } from '../../services/breadcrumb';
import { httpResource } from '@angular/common/http';
import { ODataModel } from '../../models/odata.model';
import { BranchModel } from '../../models/branch.model';
import { FlexiGridModule, FlexiGridService, StateModel } from 'flexi-grid';
import { NgxMaskPipe } from 'ngx-mask';
import { RouterLink } from '@angular/router';
import { HttpService } from '../../services/http';
import { FlexiToastService } from 'flexi-toast';
import Grid from '../../components/grid/grid';

@Component({
  imports: [Grid, FlexiGridModule, NgxMaskPipe],
  templateUrl: './branches.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Branches {
  readonly breadcrumbs = signal<BreadcrumbModel[]>([
    {
      title: 'Şubeler',
      icon: 'bi-buildings',
      url: '/branches',
      isActive: true,
    },
  ]);
}
