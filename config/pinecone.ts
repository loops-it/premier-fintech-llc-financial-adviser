/**
 * Change the namespace to the namespace on Pinecone you'd like to store your embeddings.
 */

if (!process.env.PINECONE_INDEX_NAME) {
  throw new Error('Missing Pinecone index name in .env file');
}

const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME ?? '';

const PINECONE_NAME_SPACE = 'chatbot-embeddings'; //namespace is optional for your vectors
const NAME_SPACES_BY_NAME:{
  [key:number]: string
} = {
  2020:'eStatement',
  2021:'Savings-2021',
  2022:'Senior-Citizens-Accounts',
}
export { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE, NAME_SPACES_BY_NAME };
