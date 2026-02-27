// We import the processor file so that the queue starts listening for jobs when the application boots.

// Without importing it, the processor will never register itself to the queue — and your jobs will just sit in Redis unprocessed.

import '../processors/mailProcessor.js'

import mailQueue from '../queues/mailQueue.js';
export const addEmailtoMailQueue = async (emailData) => {
  console.log('initiating email sending process');
  try {
    await mailQueue.add(emailData);
    console.log('Email added to mail queue');
  } catch (error) {
    console.log('Add email to mail queue error', error);
  }
};