import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Heading, HStack, Spacer } from "@chakra-ui/react";
import TSIconButton from "@compo/UI/TSIconButton";
import { useField } from "formik";
import AutoSave from "./AutoSave";

import IsPublished from "./IsPublished";
const Index = () => {
  const [{ value }] = useField("_id");
  return (
    <HStack justifyContent="flex-end" my="4" wrap="wrap">
      <HStack borderRadius="md" p="1">
        <Heading fontSize="md">History</Heading>
        <TSIconButton
          as="a"
          // @ts-ignore
          target="_blank"
          variant="outline"
          colorScheme="blue"
          // @ts-ignore
          href={`/me/story/history/${value}`}
          size="xs"
          icon={<ExternalLinkIcon />}
          aria-label="History"
        />
      </HStack>
      <Spacer />
      <AutoSave />
      <IsPublished />
    </HStack>
  );
};

export default Index;
