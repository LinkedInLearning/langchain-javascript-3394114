const { HNSWLib } = require("@langchain/community/vectorstores/hnswlib");
const { OpenAIEmbeddings, ChatOpenAI } = require("@langchain/openai");
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { formatDocumentsAsString } = require("langchain/util/document");
const {
  RunnablePassthrough,
  RunnableSequence,
} = require("@langchain/core/runnables");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { PromptTemplate } = require("@langchain/core/prompts");
const readlineSync = require("readline-sync");
require("dotenv").config();

// Initialize the LLM to use to answer the question.
const model = new ChatOpenAI({});
const prompt =
  PromptTemplate.fromTemplate(`Répondre aux questions de l'utilistateur uniquement sur le sujet:
{context}. Si vous ne savez pas la réponse, demander à contacter le service client au téléphone ou par email.
Question: {question}`);

// Fragmenter les documents en plusieurs morceaux
const splitDocuments = async () => { }

// Créer une base de données vectorielle
const createVectorStore = async (docs) => { }

// Créer la chaîne de composants pour générer du contenu augmenté
const createChain = async (query) => {}

// Exécuter la chaîne de composants pour générer du contenu augmenté
const generateResponse = async (query) => {
  return query
};

function getInput(promptMessage) {
  return readlineSync.question(promptMessage, {
    hideEchoBack: false, // The typed characters won't be displayed if set to true
  });
}

async function main() {
  console.log("\x1b[34m \n\n----------------------------------");
  console.log("          CHAT WITH AI 🤖   ");
  console.log("----------------------------------\n \x1b[0m");
  console.log("\x1b[34mTaper 'x' pour quitter l'application\n  \x1b[0m");
  runConversation();
}

async function runConversation() {
  while (true) {
    const input = getInput("You: ");

    if (input === "x") {
      console.log("\x1b[34mBot: Bye! 👋🏽");
      process.exit();
    }

    if (!!input) {
      try {
        const response = await generateResponse(input);
        console.log("\x1b[32mBot: " + response + "\x1b[0m");
      } catch (error) {
        console.error(error);
      }
    }
  }
}
main()

