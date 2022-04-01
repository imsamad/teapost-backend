import { Document, model, Schema } from "mongoose";
import { ErrorResponse } from "../lib/utils";
import { StoryMetaDocument } from "./StoryMeta";
import { UserDocument } from "./User";
import StoryType from "../lib/types/StoryType";

export interface StoryDocument
  extends Omit<StoryType, "_id" | "meta">,
    Document {
  author: UserDocument["_id"];
  meta?: StoryMetaDocument;
  hadEmailedToFollowers?: boolean;
}

const storySchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    titleImage: String,
    subtitle: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      // unique: true,
      required: true,
    },
    tags: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Tag",
        },
      ],
    },
    content: String,
    keywords: {
      type: String,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      required: [true, "Author of story is required."],
      ref: "User",
    },
    isPublished: {
      type: Boolean,
      require: true,
      default: false,
    },
    hadEmailedToFollowers: {
      type: Boolean,
      default: false,
      select: false,
    },
    isPublishedByAdmin: {
      type: Boolean,
      require: [
        true,
        "Specifying the story, Is published or not is compulsary.",
      ],
      default: true,
    },
    readingTime: { type: Number, default: 0 },
    noOfViews: { type: Number, default: 0 },
    noOfComments: { type: Number, default: 0 },
    noOfLikes: { type: Number, default: 0 },
    noOfDislikes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

storySchema.post(["save", "updateOne"], errorHandlerMdlwr);
storySchema.post("findOneAndUpdate", errorHandlerMdlwr);

async function errorHandlerMdlwr(error: any, doc: StoryDocument, next: any) {
  console.log("error error ", error);
  if (error) {
    if (error?.code === 11000) {
      next(
        ErrorResponse(400, {
          slug: `This slug already registered.`,
        })
      );
    } else {
      next(ErrorResponse(400, "Invalid data."));
    }
  } else {
    next(error);
  }
}

storySchema.virtual("meta", {
  ref: "StoryMeta",
  localField: "_id",
  foreignField: "_id",
  justOne: true,
});

storySchema.virtual("comments", {
  ref: "Primary",
  localField: "_id",
  foreignField: "story",
  justOne: false,
});

storySchema.pre("remove", async function (next) {
  // Remove related StoryMeta + StoryHistory + All Primary ==> Secondary
  let deletedPrimary: any = await this.model("Primary").find({
    story: this._id,
  });

  let promises: any = [];

  promises.push(this.model("StoryMeta").findByIdAndRemove(this._id));
  promises.push(this.model("StoryHistory").findByIdAndRemove(this._id));

  deletedPrimary.forEach((primary: any, index: any) =>
    promises.push(primary.remove())
  );

  Promise.allSettled(promises)
    .then((res: any) => {})
    .finally(() => {
      next();
    });
});

const Story = model<StoryDocument>("Story", storySchema);

export default Story;
