// Represents a security guard or official assigned to crowd control
export interface Guard {
  id: string;
  name: string;
  mobile: string;            // Updated from 'contactNumber' to match the new Register UI
  gate: string;              // Updated from 'assignedZone' to match the 'Assign Gate' dropdown
  
  // These fields are marked optional (?) so the quick-register form works, 
  // but you can still use them in the advanced Guard Assignment dashboard!
  badgeNumber?: string;      
  status?: 'Active' | 'On Break' | 'Responding' | 'Offline';
  lastKnownLocation?: string; // Specific camera or GPS ping
}

// Represents a specific zone or location that requires guard coverage
export interface SecurityZone {
  zoneId: string;
  zoneName: string;          // e.g., 'Gate 1', 'Main Hall'
  currentRiskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  assignedGuards: string[];  // Array of Guard IDs currently deployed here
}