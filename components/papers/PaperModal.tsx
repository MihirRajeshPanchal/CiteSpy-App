import React from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  Linking,
  Platform,
} from "react-native";
import { Feather, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { TabBarIcon } from "../../components/TabBarIcon";
import * as Clipboard from "expo-clipboard";
import { Paper } from "~/types/paper";
import { BookmarkButton } from "./BookmarkButton";

interface PaperModalProps {
  paper: Paper;
  visible: boolean;
  onClose: () => void;
}

export const PaperModal = ({ paper, visible, onClose }: PaperModalProps) => {
  const renderAuthors = () => {
    if (!paper.authors || paper.authors.length === 0) return "";
    const authorNames = paper.authors
      .filter((author) => author && author.name)
      .map((author) => author.name);
    return authorNames.join(", ");
  };

  const handleOpenLink = async () => {
    if (paper.openAccessPdf?.url) {
      await Linking.openURL(paper.openAccessPdf.url);
    } else if (paper.url) {
      await Linking.openURL(paper.url);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    const title = label.charAt(0).toUpperCase() + label.slice(1);
    await Clipboard.setStringAsync(text);
    ToastAndroid.show(`${title} copied to clipboard`, ToastAndroid.SHORT);
    console.log(`${title} copied to clipboard`);
  };

  const renderCitationStyles = () => {
    if (!paper.citationStyles) return null;

    return Object.entries(paper.citationStyles).map(([format, citation]) => (
      <TouchableOpacity
        key={format}
        className="mt-2 p-3 bg-gray-100 rounded-lg"
        onPress={() => copyToClipboard(citation, `${format} Citation`)}
      >
        <Text className="text-sm font-semibold text-gray-600">{format}</Text>
        <Text className="text-sm leading-5">{citation}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-2xl max-h-[92%] min-h-[92%]">
          <View className="absolute top-0 left-0 right-0 z-10 bg-white rounded-t-2xl border-b border-gray-200">
            <View className="flex-row justify-between items-center py-4 px-5">
              <TouchableOpacity onPress={onClose} className="p-2">
                <Feather name="x" size={24} color="#000" />
              </TouchableOpacity>
              <View className="flex-row items-center">
                <BookmarkButton paper={paper} />
                {(paper.url || paper.openAccessPdf?.url) && (
                  <TouchableOpacity
                    onPress={handleOpenLink}
                    className="p-2 ml-2"
                  >
                    <TabBarIcon
                      Icon={paper.openAccessPdf?.url ? FontAwesome6 : Feather}
                      name={
                        paper.openAccessPdf?.url ? "file-pdf" : "external-link"
                      }
                      size={24}
                      color="#111111"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          <ScrollView className="px-5 pt-3" style={{ marginTop: 65 }}>
            <TouchableOpacity
              onPress={() => copyToClipboard(paper.title, "Title")}
              className="mb-3"
            >
              <Text className="text-lg font-bold">{paper.title}</Text>
            </TouchableOpacity>

            {renderAuthors() && (
              <TouchableOpacity
                onPress={() => copyToClipboard(renderAuthors(), "Authors")}
                className="mb-5"
              >
                <Text className="text-base font-semibold text-gray-600">
                  Authors
                </Text>
                <Text className="text-base leading-6">{renderAuthors()}</Text>
              </TouchableOpacity>
            )}

            {(paper.venue || paper.year) && (
              <TouchableOpacity
                onPress={() =>
                  copyToClipboard(
                    `${paper.venue || ""} ${paper.year || ""}`.trim(),
                    "Publication Information"
                  )
                }
                className="mb-5"
              >
                <Text className="text-base font-semibold text-gray-600">
                  Publication
                </Text>
                <Text className="text-base leading-6">
                  {paper.venue}
                  {paper.venue && paper.year ? " · " : ""}
                  {paper.year}
                </Text>
              </TouchableOpacity>
            )}

            {paper.abstract && (
              <TouchableOpacity
                onPress={() => copyToClipboard(paper.abstract!, "Abstract")}
                className="mb-5"
              >
                <Text className="text-base font-semibold text-gray-600">
                  Abstract
                </Text>
                <Text className="text-base leading-6">{paper.abstract}</Text>
              </TouchableOpacity>
            )}

            <View className="mb-5">
              <Text className="text-base font-semibold text-gray-600">
                Citations
              </Text>
              <Text className="text-base leading-6">{paper.citationCount}</Text>
            </View>

            {paper.publicationTypes && paper.publicationTypes.length > 0 && (
              <View className="mb-5">
                <Text className="text-base font-semibold text-gray-600">
                  Publication Type
                </Text>
                <Text className="text-base leading-6">
                  {paper.publicationTypes.join(", ")}
                </Text>
              </View>
            )}

            <View className="mb-5">
              <Text className="text-base font-semibold text-gray-600">
                Citation Styles
              </Text>
              {renderCitationStyles()}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};