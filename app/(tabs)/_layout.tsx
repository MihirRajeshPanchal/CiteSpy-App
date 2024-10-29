import { Link, Tabs } from 'expo-router';
import { FontAwesome5, Foundation, Ionicons, MaterialIcons, Octicons } from '@expo/vector-icons';
import { HeaderButton } from '../../components/HeaderButton';
import { TabBarIcon } from '../../components/TabBarIcon';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'black',
        tabBarHideOnKeyboard: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon Icon={FontAwesome5} size={26} name="home" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <HeaderButton />
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="papers"
        options={{
          title: 'Search Papers',
          tabBarIcon: ({ color }) => <TabBarIcon Icon={Foundation} size={26} name="page-search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="authors"
        options={{
          title: 'Search Authors',
          tabBarIcon: ({ color }) => <TabBarIcon Icon={MaterialIcons} size={26}  name="person-search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: 'BookMarks',
          tabBarIcon: ({ color }) => <TabBarIcon Icon={Ionicons} size={22} name="bookmarks" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon Icon={Octicons} size={22} name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}
