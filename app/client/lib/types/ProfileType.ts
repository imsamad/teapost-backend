import StoryCollectionType from "./StoryCollectionType";
import Story from "./StoryType";
import User from "./UserType";

interface ProfileType {
  _id: string;
  fullName: string;

  likedStories?: Story["_id"][];
  dislikedStories?: Story["_id"][];
  following?: User["_id"][];
  followers?: User["_id"][] | User[];
  storyCollections?: StoryCollectionType[];
}

export default ProfileType;