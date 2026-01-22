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
  initialRentalExtra,
  RentalExtraModel,
} from '../../../models/rental-extra.model';
import { Result } from '../../../models/result.model';
import Blank from '../../../components/blank/blank';
import { httpResource } from '@angular/common/http';
import {
  BreadcrumbModel,
  BreadcrumbService,
} from '../../../services/breadcrumb';
import { ActivatedRoute } from '@angular/router';
import { TrCurrencyPipe } from 'tr-currency';

@Component({
  imports: [Blank, TrCurrencyPipe],
  templateUrl: './detail.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Detail {
  readonly id = signal<string>('');
  readonly bredcrumbs = signal<BreadcrumbModel[]>([]);
  readonly result = httpResource<Result<RentalExtraModel>>(
    () => `/rent/rental-extras/${this.id()}`
  );
  readonly data = computed(
    () => this.result.value()?.data ?? initialRentalExtra
  );
  readonly loading = computed(() => this.result.isLoading());
  readonly pageTitle = signal<string>('Ekstra Detay');

  readonly #activated = inject(ActivatedRoute);
  readonly #breadcrumb = inject(BreadcrumbService);

  constructor() {
    this.#activated.params.subscribe((res) => {
      this.id.set(res['id']);
    });

    effect(() => {
      const breadCrumbs: BreadcrumbModel[] = [
        {
          title: 'Ekstralar',
          icon: 'bi-plus-square',
          url: '/extra',
        },
      ];

      if (this.data()) {
        this.bredcrumbs.set(breadCrumbs);
        this.bredcrumbs.update((prev) => [
          ...prev,
          {
            title: this.data().name,
            icon: 'bi-zoom-in',
            url: `/extra/detail/${this.id()}`,
            isActive: true,
          },
        ]);
        this.#breadcrumb.reset(this.bredcrumbs());
      }
    });
  }
}
