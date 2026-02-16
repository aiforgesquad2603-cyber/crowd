import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// --- IMPORT ALL MAIN PAGES ---
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LiveMonitoringComponent } from './pages/live-monitoring/live-monitoring.component';
import { AnalysisReportComponent } from './pages/analysis-report/analysis-report.component';
import { GuardAssignComponent } from './pages/guard-assign/guard-assign.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { DemoVidAnalysisComponent } from './pages/demo-vid-analysis/demo-vid-analysis.component';
import { CameraSetupComponent } from './pages/camera-setup/camera-setup.component'; 
import { AuthComponent } from './pages/auth/auth.component'; // <-- NEW AUTH PAGE IMPORT

const routes: Routes = [
  // 1. Default route (Now loads LOGIN on startup instead of Dashboard)
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // 2. Authentication Route
  { path: 'login', component: AuthComponent }, // <-- NEW ROUTE ADDED!
  
  // 3. Main app routes (Protected by our app.component.ts logic)
  { path: 'dashboard', component: DashboardComponent },
  { path: 'live-monitoring', component: LiveMonitoringComponent },
  { path: 'guard-assign', component: GuardAssignComponent },
  { path: 'analysis-report', component: AnalysisReportComponent },
  { path: 'demo-vid-analysis', component: DemoVidAnalysisComponent }, 
  { path: 'camera-setup', component: CameraSetupComponent }, 
  { path: 'settings', component: SettingsComponent },

  // 4. Wildcard route (If user types a wrong URL, kick them back to Login)
  { path: '**', redirectTo: '/login' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }