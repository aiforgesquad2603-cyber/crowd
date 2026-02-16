// Represents the main statistics cards at the top of the dashboard
export interface CrowdStats {
  totalCount: number;
  averageDensity: number; // Stored as a percentage (e.g., 68)
  activeAlerts: number;
  systemStatus: 'ONLINE' | 'OFFLINE' | 'EMERGENCY';
}

// Represents the data points for the "Density Trends (24h)" chart
export interface DensityTrend {
  timestamp: string; // e.g., '10:00 AM' or an ISO string
  densityLevel: number;
}

// Represents the notifications in the "Incident Stream"
export interface Incident {
  id: string;
  type: 'Density Warning' | 'Entry Alert' | 'Emergency' | 'System Info';
  description: string;
  location: string; // e.g., 'STATION GATE A', 'PLATFORM 4'
  timestamp: Date | string;
  isResolved: boolean;
}