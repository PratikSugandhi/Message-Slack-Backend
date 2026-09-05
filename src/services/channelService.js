import { StatusCodes } from 'http-status-codes';

import channelRepository from '../repositories/channelRepository.js';
import messageRepository from '../repositories/messageRepository.js';
import workspaceRepository from '../repositories/workspaceRepository.js';
import ClientError from '../utils/errors/clientError.js';
import { isUserMemberOfWorkspace } from './workspaceService.js';

export const getChannelByIdService = async (channelId, user) => {
  try {
    const channel =
      await channelRepository.getChannelWithWorkspaceDetails(channelId);

    if (!channel || !channel.workspaceId) {
      throw new ClientError({
        message: 'Channel not found with the provided ID',
        explanation: 'Invalid data sent from the client',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const isUserPartOfWorkspace = isUserMemberOfWorkspace(
      channel.workspaceId,
      user
    );

    if (!isUserPartOfWorkspace) {
      throw new ClientError({
        message:
          'User is not a member of the workspace and hence cannot access the channel',
        explanation: 'User is not a member of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }
    const messages = await messageRepository.getPaginatedMessaged(
      {
        channelId
      },
      1,
      20
    );

    console.log('Channel in service', channel);
    // Here we can destructure the channel and message and return all like return {...channel,message}.But this will brings some extra part too like docs and many more in it
    return {
      messages,
      _id: channel._id,
      name: channel.name,
      createdAt: channel.createdAt,
      updatedAt: channel.updatedAt,
      workspaceId: channel.workspaceId,
      type: channel.type,
      participants: channel.participants
    };
  } catch (error) {
    console.log('Get channel by ID service error', error);
    throw error;
  }
};

export const deleteChannelService = async (channelId, userId) => {
  try {
    const channel =
      await channelRepository.getChannelWithWorkspaceDetails(channelId);

    if (!channel || !channel.workspaceId) {
      throw new ClientError({
        message: 'Channel not found with the provided ID',
        explanation: 'Invalid data sent from the client',
        statusCode: StatusCodes.NOT_FOUND
      });
    }

    const workspace = channel.workspaceId;

    const isAdmin = isUserAdminOfWorkspace(workspace, userId);

    if (!isAdmin) {
      throw new ClientError({
        message: 'User is not allowed to delete the channel',
        explanation: 'User is not an admin of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
      });
    }

    // Delete all messages in this channel
    await messageRepository.deleteManyByChannelId(channelId);

    // Remove channel reference from workspace
    await workspaceRepository.removeChannelFromWorkspace(
      workspace._id,
      channelId
    );

    // Delete the channel document
    await channelRepository.delete(channelId);

    return {
      _id: channelId
    };
  } catch (error) {
    console.log('Delete channel service error', error);
    throw error;
  }
};

// local helper similar to workspaceService isUserAdminOfWorkspace
const isUserAdminOfWorkspace = (workspace, userId) => {
  const member = workspace.members.find((member) => {
    if (!member.memberId) return false;

    if (typeof member.memberId === 'string') {
      return (
        member.memberId.toString() === userId.toString() &&
        member.role === 'admin'
      );
    }

    if (member.memberId._id) {
      return (
        member.memberId._id.toString() === userId.toString() &&
        member.role === 'admin'
      );
    }

    return (
      member.memberId.toString() === userId.toString() &&
      member.role === 'admin'
    );
  });

  return member;
};
