import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Author } from "~/types/author";
import { Paper } from "~/types/paper";
import { PaperModal } from "../papers/PaperModal";
// import { FollowButton } from "./FollowButton";

interface AuthorModalProps {
  author: Author;
  visible: boolean;
  onClose: () => void;
}

export const AuthorModal = ({ author, visible, onClose }: AuthorModalProps) => {
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);

  const handleOpenProfile = async () => {
    if (author.url) {
      await Linking.openURL(author.url);
    }
  };

  const renderExternalIds = () => {
    if (!author.externalIds || Object.keys(author.externalIds).length === 0) {
      return null;
    }

    return (
      <View className="mb-4">
        <Text className="text-base font-semibold mb-2">External IDs</Text>
        {Object.entries(author.externalIds).map(([platform, ids]) => {
          const idList = Array.isArray(ids) ? ids : [ids].filter(Boolean);
          return idList.length > 0 ? (
            <Text key={platform} className="text-gray-700">
              {platform}: {idList.join(", ")}
            </Text>
          ) : null;
        })}
      </View>
    );
  };

  const renderMetrics = () => {
    return (
      <View className="flex-row flex-wrap justify-center items-center gap-6 mb-4 bg-gray-50 p-4 rounded-lg">
        <View className="items-center">
          <Text className="text-sm font-medium text-gray-600">
            Total Papers
          </Text>
          <Text className="text-xl font-semibold">{author.paperCount}</Text>
        </View>
        <View className="items-center">
          <Text className="text-sm font-medium text-gray-600">Citations</Text>
          <Text className="text-xl font-semibold">{author.citationCount}</Text>
        </View>
        <View className="items-center">
          <Text className="text-sm font-medium text-gray-600">h-index</Text>
          <Text className="text-xl font-semibold">{author.hIndex}</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <View className="flex-1 bg-white">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleOpenProfile}>
              <Feather name="external-link" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-2xl font-bold mb-4">{author.name}</Text>
              {/* <FollowButton
                authorId={author.authorId}
                authorName={author.name}
                authorUrl={author.url}
                className="mx-2"
              /> */}
            </View>
            {author.affiliations && author.affiliations.length > 0 && (
              <View className="mb-4">
                <Text className="text-base font-semibold mb-2">
                  Affiliations
                </Text>
                {author.affiliations.map((affiliation, index) => (
                  <Text key={index} className="text-gray-700">
                    {affiliation}
                  </Text>
                ))}
              </View>
            )}

            {renderMetrics()}
            {renderExternalIds()}

            {author.papers && author.papers.length > 0 && (
              <View className="mb-4">
                <Text className="text-base font-semibold mb-2">Papers</Text>
                <View className="space-y-4">
                  {author.papers
                    .sort((a, b) => (b.year || 0) - (a.year || 0))
                    .map((paper, index) => (
                      <TouchableOpacity
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg mb-2"
                        onPress={() => setSelectedPaper(paper as Paper)}
                      >
                        <Text className="font-medium mb-1">{paper.title}</Text>
                        {paper.year && (
                          <Text className="text-sm text-gray-600">
                            Published in {paper.year}
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))}
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>

      {selectedPaper && (
        <PaperModal
          paper={selectedPaper}
          visible={!!selectedPaper}
          onClose={() => setSelectedPaper(null)}
        />
      )}
    </>
  );
};
