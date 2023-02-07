import { Schema, model, Types, Document } from 'mongoose';

export interface OAuthTokenDocument extends Document {
  token: Object;
}

const oAuthTokenSchema = new Schema({
  _id: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: Schema.Types.Mixed,
});

const OAuthToken = model<OAuthTokenDocument>('OAuthToken', oAuthTokenSchema);

export default OAuthToken;
