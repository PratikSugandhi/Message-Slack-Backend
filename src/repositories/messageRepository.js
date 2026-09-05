import Message from '../schema/message.js';
import crudRepository from './crudRepository.js';
const messageRepository = {
  ...crudRepository(Message),
  getPaginatedMessaged: async (messageParams, page, limit) => {
    const messages = await Message.find(messageParams)
      .sort({ createdAt: -1 }) // sort in descending order,newer message on top
      .skip((page - 1) * limit) // paging start from indexing 0
      .limit(limit)
      .populate('senderId', 'username email avatar');

    return messages;
  },
  getMessageDetails: async (messageId) => {
    const message = await Message.findById(messageId).populate(
      'senderId',
      'username email avatar'
    );
    return message;
  },
  deleteManyByChannelId: async (channelId) => {
    await Message.deleteMany({ channelId });
  }
};

export default messageRepository;
