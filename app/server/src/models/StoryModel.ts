import { Document, model, Schema } from 'mongoose';
import { ErrorResponse, validateYupSchema } from '../lib/utils';
import { isAbleToPublished } from '../schema/story';
import { UserDocument } from './UserModel';

// mongoose.plugin((schema: Schema) => {
//   schema.pre('findOneAndUpdate', setRunValidators);
//   schema.pre('updateMany', setRunValidators);
//   schema.pre('updateOne', setRunValidators);
//   schema.pre('update', setRunValidators);
// });

// function setRunValidators(this: any) {
//   this.setOptions({ runValidators: true });
// }

export interface StorySchemaDocument extends Document {
  title?: String;
  subtitle?: String;
  slug?: String;
  tags?: String[];
  body?: { text: String; html: String };
  keywords?: String;
  isPublished: Boolean;
  isPublishedByAdmin: Boolean;
  authorId: UserDocument['_id'];
}

const storySchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
    },
    tags: {
      type: [
        {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Tag',
        },
      ],
    },
    body: String,
    keywords: {
      type: String,
      trim: true,
      // unique: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      required: [true, 'Author of story is required.'],
      ref: 'User',
    },
    isPublished: {
      type: Boolean,
      require: true,
      default: false,
    },
    isPublishedByAdmin: {
      type: Boolean,
      require: [
        true,
        'Specifying the story, Is published or not is compulsary.',
      ],
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

storySchema.post(['save', 'updateOne'], errorHandlerMdlwr);
storySchema.post('findOneAndUpdate', errorHandlerMdlwr);

async function errorHandlerMdlwr(
  error: any,
  doc: StorySchemaDocument,
  next: any
) {
  console.log('Error from post mdlwr ', JSON.stringify(error, null, 4));
  if (error) {
    if (error?.code === 11000) {
      next(
        ErrorResponse(400, {
          slug: `${doc.slug || 'This slug'} already registered.`,
        })
      );
    } else {
      next(ErrorResponse(400, 'Invalid data.'));
    }
  } else {
    next(error);
  }
}

const StoryModel = model<StorySchemaDocument>('Story', storySchema);

export default StoryModel;
