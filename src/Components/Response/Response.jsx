// Libraries
import React, {startTransition, useState} from 'react'
import { AIPrompt  } from '../../ApiServices/AIPrompt'

// styling
import './Response.css'

export default function ResponseText(props){

    // console.log('Task Response: ', props.responseTask.response)
    const responseArray = props.responseTask.response.split('```').filter(response => {
        if (props.viewFullResponse == true) {return true}
        else  {
            const check = async() => {
                const codeOrNot = AIPrompt('Please give a yes or no response.  Is the following text an example of javascript code?: "' + response + '"')
                codeOrNot.then(data => {
                    console.log(response, data)
                    if (data.includes('no') || data.includes ('No')) {
                        console.log('Returning false on this line:', response)
                        return false
                    }
                    else {
                        console.log('Returning true on this line:', response)
                        return true
                    }
                })
                .then(value => value)
        
            }
           
            return check()
        }
    })

    const responseElements = responseArray.map(response => (<p>{response}</p>))
    console.log('Response Elements:', responseElements)

    return (
        <div className = "response-content">
            {responseElements}
        </div>
    )
}