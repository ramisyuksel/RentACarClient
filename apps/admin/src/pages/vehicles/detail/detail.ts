import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { FeatureGroup } from '../create/create';
import Blank from '../../../components/blank/blank';
import { CommonModule } from '@angular/common';
import { TrCurrencyPipe } from 'tr-currency';
import {
  BreadcrumbModel,
  BreadcrumbService,
} from '../../../services/breadcrumb';
import { httpResource } from '@angular/common/http';
import { Result } from '../../../models/result.model';
import { initialVehicle, VehicleModel } from '../../../models/vehicle.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [Blank, CommonModule, TrCurrencyPipe],
  templateUrl: './detail.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Detail {
  readonly id = signal<string>('');
  readonly breadcrumbs = signal<BreadcrumbModel[]>([]);
  readonly result = httpResource<Result<VehicleModel>>(
    () => `/rent/vehicles/${this.id()}`
  );
  readonly data = computed(
    () => this.result.value()?.data ?? initialVehicle
  );
  readonly loading = computed(() => this.result.isLoading());
  readonly pageTitle = signal<string>('Araç Detay');

  readonly featureGroups: FeatureGroup[] = [
    {
      group: 'Güvenlik Özellikleri',
      features: [
        { key: 'Airbag', label: 'Airbag', icon: 'bi-shield' },
        { key: 'ABS', label: 'ABS', icon: 'bi-shield-exclamation' },
        { key: 'ESP', label: 'ESP', icon: 'bi-shield-check' },
        { key: 'Alarm Sistemi', label: 'Alarm Sistemi', icon: 'bi-bell' },
      ],
    },
    {
      group: 'Sürüş Destekleri',
      features: [
        { key: 'GPS Navigasyon', label: 'GPS Navigasyon', icon: 'bi-geo-alt' },
        {
          key: 'Park Sensörü',
          label: 'Park Sensörü',
          icon: 'bi-broadcast-pin',
        },
        {
          key: 'Geri Görüş Kamerası',
          label: 'Geri Görüş Kamerası',
          icon: 'bi-camera-video',
        },
        {
          key: 'Cruise Control',
          label: 'Cruise Control',
          icon: 'bi-speedometer2',
        },
      ],
    },
    {
      group: 'Konfor Özellikleri',
      features: [
        { key: 'Klima', label: 'Klima', icon: 'bi-snow' },
        {
          key: 'Isıtmalı Koltuk',
          label: 'Isıtmalı Koltuk',
          icon: 'bi-thermometer-half',
        },
        { key: 'Sunroof', label: 'Sunroof', icon: 'bi-brightness-high' },
        { key: 'Bluetooth', label: 'Bluetooth', icon: 'bi-bluetooth' },
      ],
    },
    {
      group: 'Multimedya',
      features: [
        {
          key: 'Dokunmatik Ekran',
          label: 'Dokunmatik Ekran',
          icon: 'bi-tablet',
        },
        { key: 'USB Bağlantısı', label: 'USB Bağlantısı', icon: 'bi-usb' },
        {
          key: 'Premium Ses Sistemi',
          label: 'Premium Ses Sistemi',
          icon: 'bi-music-note-beamed',
        },
        { key: 'Apple CarPlay', label: 'Apple CarPlay', icon: 'bi-phone' },
      ],
    },
  ];

  readonly #activated = inject(ActivatedRoute);
  readonly #breadcrumb = inject(BreadcrumbService);

  constructor() {
    this.#activated.params.subscribe((res) => {
      this.id.set(res['id']);
    });

    effect(() => {
      const breadCrumbs: BreadcrumbModel[] = [
        {
          title: 'Araçlar',
          icon: 'bi-car-front',
          url: '/vehicles',
        },
      ];

      if (this.data()) {
        this.breadcrumbs.set(breadCrumbs);
        this.breadcrumbs.update((prev) => [
          ...prev,
          {
            title: this.data().brand + ' ' + this.data().model,
            icon: 'bi-zoom-in',
            url: `/vehicles/detail/${this.id()}`,
            isActive: true,
          },
        ]);
        this.#breadcrumb.reset(this.breadcrumbs());
      }
    });
  }

  showImageUrl() {
    if (this.data().imageUrl) {
      return `https://localhost:7142/images/${this.data().imageUrl}`;
    } else {
      return '/no-noimage.png';
    }
  }

  isFeatureSelected(feature: string): boolean {
    return this.data().features.includes(feature);
  }
}
