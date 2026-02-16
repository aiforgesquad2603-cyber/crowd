/**
 * Represents a physical entry/exit point or specific zone being monitored
 * by the CrowdGuardAI computer vision system.
 */
export interface Gate {
  id: string;                  // Unique identifier (e.g., 'gate-01')
  name: string;                // Display name (e.g., 'Gate 1', 'Main Entrance')
  
  // Real-time AI Data
  currentHeadcount: number;    // Exact number of people currently detected by the camera
  densityPercentage: number;   // Calculated capacity percentage (e.g., 68)
  status: 'Safe' | 'Elevated' | 'Critical' | 'Offline'; // Current risk level
  
  // System Links
  associatedCameraId?: string; // Links this physical gate to a specific video feed node
  assignedGuards?: string[];   // Array of Guard IDs currently deployed to this gate
}