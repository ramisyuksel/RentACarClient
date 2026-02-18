import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { initialReservation, ReservationModel } from '../../../models/reservation.model';
import Blank from '../../../components/blank/blank';
import { DatePipe, NgClass } from '@angular/common';
import { NgxMaskPipe } from 'ngx-mask';
import { TrCurrencyPipe } from 'tr-currency';
import {
  BreadcrumbModel,
  BreadcrumbService,
} from '../../../services/breadcrumb';
import { httpResource } from '@angular/common/http';
import { Result } from '../../../models/result.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [Blank, DatePipe, NgClass, NgxMaskPipe, TrCurrencyPipe],
  templateUrl: './detail.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Detail {
  readonly id = signal<string>('');
  readonly bredcrumbs = signal<BreadcrumbModel[]>([]);
  readonly result = httpResource<Result<ReservationModel>>(
    () => `/rent/reservations/${this.id()}`
  );
  readonly data = computed(
    () => this.result.value()?.data ?? initialReservation
  );
  readonly loading = computed(() => this.result.isLoading());
  readonly pageTitle = signal<string>('Rezervasyon Detayı');

  readonly #activated = inject(ActivatedRoute);
  readonly #breadcrumb = inject(BreadcrumbService);

  constructor() {
    this.#activated.params.subscribe((res) => {
      this.id.set(res['id']);
    });

    effect(() => {
      const breadCrumbs: BreadcrumbModel[] = [
        {
          title: 'Rezervasyonlar',
          icon: 'bi-calendar-check',
          url: '/reservations',
        },
      ];

      if (this.data()) {
        this.bredcrumbs.set(breadCrumbs);
        this.bredcrumbs.update((prev) => [
          ...prev,
          {
            title: this.data().reservationNumber,
            icon: 'bi-zoom-in',
            url: `/reservations/detail/${this.id()}`,
            isActive: true,
          },
        ]);
        this.#breadcrumb.reset(this.bredcrumbs());
      }
    });
  }

  getStatusClass() {
    switch (this.data().status) {
      case 'Bekliyor':
        return 'bg-warning';
      case 'Teslim Edildi':
        return 'bg-info';
      case 'Tamamlandı':
        return 'bg-success';
      case 'İptal Edildi':
        return 'bg-danger';
      default:
        return '';
    }
  }
}
