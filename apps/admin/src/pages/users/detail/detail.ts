import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import Blank from '../../../components/blank/blank';
import {
  BreadcrumbModel,
  BreadcrumbService,
} from '../../../services/breadcrumb';
import { httpResource } from '@angular/common/http';
import { Result } from '../../../models/result.model';
import { initialRole, RoleModel } from '../../../models/role.model';
import { ActivatedRoute } from '@angular/router';
import { initialUser, UserModel } from '../../../models/user.model';

@Component({
  imports: [Blank],
  templateUrl: './detail.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Detail {
  readonly id = signal<string>('');
  readonly breadcrumbs = signal<BreadcrumbModel[]>([]);
  readonly result = httpResource<Result<UserModel>>(
    () => `/rent/users/${this.id()}`
  );
  readonly data = computed(() => this.result.value()?.data ?? initialUser);
  readonly loading = computed(() => this.result.isLoading());
  readonly pageTitle = signal<string>('Kullanıcı Detay');

  readonly #activated = inject(ActivatedRoute);
  readonly #breadcrumb = inject(BreadcrumbService);

  constructor() {
    this.#activated.params.subscribe((res) => {
      this.id.set(res['id']);
    });

    effect(() => {
      const breadCrumbs: BreadcrumbModel[] = [
        {
          title: 'Kullanıcılar',
          icon: 'bi-people',
          url: '/users',
        },
      ];

      if (this.data()) {
        this.breadcrumbs.set(breadCrumbs);
        this.breadcrumbs.update((prev) => [
          ...prev,
          {
            title: this.data().fullName,
            icon: 'bi-zoom-in',
            url: `/users/detail/${this.id()}`,
            isActive: true,
          },
        ]);
        this.#breadcrumb.reset(this.breadcrumbs());
      }
    });
  }
}
