import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  resource,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { TrCurrencyPipe } from 'tr-currency';
import {
  initialProtectionPackage,
  ProtectionPackageModel,
} from '../../../models/protection-package.model';
import Blank from '../../../components/blank/blank';
import {
  BreadcrumbModel,
  BreadcrumbService,
} from '../../../services/breadcrumb';
import { Result } from '../../../models/result.model';

@Component({
  imports: [Blank, TrCurrencyPipe],
  templateUrl: './detail.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProtectionPackageDetail {
  readonly id = signal<string>('');
  readonly bredcrumbs = signal<BreadcrumbModel[]>([]);
  readonly result = httpResource<Result<ProtectionPackageModel>>(
    () => `/rent/protection-packages/${this.id()}`
  );
  readonly data = computed(
    () => this.result.value()?.data ?? initialProtectionPackage
  );
  readonly loading = computed(() => this.result.isLoading());
  readonly pageTitle = signal<string>('Güvence Paketi Detay');

  readonly #activated = inject(ActivatedRoute);
  readonly #breadcrumb = inject(BreadcrumbService);

  constructor() {
    this.#activated.params.subscribe((res) => {
      this.id.set(res['id']);
    });

    effect(() => {
      const breadCrumbs: BreadcrumbModel[] = [
        {
          title: 'Güvence Paketleri',
          icon: 'bi-shield-check',
          url: '/protection-packages',
        },
      ];

      if (this.data()) {
        this.bredcrumbs.set(breadCrumbs);
        this.bredcrumbs.update((prev) => [
          ...prev,
          {
            title: this.data().name,
            icon: 'bi-zoom-in',
            url: `/protection-packages/detail/${this.id()}`,
            isActive: true,
          },
        ]);
        this.#breadcrumb.reset(this.bredcrumbs());
      }
    });
  }
}
