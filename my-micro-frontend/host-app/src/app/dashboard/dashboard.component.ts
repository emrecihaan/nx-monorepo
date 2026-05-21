import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';


@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
    chartData: any;
    chartOptions: any;

    recentActivities = [
        { user: 'John Doe', action: 'Created new user', time: '2 minutes ago', icon: 'pi-user-plus', color: '#10B981' },
        { user: 'Jane Smith', action: 'Updated profile', time: '15 minutes ago', icon: 'pi-user-edit', color: '#3B82F6' },
        { user: 'Mike Johnson', action: 'Deleted record', time: '1 hour ago', icon: 'pi-trash', color: '#EF4444' },
        { user: 'Sarah Williams', action: 'Exported data', time: '2 hours ago', icon: 'pi-download', color: '#8B5CF6' },
    ];

    ngOnInit() {
        this.initChart();
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'Users',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    borderColor: '#3B82F6',
                    tension: 0.4
                },
                {
                    label: 'Sessions',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    borderColor: '#8B5CF6',
                    tension: 0.4
                }
            ]
        };

        this.chartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.6,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder
                    }
                }
            }
        };
    }
}
