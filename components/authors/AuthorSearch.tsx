import React from 'react';
import { View, FlatList, ActivityIndicator, Text, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SearchBar } from '../utils/SearchBar';
import { AuthorTile } from './AuthorTile';
import { Author, AuthorSearchResponse } from '~/types/author';

const S2_API_KEY = process.env.EXPO_PUBLIC_S2_API_KEY;
const INITIAL_LIMIT = 10;
const LOAD_MORE_LIMIT = 20;

export const AuthorSearch = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [authors, setAuthors] = React.useState<Author[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [error, setError] = React.useState('');
  const [currentQuery, setCurrentQuery] = React.useState('');
  const [offset, setOffset] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);

  const searchAuthors = async (query: string, reset: boolean = true) => {
    if (reset) {
      setIsLoading(true);
      setOffset(0);
      setAuthors([]);
      setHasMore(true);
    } else {
      setIsLoadingMore(true);
    }
    
    setError('');
    
    try {
      const currentOffset = reset ? 0 : offset;
      const response = await fetch(
        'https://api.semanticscholar.org/graph/v1/author/search?' +
        new URLSearchParams({
          query,
          limit: (reset ? INITIAL_LIMIT : LOAD_MORE_LIMIT).toString(),
          offset: currentOffset.toString(),
          fields: 'authorId,externalIds,name,url,affiliations,paperCount,citationCount,hIndex,papers.paperId,papers.title,papers.url,papers.venue,papers.year,papers.authors,papers.abstract,papers.citationCount,papers.publicationTypes,papers.citationStyles,papers.externalIds'
        }), {
          headers: { 'X-API-KEY': S2_API_KEY || '' }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch authors');
      }

      const searchResponse: AuthorSearchResponse = await response.json();

      const newAuthors = searchResponse.data.map((author, index) => ({
        ...author,
        uniqueId: `${author.authorId}-${currentOffset + index}`
      }));
      
      if (reset) {
        setAuthors(newAuthors);
      } else {
        setAuthors(prevAuthors => [...prevAuthors, ...newAuthors]);
      }
      
      setOffset(currentOffset + searchResponse.data.length);
      setHasMore(searchResponse.data.length === (reset ? INITIAL_LIMIT : LOAD_MORE_LIMIT));
      setCurrentQuery(query);
    } catch (err) {
      setError('Failed to load authors. Please try again.');
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
      searchAuthors(currentQuery, false);
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
          Search for authors to see results
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
          onSubmit={(query) => searchAuthors(query, true)}
          isExpanded={isExpanded}
          onFocus={() => setIsExpanded(true)}
          onClear={() => {
            setAuthors([]);
            setOffset(0);
            setHasMore(true);
            setCurrentQuery('');
          }}
          placeholder='Search Authors'
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
          <FlatList<Author & { uniqueId: string }>
            data={authors}
            renderItem={({ item }) => <AuthorTile author={item} />}
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