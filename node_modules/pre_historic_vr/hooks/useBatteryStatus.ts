import * as Battery from 'expo-battery';
import { useEffect, useState } from 'react';

export function useBatteryStatus() {
  const [isCharging, setIsCharging] = useState<boolean | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    let batteryLevelSubscription: Battery.Subscription | null = null;
    let batteryStateSubscription: Battery.Subscription | null = null;

    async function getBatteryInfo() {
      try {
        // Check if battery API is supported
        const isAvailable = await Battery.isAvailableAsync();
        setIsSupported(isAvailable);

        if (isAvailable) {
          // Get initial battery level
          const level = await Battery.getBatteryLevelAsync();
          setBatteryLevel(level);

          // Get initial charging state
          const state = await Battery.getBatteryStateAsync();
          setIsCharging(state === Battery.BatteryState.CHARGING || state === Battery.BatteryState.FULL);

          // Subscribe to battery level changes
          batteryLevelSubscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
            setBatteryLevel(batteryLevel);
          });

          // Subscribe to battery state changes (charging/discharging)
          batteryStateSubscription = Battery.addBatteryStateListener(({ batteryState }) => {
            setIsCharging(batteryState === Battery.BatteryState.CHARGING || batteryState === Battery.BatteryState.FULL);
          });
        }
      } catch (error) {
        console.log('Battery API not available:', error);
        setIsSupported(false);
      }
    }

    getBatteryInfo();

    // Cleanup subscriptions
    return () => {
      if (batteryLevelSubscription) {
        batteryLevelSubscription.remove();
      }
      if (batteryStateSubscription) {
        batteryStateSubscription.remove();
      }
    };
  }, []);

  return {
    isCharging,
    batteryLevel,
    isSupported,
  };
} 