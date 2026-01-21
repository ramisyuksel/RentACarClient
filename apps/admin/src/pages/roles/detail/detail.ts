import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, ViewEncapsulation } from '@angular/core';
import { BreadcrumbModel, BreadcrumbService } from '../../../services/breadcrumb';
import { httpResource } from '@angular/common/http';
import { Result } from '../../../models/result.model';
import { BranchModel, initialBranch } from '../../../models/branch.model';
import { ActivatedRoute } from '@angular/router';
import Blank from '../../../components/blank/blank';
import { initialRole, RoleModel } from '../../../models/role.model';

@Component({
  imports: [Blank],
  templateUrl: './detail.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Detail {
  readonly id = signal<string>('');
  readonly bredcrumbs = signal<BreadcrumbModel[]>([]);
  readonly result = httpResource<Result<RoleModel>>(
    () => `/rent/roles/${this.id()}`
  );
  readonly data = computed(() => this.result.value()?.data ?? initialRole);
  readonly loading = computed(() => this.result.isLoading());
  readonly pageTitle = signal<string>('Rol Detay');

  readonly #activated = inject(ActivatedRoute);
  readonly #breadcrumb = inject(BreadcrumbService);

  constructor() {
    this.#activated.params.subscribe((res) => {
      this.id.set(res['id']);
    });

    effect(() => {
      const breadCrumbs: BreadcrumbModel[] = [
        {
          title: 'Roller',
          icon: 'bi-clipboard2-check',
          url: '/roles',
        },
      ];

      if (this.data()) {
        this.bredcrumbs.set(breadCrumbs);
        this.bredcrumbs.update((prev) => [
          ...prev,
          {
            title: this.data().name,
            icon: 'bi-zoom-in',
            url: `/roles/detail/${this.id()}`,
            isActive: true,
          },
        ]);
        this.#breadcrumb.reset(this.bredcrumbs());
      }
    });
  }
}
