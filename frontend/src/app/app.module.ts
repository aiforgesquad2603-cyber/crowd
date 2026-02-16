import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms';   // <-- THIS FIXES ngModel!
import { HttpClientModule } from '@angular/common/http'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// --- LAYOUT ---
import { SidebarComponent } from './layout/sidebar/sidebar.component';

// --- MAIN PAGES ---
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LiveMonitoringComponent } from './pages/live-monitoring/live-monitoring.component';
import { GuardAssignComponent } from './pages/guard-assign/guard-assign.component';
import { AnalysisReportComponent } from './pages/analysis-report/analysis-report.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { DemoVidAnalysisComponent } from './pages/demo-vid-analysis/demo-vid-analysis.component';
import { CameraSetupComponent } from './pages/camera-setup/camera-setup.component';

// --- NEW AUTH PAGE ---
import { AuthComponent } from './pages/auth/auth.component'; // <--- THIS WAS MISSING!

// --- SETTINGS CHILD COMPONENTS ---
import { GuardRegisterComponent } from './pages/settings/components/guard-register/guard-register.component';
import { GuardListComponent } from './pages/settings/components/guard-list/guard-list.component';
import { ThresholdSettingsComponent } from './pages/settings/components/threshold-settings/threshold-settings.component';

// --- MODALS & SHARED ---
import { GuardAssignModalComponent } from './pages/settings/modals/guard-assign-modal/guard-assign-modal.component';
import { GlassCardComponent } from './shared/glass-card/glass-card.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    DashboardComponent,
    LiveMonitoringComponent,
    GuardAssignComponent,
    AnalysisReportComponent,
    SettingsComponent,
    DemoVidAnalysisComponent,
    CameraSetupComponent,
    
    // --> AUTH COMPONENT MUST BE REGISTERED HERE <--
    AuthComponent,

    GuardRegisterComponent,
    GuardListComponent,
    ThresholdSettingsComponent,
    GuardAssignModalComponent, 
    GlassCardComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,     
    AppRoutingModule,
    FormsModule,       // <-- REQUIRED FOR ngModel
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }