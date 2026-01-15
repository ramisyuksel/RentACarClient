import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal, resource,
  signal,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbModel, BreadcrumbService } from '../../../services/breadcrumb';
import Blank from '../../../components/blank/blank';
import { FormsModule, NgForm } from '@angular/forms';
import { FormValidateDirective } from 'form-validate-angular';
import { NgClass } from '@angular/common';
import { lastValueFrom } from 'rxjs';
import { BranchModel, initialBranch } from '../../../models/branch.model';
import { HttpService } from '../../../services/http';
import { FlexiToastService } from 'flexi-toast';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  imports: [
    Blank,
    FormsModule,
    FormValidateDirective,
    NgClass,
    NgxMaskDirective,
  ],
  templateUrl: './create.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Create {
  readonly id = signal<string | undefined>(undefined);
  readonly bredcrumbs = signal<BreadcrumbModel[]>([
    {
      title: 'Şubeler',
      icon: 'bi-buildings',
      url: '/branches',
    },
  ]);
  readonly pageTitle = computed(() =>
    this.id() ? 'Şube Güncelle' : 'Şube Ekle'
  );
  readonly pageIcon = computed(() => (this.id() ? 'bi-pen' : 'bi-plus'));
  readonly btnName = computed(() => (this.id() ? 'Güncelle' : 'Kaydet'));
  readonly result = resource({
    params: () => this.id(),
    loader: async () => {
      const res = await lastValueFrom(
        this.#http.getResource<BranchModel>(`/rent/branches/${this.id()}`)
      );

      this.bredcrumbs.update((prev) => [
        ...prev,
        {
          title: res.data!.name,
          icon: 'bi-pen',
          url: `/branches/edit/${this.id()}`,
          isActive: true,
        },
      ]);
      this.#breadcrumb.reset(this.bredcrumbs());
      return res.data;
    },
  });
  readonly data = linkedSignal(() => this.result.value() ?? { ...initialBranch });
  readonly loading = linkedSignal(() => this.result.isLoading());

  readonly #breadcrumb = inject(BreadcrumbService);
  readonly #activated = inject(ActivatedRoute);
  readonly #http = inject(HttpService);
  readonly #toast = inject(FlexiToastService);
  readonly #router = inject(Router);

  constructor() {
    this.#activated.params.subscribe((res) => {
      if (res['id']) {
        this.id.set(res['id']);
      } else {
        this.bredcrumbs.update((prev) => [
          ...prev,
          {
            title: 'Ekle',
            icon: 'bi-plus',
            url: '/branches/add',
            isActive: true,
          },
        ]);
        this.#breadcrumb.reset(this.bredcrumbs());
      }
    });
  }

  save(form: NgForm) {
    if (!form.valid) return;

    if (!this.id()) {
      this.loading.set(true);
      this.#http.post<string>(
        '/rent/branches',
        this.data(),
        (res) => {
          this.#toast.showToast('Başarılı', res, 'success');
          this.#router.navigateByUrl('/branches');
          this.loading.set(false);
        },
        () => this.loading.set(false)
      );
    } else {
      this.loading.set(true);
      this.#http.put<string>(
        '/rent/branches',
        this.data(),
        (res) => {
          this.#toast.showToast('Başarılı', res, 'info');
          this.#router.navigateByUrl('/branches');
          this.loading.set(false);
        },
        () => this.loading.set(false)
      );
    }
  }

  changeStatus(status: boolean) {
    this.data.update((prev) => ({
      ...prev,
      isActive: status,
    }));
  }
}
