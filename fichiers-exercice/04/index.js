import { DataSource } from "typeorm";
import { SqlDatabase } from "langchain/sql_db";
import { ChatOpenAI } from "@langchain/openai";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import readlineSync from "readline-sync";
import dotenv from "dotenv";

dotenv.config();
const datasource = new DataSource({
  type: "sqlite",
  database: "db.sqlite",
});

const db = await SqlDatabase.fromDataSourceParams({
  appDataSource: datasource,
});

const prompt =
  PromptTemplate.fromTemplate(`Based on the table schema below, write a SQL query that would answer the user's question:
{schema}

Question: {question}
SQL Query:`);

const model = new ChatOpenAI();

const sqlQueryGeneratorChain = RunnableSequence.from([
  RunnablePassthrough.assign({
    schema: async () => db.getTableInfo(),
  }),
  prompt,
  model.bind({ stop: ["\nSQLResult:"] }),
  new StringOutputParser(),
]);


const finalResponsePrompt =
  PromptTemplate.fromTemplate(`Based on the table schema below, question, sql query, and sql response, write a natural language response:
{schema}

Question: {question}
SQL Query: {query}
SQL Response: {response}`);

const fullChain = RunnableSequence.from([
  RunnablePassthrough.assign({
    query: sqlQueryGeneratorChain,
  }),
  {
    schema: async () => db.getTableInfo(),
    question: (input) => input.question,
    query: (input) => input.query,
    response: (input) => db.run(input.query),
  },
  finalResponsePrompt,
  model,
  new StringOutputParser(),
]);


const generateResponse = async (query) => {
  await sqlQueryGeneratorChain.invoke({
    question: query,
  });
  return await fullChain.invoke({
    question: query,
  });
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


