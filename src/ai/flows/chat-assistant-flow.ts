'use server';
/**
 * @fileOverview A chat assistant that can participate in room conversations.
 *
 * - chatAssistant - A function that generates a response based on chat history.
 * - ChatAssistantInput - The input type for the chatAssistant function.
 * - ChatAssistantOutput - The return type for the chatAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define a schema for a single message
const MessageSchema = z.object({
  user: z.string().describe('The user who sent the message. Use "You" for the current user and "Assistant" for the AI.'),
  text: z.string().describe('The content of the message.'),
});

const ChatAssistantInputSchema = z.object({
  history: z.array(MessageSchema).describe('The history of the conversation so far.'),
});
export type ChatAssistantInput = z.infer<typeof ChatAssistantInputSchema>;

const ChatAssistantOutputSchema = z.object({
  reply: z.string().describe("The assistant's reply to the conversation."),
});
export type ChatAssistantOutput = z.infer<typeof ChatAssistantOutputSchema>;

export async function chatAssistant(input: ChatAssistantInput): Promise<ChatAssistantOutput> {
  return chatAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatAssistantPrompt',
  input: {schema: ChatAssistantInputSchema},
  output: {schema: ChatAssistantOutputSchema},
  prompt: `You are a helpful and friendly AI assistant named 'LinkNest AI' inside a collaborative chat room. Your goal is to be concise and helpful.

Analyze the conversation history and provide a relevant response. The last message is from "You". Respond to that message in the context of the whole conversation.

Conversation History:
{{#each history}}
- {{user}}: {{{text}}}
{{/each}}
`,
});

const chatAssistantFlow = ai.defineFlow(
  {
    name: 'chatAssistantFlow',
    inputSchema: ChatAssistantInputSchema,
    outputSchema: ChatAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
