import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  BreadcrumbModel,
  BreadcrumbService,
} from '../../../services/breadcrumb';
import Blank from '../../../components/blank/blank';
import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Result } from '../../../models/result.model';
import { CustomerModel, initialCustomer } from '../../../models/customer.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [Blank, DatePipe],
  templateUrl: './detail.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export default class Detail {
  readonly id = signal<string>('');
  readonly breadcrumbs = signal<BreadcrumbModel[]>([]);
  readonly result = httpResource<Result<CustomerModel>>(
    () => `/rent/customers/${this.id()}`
  );
  readonly data = computed(() => this.result.value()?.data ?? initialCustomer);
  readonly loading = computed(() => this.result.isLoading());
  readonly pageTitle = signal<string>('Müşteri Detay');

  readonly #activated = inject(ActivatedRoute);
  readonly #breadcrumb = inject(BreadcrumbService);

  constructor() {
    this.#activated.params.subscribe((res) => {
      this.id.set(res['id']);
    });

    effect(() => {
      const breadCrumbs: BreadcrumbModel[] = [
        {
          title: 'Müşteriler',
          icon: 'bi-people',
          url: '/customers',
        },
      ];

      if (this.data()) {
        this.breadcrumbs.set(breadCrumbs);
        this.breadcrumbs.update((prev) => [
          ...prev,
          {
            title: this.data().fullName,
            icon: 'bi-zoom-in',
            url: `/customers/detail/${this.id()}`,
            isActive: true,
          },
        ]);
        this.#breadcrumb.reset(this.breadcrumbs());
      }
    });
  }
}
