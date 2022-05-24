import { Box, Heading, HStack, Spinner, Text } from '@chakra-ui/react';
import useSWR from 'swr';

import StoryType from '@lib/types/StoryType';
import UserType from '@lib/types/UserType';

import StoryCard from '../StoryCard';
import ShowStoryCard from '../MyCollections/CollectionCard/ShowStories/ShowStoryCard';
import useInfinite from '@compo/Hooks/useInfinite';
import { PaginationType } from '@lib/types/PaginationType';

const Stories = ({
  initialStories,
  query = '',
  nextPageNo,
  collectionId,
}: {
  initialStories?: StoryType[];
  query?: string;
  collectionId?: string;
  nextPageNo: number;
}) => {
  const { data, isValidating } = useSWR<{
    stories: StoryType[];
    authors: UserType[];
    pagination: PaginationType;
  }>(() => !initialStories && `${query}page=${nextPageNo}`);

  const { isInViewRef, show } = useInfinite({
    ignore: !!initialStories || !nextPageNo,
  });
  return (
    <>
      <div ref={initialStories ? null : isInViewRef} />
      {initialStories ? (
        <>
          {initialStories?.map((story: StoryType) =>
            collectionId ? (
              <ShowStoryCard
                story={story}
                key={story._id}
                collectionId={collectionId}
              />
            ) : (
              <StoryCard story={story} key={story._id} />
            )
          )}
          <Stories nextPageNo={2} query={query} collectionId={collectionId} />
        </>
      ) : !show || isValidating ? (
        <HStack justifyContent="center" my={2}>
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="sm"
          />
        </HStack>
      ) : data?.stories?.length ? (
        <>
          {data?.stories?.map((story: StoryType) =>
            collectionId ? (
              <ShowStoryCard
                story={story}
                key={story._id}
                collectionId={collectionId}
              />
            ) : (
              <StoryCard story={story} key={story._id} />
            )
          )}
          <Stories
            nextPageNo={nextPageNo + 1}
            query={query}
            collectionId={collectionId}
          />
        </>
      ) : (
        !isValidating && <Text textAlign="center"> The End </Text>
      )}
    </>
  );
};

export default Stories;
const Server = () => (
  <Box
    maxW="400px"
    p="15px"
    borderRadius="md"
    mx="auto"
    bgColor="gray.300"
    color="pink.500"
  >
    <Heading fontSize="md">Sorry, server is updating right now...</Heading>
  </Box>
);
