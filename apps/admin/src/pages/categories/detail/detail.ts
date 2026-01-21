import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { Result } from '../../../models/result.model';
import Blank from '../../../components/blank/blank';
import {
  BreadcrumbModel,
  BreadcrumbService,
} from '../../../services/breadcrumb';
import { httpResource } from '@angular/common/http';
import { CategoryModel, initialCategory } from '../../../models/category.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [Blank],
  templateUrl: './detail.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Detail {
  readonly id = signal<string>('');
  readonly breadcrumbs = signal<BreadcrumbModel[]>([]);
  readonly result = httpResource<Result<CategoryModel>>(
    () => `/rent/categories/${this.id()}`
  );
  readonly data = computed(
    () => this.result.value()?.data ?? initialCategory
  );
  readonly loading = computed(() => this.result.isLoading());
  readonly pageTitle = signal<string>('Kategori Detay');

  readonly #activated = inject(ActivatedRoute);
  readonly #breadcrumb = inject(BreadcrumbService);

  constructor() {
    this.#activated.params.subscribe((res) => {
      this.id.set(res['id']);
    });

    effect(() => {
      const breadCrumbs: BreadcrumbModel[] = [
        {
          title: 'Kategoriler',
          icon: 'bi-tags',
          url: '/categories',
        },
      ];

      if (this.data()) {
        this.breadcrumbs.set(breadCrumbs);
        this.breadcrumbs.update((prev) => [
          ...prev,
          {
            title: this.data().name,
            icon: 'bi-zoom-in',
            url: `/categories/detail/${this.id()}`,
            isActive: true,
          },
        ]);
        this.#breadcrumb.reset(this.breadcrumbs());
      }
    });
  }
}
