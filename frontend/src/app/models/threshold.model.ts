/**
 * Represents the system-wide or gate-specific threshold configurations
 * used by the AI to trigger alerts and dispatch guards.
 */
export interface SystemThresholds {
  // Core setting from your new UI
  crowdLimitPerGate: number;     // The hard limit of people allowed per gate (e.g., 50)
  
  // Advanced AI Risk Parameters (Optional for basic demo, but great for your hackathon pitch)
  warningDensity?: number;       // Percentage at which to trigger a 'Moderate' or 'High' warning (e.g., 70)
  criticalDensity?: number;      // Percentage at which to trigger 'Critical' / Emergency mode (e.g., 85)
  sustainedTimeMinutes?: number; // Time the crowd must exceed the limit before alarming (prevents false positives)
}