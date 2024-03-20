const { ChatOpenAI } = require("@langchain/openai");
const { PromptTemplate } = require("@langchain/core/prompts");
const readlineSync = require("readline-sync");
require("dotenv").config();


const model = new ChatOpenAI({});
const prompt = PromptTemplate.fromTemplate(
  "Tell me a joke about {topic}"
);

const generateResponse = async (message) => {
  const chain = prompt.pipe(model)   
  return await chain.invoke({
    topic: message
  })
}

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
          console.log("\x1b[32mBot: " + response.content + "\x1b[0m");
        } catch (error) {
          console.error(error);
        }
      }
    }
  }

main()
  