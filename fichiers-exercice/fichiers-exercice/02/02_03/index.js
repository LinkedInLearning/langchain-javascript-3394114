const { ChatOpenAI } = require("@langchain/openai");
require("dotenv").config();

const model = new ChatOpenAI({});

const generateResponse = async (message) => {   
    const response = await model.invoke(message)
    console.log(response.content)
}

generateResponse("What is the capital of France?") 