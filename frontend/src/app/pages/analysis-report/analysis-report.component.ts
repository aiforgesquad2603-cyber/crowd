import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

// Register all chart components
Chart.register(...registerables);

@Component({
  selector: 'app-analysis-report',
  templateUrl: './analysis-report.component.html',
  styleUrls: ['./analysis-report.component.css']
})
export class AnalysisReportComponent implements OnInit {
  
  // This grabs the canvas element from HTML to draw the chart
  @ViewChild('trendChart', { static: false }) trendChart!: ElementRef;
  chartInstance: any;

  metrics: any = {
    peakDensity: '0%',
    totalFootfall: '0',
    incidents: 0,
    avgDwellTime: '0 mins'
  };
  
  riskZones: any[] = [];
  
  // --- NEW: Multi-tenant Account ID ---
  userEmail: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // 1. Securely fetch the logged-in user's email
    this.userEmail = localStorage.getItem('userEmail') || '';

    // Fetch real data when page loads!
    this.fetchAnalytics();
  }

  fetchAnalytics() {
    if (!this.userEmail) return; // Stop if no email is found

    // 2. Fetch analytics ONLY for this specific user account!
    this.http.get<any>(`http://localhost:8000/api/analytics?user_email=${this.userEmail}`).subscribe({
      next: (data) => {
        this.metrics = {
          peakDensity: data.peakDensity,
          totalFootfall: data.totalFootfall,
          incidents: data.incidents,
          avgDwellTime: data.avgDwellTime
        };
        this.riskZones = this.formatRiskZones(data.riskZones);
        
        // Wait a tiny bit for HTML to render, then draw the chart
        setTimeout(() => {
          this.renderChart(data.chartData.labels, data.chartData.data);
        }, 100);
      },
      error: (err) => console.error("Failed to load analytics", err)
    });
  }

  // Gives the correct colors based on risk level
  formatRiskZones(zones: any[]) {
    return zones.map(zone => {
      let barColor = 'bg-green-500';
      let textColor = 'text-green-500';
      if (zone.level === 'Critical') { barColor = 'bg-red-500'; textColor = 'text-red-500'; }
      else if (zone.level === 'High') { barColor = 'bg-orange-500'; textColor = 'text-orange-500'; }
      else if (zone.level === 'Moderate') { barColor = 'bg-yellow-500'; textColor = 'text-yellow-500'; }
      
      return { ...zone, barColor, textColor };
    });
  }

  // Builds the beautiful Line Chart
  renderChart(labels: string[], dataPoints: number[]) {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
    
    const ctx = this.trendChart.nativeElement.getContext('2d');
    this.chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Daily Footfall',
          data: dataPoints,
          borderColor: '#14b8a6', // Teal color matching your UI
          backgroundColor: 'rgba(20, 184, 166, 0.1)',
          borderWidth: 3,
          tension: 0.4, // Makes the line curvy and smooth!
          fill: true,
          pointBackgroundColor: '#0f172a',
          pointBorderColor: '#14b8a6',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: 'rgba(148, 163, 184, 0.1)' }, ticks: { color: '#94a3b8' } },
          x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
        }
      }
    });
  }

  // --- NEW MAGIC: REAL EXCEL/CSV EXPORT! ---
  generateReport() {
    // 1. Create the CSV Headers
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Security Zone,Current Risk Percentage,Threat Level\n";

    // 2. Loop through the real database risk zones
    this.riskZones.forEach(zone => {
      csvContent += `${zone.name},${zone.percent}%,${zone.level}\n`;
    });

    // 3. Add Overall Metrics
    csvContent += `\nOverall Peak Density,${this.metrics.peakDensity}\n`;
    csvContent += `Total Expected Footfall,${this.metrics.totalFootfall}\n`;
    csvContent += `Incidents Logged,${this.metrics.incidents}\n`;
    csvContent += `Avg. Dwell Time,${this.metrics.avgDwellTime}\n`;

    // 4. Create a hidden download link and click it!
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "CrowdGuard_AI_Security_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}