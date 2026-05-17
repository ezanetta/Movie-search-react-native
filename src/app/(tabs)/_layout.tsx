import { Tabs } from 'expo-router';
import React from 'react';

import { FloatingTabBar } from '@/components/FloatingTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={props => <FloatingTabBar {...props} />}
      screenOptions={{ headerShown: false, lazy: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="favs" />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}
