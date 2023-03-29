export const arrayItems = [
    {
        name: "Q&A",
        id: "q&a",
        description: "Answer Questions based on existing knowledge",
        option:
            {
                model:"text-davinci-003",
                prompt: "",
                temperature:0.1,
                max_tokens:2048,
                frequency_penalty:0.0,
                presence_penalty:0.0,
            },
    },
    {
        name: "Grammar Correction",
        id: "grammarCorrection",
        description: "Corrects sentences into standard English.",
        option:{
            model: "text-davinci-003",
            prompt: "Correct this to standard English:\n",
            temperature: 0,
            max_tokens: 2048,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        }
    },
    {
        name: "Code Completion",
        id: "Generate,edit, and explain code",
        description: "Bot that helps you generate, edit, and explain code",
        option:{
            model: "text-davinci-003",
            prompt: "",
            temperature: 0,
            max_tokens: 1000,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        }
    },
    {
        name: "Calculate Time Complexity",
        id: "calculateTimeComplexity",
        description: "Find the time complexity of a function.",
        option:{
            model: "text-davinci-003",
            prompt: "What is the time complexity of the following code and why:\n",
            temperature: 0,
            max_tokens: 2048,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        }
    },
    {
        name: "Interview Questions",
        id: "interviewQuestions",
        description: "Create 10 interview questions by providing the job title",
        option:
        {
            model: "text-davinci-003",
            prompt: "Create a list of 10 interview questions for the job of: ",
            temperature: 0.5,
            max_tokens: 150,
            frequency_penalty: 0.0,
            presence_penalty: 0.0,
        }
    },
    {
        name: "Movie to Emoji",
        id: "movieToEmoji",
        description: "Convert movie title into emoji.",
        option:
            {
                model: "gpt-3.5-turbo",
                prompt: "Convert movie title into emoji:\n",
                temperature: 0.8,
                max_tokens: 60,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
            },
    }
]