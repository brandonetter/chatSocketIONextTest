import mongoose, { Schema } from 'mongoose';

// the nominalID
// is just a client created
// unique id for the message
// so that we can
// 1) Display the message immediately in the UI
// and
// 2) Have a way to identify the message and
// remove it
// from the state if we get it
// back from the server

const chatSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  nominalId: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    required: true,
  },
});

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);
export default Chat;
