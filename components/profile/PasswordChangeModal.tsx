import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";

interface PasswordChangeModalProps {
  visible: boolean;
  onClose: () => void;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  onChangeCurrentPassword: (text: string) => void;
  onChangeNewPassword: (text: string) => void;
  onChangeConfirmPassword: (text: string) => void;
  onSubmit: () => void;
}

export const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  visible,
  onClose,
  currentPassword,
  newPassword,
  confirmPassword,
  onChangeCurrentPassword,
  onChangeNewPassword,
  onChangeConfirmPassword,
  onSubmit,
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View className="flex-1 justify-center bg-black/50">
      <View className="bg-white m-4 p-6 rounded-xl">
        <Text className="text-xl font-bold mb-4">Change Password</Text>

        <TextInput
          className="bg-gray-100 rounded-lg px-4 py-2 mb-4"
          placeholder="Current Password"
          secureTextEntry
          value={currentPassword}
          onChangeText={onChangeCurrentPassword}
        />

        <TextInput
          className="bg-gray-100 rounded-lg px-4 py-2 mb-4"
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={onChangeNewPassword}
        />

        <TextInput
          className="bg-gray-100 rounded-lg px-4 py-2 mb-6"
          placeholder="Confirm New Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={onChangeConfirmPassword}
        />

        <View className="flex-row justify-end">
          <TouchableOpacity onPress={onClose} className="px-4 py-2 mr-2">
            <Text className="text-gray-600">Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onSubmit}
            className="bg-gray-900 px-4 py-2 rounded-lg"
          >
            <Text className="text-white">Update Password</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);
