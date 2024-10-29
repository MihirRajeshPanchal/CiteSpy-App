import React from 'react';
import { View, FlatList, ActivityIndicator, Text, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SearchBar } from './SearchBar';
import { PaperTile } from './PaperTile';
import { Paper, SearchResponse } from '~/types/paper';

const S2_API_KEY = process.env.EXPO_PUBLIC_S2_API_KEY;
const INITIAL_LIMIT = 10;
const LOAD_MORE_LIMIT = 20;

export const PaperSearch = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [papers, setPapers] = React.useState<Paper[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [error, setError] = React.useState('');
  const [currentQuery, setCurrentQuery] = React.useState('');
  const [offset, setOffset] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);

  const searchPapers = async (query: string, reset: boolean = true) => {
    if (reset) {
      setIsLoading(true);
      setOffset(0);
      setPapers([]);
      setHasMore(true);
    } else {
      setIsLoadingMore(true);
    }
    
    setError('');
    
    try {
      const currentOffset = reset ? 0 : offset;
      const response = await fetch(
        'https://api.semanticscholar.org/graph/v1/paper/search?' +
        new URLSearchParams({
          query,
          limit: (reset ? INITIAL_LIMIT : LOAD_MORE_LIMIT).toString(),
          offset: currentOffset.toString(),
          fields: 'paperId,title,url,venue,year,authors,abstract,citationCount,publicationTypes,citationStyles,externalIds'
        }), {
          headers: { 'X-API-KEY': S2_API_KEY || '' }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch papers');
      }

      const searchResponse: SearchResponse = await response.json();

      const newPapers = searchResponse.data.map((paper, index) => ({
        ...paper,
        uniqueId: `${paper.paperId}-${currentOffset + index}`
      }));
      
      if (reset) {
        setPapers(newPapers);
      } else {
        setPapers(prevPapers => [...prevPapers, ...newPapers]);
      }
      
      setOffset(currentOffset + searchResponse.data.length);
      setHasMore(searchResponse.data.length === (reset ? INITIAL_LIMIT : LOAD_MORE_LIMIT));
      setCurrentQuery(query);
    } catch (err) {
      setError('Failed to load papers. Please try again.');
      console.error(err);
    } finally {
      if (reset) {
        setIsLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && !isLoading && hasMore && currentQuery) {
      searchPapers(currentQuery, false);
    }
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    
    return (
      <View className="py-4">
        <ActivityIndicator size="small" />
      </View>
    );
  };

  const EmptyListComponent = () => {
    if (!isExpanded) return null;
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-gray-500 text-center">
          Search for papers to see results
        </Text>
      </View>
    );
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View className="flex-1">
        <SearchBar
          onSubmit={(query) => searchPapers(query, true)}
          isExpanded={isExpanded}
          onFocus={() => setIsExpanded(true)}
          onClear={() => {
            setPapers([]);
            setOffset(0);
            setHasMore(true);
            setCurrentQuery('');
          }}
        />
        
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" />
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center p-4">
            <Text className="text-red-500 text-center">{error}</Text>
          </View>
        ) : (
          <FlatList<Paper & { uniqueId: string }>
            data={papers}
            renderItem={({ item }) => <PaperTile paper={item} />}
            keyExtractor={(item) => item.uniqueId}
            contentContainerClassName="p-4"
            ListEmptyComponent={<EmptyListComponent />}
            ListFooterComponent={renderFooter}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={dismissKeyboard}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};