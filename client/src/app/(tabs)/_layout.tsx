import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { Home, HandCoins, Users, User } from 'lucide-react-native';

function TabBarIcon({ icon: Icon, name, color, focused }: any) {
  return (
    <View className="flex-1 items-center pt-4">
      <Icon color={color} size={24} />
      <Text className="mt-1 text-[9px] font-semibold w-full text-white">{name}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#8891B9',
        tabBarStyle: {
          backgroundColor: '#131E46',
          borderTopWidth: 0,
          height: 85,
        },
      }}>
      <Tabs.Screen
        name="menu/index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon icon={Home} name="Início" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="convidados"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon icon={Users} name="Convidados" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="gastos"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon icon={HandCoins} name="Financeiro" color={color} focused={focused} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon icon={User} name="Perfil" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
