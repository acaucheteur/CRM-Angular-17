// Example: Dashboard KPI Component for Angular Frontend
// Path: frontend/src/app/modules/dashboard/components/kpi-dashboard/kpi-dashboard.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Chart, ChartConfiguration } from 'chart.js/auto';

interface KPIData {
  totalCA: number;
  totalOpportunites: number;
  conversionRate: number;
  targetCA: number;
  targetOpportunites: number;
  targetConversionRate: number;
}

interface LocalisationPerformance {
  name: string;
  ca: number;
  opportunites: number;
  conversion: number;
}

@Component({
  selector: 'app-kpi-dashboard',
  templateUrl: './kpi-dashboard.component.html',
  styleUrls: ['./kpi-dashboard.component.scss'],
})
export class KpiDashboardComponent implements OnInit, OnDestroy {
  kpiData: KPIData = {
    totalCA: 0,
    totalOpportunites: 0,
    conversionRate: 0,
    targetCA: 0,
    targetOpportunites: 0,
    targetConversionRate: 0,
  };

  localisationPerformance: LocalisationPerformance[] = [];
  loading = true;
  private destroy$ = new Subject<void>();
  private caChart: Chart | null = null;
  private conversionChart: Chart | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadKPIData();
    this.loadLocalisationPerformance();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.caChart?.destroy();
    this.conversionChart?.destroy();
  }

  private loadKPIData(): void {
    this.dashboardService
      .getKPIData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.kpiData = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading KPI data:', error);
          this.loading = false;
        },
      });
  }

  private loadLocalisationPerformance(): void {
    this.dashboardService
      .getLocalisationPerformance()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.localisationPerformance = data;
          this.createCharts();
        },
        error: (error) => {
          console.error('Error loading localisation performance:', error);
        },
      });
  }

  private createCharts(): void {
    this.createCAChart();
    this.createConversionChart();
  }

  private createCAChart(): void {
    const ctx = document.getElementById('caChart') as HTMLCanvasElement;
    if (!ctx) return;

    const labels = this.localisationPerformance.map((l) => l.name);
    const data = this.localisationPerformance.map((l) => l.ca);

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Chiffre d\'affaires (€)',
            data,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `${value.toLocaleString('fr-FR')} €`,
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'CA par Localisation',
          },
          tooltip: {
            callbacks: {
              label: (context) => `CA: ${context.parsed.y.toLocaleString('fr-FR')} €`,
            },
          },
        },
      },
    };

    this.caChart = new Chart(ctx, config);
  }

  private createConversionChart(): void {
    const ctx = document.getElementById('conversionChart') as HTMLCanvasElement;
    if (!ctx) return;

    const labels = this.localisationPerformance.map((l) => l.name);
    const data = this.localisationPerformance.map((l) => l.conversion);

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Taux de conversion (%)',
            data,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => `${value}%`,
            },
          },
        },
        plugins: {
          title: {
            display: true,
            text: 'Taux de Conversion par Localisation',
          },
          tooltip: {
            callbacks: {
              label: (context) => `Conversion: ${context.parsed.y.toFixed(1)}%`,
            },
          },
        },
      },
    };

    this.conversionChart = new Chart(ctx, config);
  }

  get caPercentage(): number {
    if (this.kpiData.targetCA === 0) return 0;
    return (this.kpiData.totalCA / this.kpiData.targetCA) * 100;
  }

  get opportunitesPercentage(): number {
    if (this.kpiData.targetOpportunites === 0) return 0;
    return (this.kpiData.totalOpportunites / this.kpiData.targetOpportunites) * 100;
  }

  get conversionPercentage(): number {
    if (this.kpiData.targetConversionRate === 0) return 0;
    return (this.kpiData.conversionRate / this.kpiData.targetConversionRate) * 100;
  }
}
