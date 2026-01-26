import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  linkedSignal,
  resource,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import Blank from '../../../components/blank/blank';
import { FormsModule, NgForm } from '@angular/forms';
import { FormValidateDirective } from 'form-validate-angular';
import { NgxMaskDirective } from 'ngx-mask';
import { DatePipe } from '@angular/common';
import {
  BreadcrumbModel,
  BreadcrumbService,
} from '../../../services/breadcrumb';
import { lastValueFrom } from 'rxjs';
import { CustomerModel, initialCustomer } from '../../../models/customer.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../services/http';
import { FlexiToastService } from 'flexi-toast';

@Component({
  imports: [Blank, FormsModule, FormValidateDirective, NgxMaskDirective],
  templateUrl: './create.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DatePipe],
})
export default class Create {
  readonly id = signal<string | undefined>(undefined);
  readonly breadcrumbs = signal<BreadcrumbModel[]>([
    {
      title: 'Müşteriler',
      icon: 'bi-people',
      url: '/customers',
    },
  ]);
  readonly pageTitle = computed(() =>
    this.id() ? 'Müşteri Güncelle' : 'Müşteri Ekle'
  );
  readonly pageIcon = computed(() => (this.id() ? 'bi-pen' : 'bi-plus'));
  readonly btnName = computed(() => (this.id() ? 'Güncelle' : 'Kaydet'));
  readonly result = resource({
    params: () => this.id(),
    loader: async () => {
      const res = await lastValueFrom(
        this.#http.getResource<CustomerModel>(`/rent/customers/${this.id()}`)
      );
      this.breadcrumbs.update((prev) => [
        ...prev,
        {
          title: res.data!.fullName,
          icon: 'bi-pen',
          url: `/customers/edit/${this.id()}`,
          isActive: true,
        },
      ]);
      this.#breadcrumb.reset(this.breadcrumbs());
      return res.data;
    },
  });
  readonly data = linkedSignal(
    () => this.result.value() ?? { ...initialCustomer }
  );
  readonly loading = linkedSignal(() => this.result.isLoading());

  readonly #breadcrumb = inject(BreadcrumbService);
  readonly #activated = inject(ActivatedRoute);
  readonly #http = inject(HttpService);
  readonly #toast = inject(FlexiToastService);
  readonly #router = inject(Router);
  readonly #date = inject(DatePipe);

  constructor() {
    this.#activated.params.subscribe((res) => {
      if (res['id']) {
        this.id.set(res['id']);
      } else {
        this.breadcrumbs.update((prev) => [
          ...prev,
          {
            title: 'Ekle',
            icon: 'bi-plus',
            url: '/customers/add',
            isActive: true,
          },
        ]);
        this.#breadcrumb.reset(this.breadcrumbs());
        const date = this.#date.transform('01.01.2000', 'yyyy-MM-dd')!;
        this.data.update((prev) => ({
          ...prev,
          dateOfBirth: date,
          drivingLicenseIssuanceDate: date,
        }));
      }
    });
  }

  save(form: NgForm) {
    if (!form.valid) return;

    this.loading.set(true);
    if (!this.id()) {
      this.#http.post<string>(
        '/rent/customers',
        this.data(),
        (res) => {
          this.#toast.showToast('Başarılı', res, 'success');
          this.#router.navigateByUrl('/customers');
          this.loading.set(false);
        },
        () => this.loading.set(false)
      );
    } else {
      this.#http.put<string>(
        '/rent/customers',
        this.data(),
        (res) => {
          this.#toast.showToast('Başarılı', res, 'info');
          this.#router.navigateByUrl('/customers');
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
