export interface QueueMessage {
  type: "ENHANCER"
}

export const queue: ExportedHandlerQueueHandler<Env, QueueMessage> = async (batch, env, ctx) => {
  for (const message of batch.messages) {
    let body = message.body;
  }
}