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
import { httpResource } from '@angular/common/http';
import { Result } from '../../../models/result.model';
import {
  initialProtectionPackage,
  ProtectionPackageModel,
} from '../../../models/protection-package.model';
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
  readonly breadcrumbs = signal<BreadcrumbModel[]>([]);
  readonly result = httpResource<Result<ProtectionPackageModel>>(
    () => `/rent/protection-packages/${this.id()}`
  );
  readonly data = computed(
    () => this.result.value()?.data ?? initialProtectionPackage
  );
  readonly loading = computed(() => this.result.isLoading());
  readonly pageTitle = computed(() => this.data().name);

  readonly #activated = inject(ActivatedRoute);
  readonly #breadcrumb = inject(BreadcrumbService);

  constructor() {
    this.#activated.params.subscribe((res) => {
      this.id.set(res['id']);
    });

    effect(() => {
      const breadCrumbs: BreadcrumbModel[] = [
        {
          title: 'Koruma Paketleri',
          icon: 'bi-shield-check',
          url: '/protection-packages',
        },
      ];

      if (this.data()) {
        this.breadcrumbs.set(breadCrumbs);
        this.breadcrumbs.update((prev) => [
          ...prev,
          {
            title: this.data().name,
            icon: 'bi-zoom-in',
            url: `/protection-packages/detail/${this.id()}`,
            isActive: true,
          },
        ]);
        this.#breadcrumb.reset(this.breadcrumbs());
      }
    });
  }
}
