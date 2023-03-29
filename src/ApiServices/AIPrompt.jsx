import {Configuration, OpenAIApi} from 'openai'

export const AIPrompt = function(prompt) {

  const configuration = new Configuration({apiKey: import.meta.env.VITE_Open_AI_Key})
  const aiInstance = new OpenAIApi(configuration)
  // console.log('AI Prompt has been called with prompt:', prompt)

  const getResponse = async () => {
    const response = await aiInstance.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "system", "content": "You are a helpful React developer."},
        {"role": "user", "content": prompt}
      ]
    });
    // console.log('Response: ', response.data.choices[0].message.content);
    return (response.data.choices[0].message.content)
  }

  const responseContent = getResponse()
  return responseContent.then((data) => {
    // console.log('ResponseContent: ', data)
    return data;
  });
}

