import { StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export const TabBarIcon = ({
  Icon = FontAwesome,
  name,
  color,
  size,
}: {
  Icon?: React.ComponentType<any>;
  name: string;
  color: string;
  size: number;
}) => {
  return (
    <Icon name={name} size={size} color={color} style={styles.tabBarIcon} />
  );
};

export const styles = StyleSheet.create({
  tabBarIcon: {
    marginBottom: -3,
  },
});
