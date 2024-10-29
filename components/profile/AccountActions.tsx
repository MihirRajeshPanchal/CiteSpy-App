import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

interface AccountActionsProps {
  onChangePassword: () => void;
  onSignOut: () => void;
}

export const AccountActions: React.FC<AccountActionsProps> = ({
  onChangePassword,
  onSignOut
}) => (
  <View>
    <TouchableOpacity
      onPress={onChangePassword}
      className="rounded-xl py-4 px-6 mb-4 bg-gray-800"
    >
      <Text className="text-white text-center text-lg font-semibold">
        Change Password
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={onSignOut}
      className="rounded-xl py-4 px-6 bg-red-500"
    >
      <Text className="text-white text-center text-lg font-semibold">
        Sign Out
      </Text>
    </TouchableOpacity>
  </View>
);