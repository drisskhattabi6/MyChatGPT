// resources
// https://docs.mistral.ai/capabilities/completion/
// https://docs.mistral.ai/api/#tag/chat

const userText = document.querySelector('#question-area')
const sendBtn = document.querySelector('#send-btn')
const chatBox = document.querySelector('.chatbox')
// const allCopyBtn = document.querySelectorAll('.copy-btn')
const modeBtn = document.querySelector('#mode')
const delBtn = document.querySelector('#trash')
const root = document.querySelector(':root')
const welcomeBox = document.querySelector('.welcome')

var mode = "dark"

const API_KEY = "0QHgI3n82hsyZICzzyveIMSEchrl2b2z"


function changeMode() {
    if ( mode == "light") {
        root.style.setProperty('--color1', 'hsl(0, 0%, 18%)')
        root.style.setProperty('--color2', 'hsl(0, 0%, 40%)')
        root.style.setProperty('--color4', '#fff')
        // modeBtn.children[0].className = "fa-solid fa-sun"
        modeBtn.children[0].setAttribute('src', "imgs/moon-solid.svg")
        // modebtn.children[1].textContent = "Light Mode"
        mode = "dark"
    } else {
        root.style.setProperty('--color1', '#fff')
        root.style.setProperty('--color2', 'hsl(0deg 2.11% 83.78%)')
        root.style.setProperty('--color4', '#000')
        // console.log(modeBtn.children[0])
        modeBtn.children[0].setAttribute('src', "imgs/sun-solid.svg")
        // modeBnt.children[1].textContent = "Dark Mode"
        mode = "light"
    }
}


async function getChatResponse(userText) {
    const API_URL = "https://api.mistral.ai/v1/chat/completions"

    console.log("userText : ", userText);
    
    // parameters of the API
    const requestOption ={
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
            "Accept" : "application/json",
            "Authorization" : `Bearer ${API_KEY}`
        },
        body : JSON.stringify({
            "model": "mistral-small-latest",
            "temperature": 0.7,
            "top_p": 1,
            "max_tokens": 1000,
            "min_tokens": 100,
            "stream": false,
            "stop": "string",
            "messages": [{
                "role": "user",
                "content": userText
            }],
            "random_seed": 0,
            "response_format": {"type": "text"},
            // "tool_choice": "auto",
            "safe_prompt": false
        })}

    try {

        const response = await (await fetch(API_URL, requestOption)).json()
        // console.log(response);

        // Access the content of the message
        const messageContent = response.choices[0].message.content;
        console.log("Response Content : ", messageContent);

        return messageContent

    } catch(error) {
        console.log(error);
    }

}

async  function handleTheAnswer() {

    let userQuestion = userText.value.trim()
    if (userQuestion == "") return
    
    welcomeBox.style.display = "none"

    let div1 = document.createElement('div')
    div1.className = "chat-content user-chat flex-str-sp-bet"
    div1.innerHTML = `<div class="chat-details flex-center">
                        <img src="imgs/user.jpg" alt="user picture">
                        <p>${userQuestion}</p>
                      </div>`

    // let btn1 = document.createElement('button')
    // btn1.className = "btn copy-btn"
    // btn1.innerHTML = '<i class="fa-solid fa-copy"></i>'
    // btn1.addEventListener('click', copyText)

    // div1.appendChild(btn1)
    chatBox.appendChild(div1)

    userText.value = ""

    let messageContent = await getChatResponse(userQuestion)
    // console.log("messageContent : ", messageContent);

    // Convert Markdown to HTML
    let htmlContent = marked.parse(messageContent);

    let div2 = document.createElement('div')
    div2.className = "chat-content chatgpt-chat flex-str-sp-bet"
    div2.innerHTML = `
        <div class="chat-details flex-ctr-str">
            <img src="imgs/chatgpt.png" alt="chatgpt picture">
            
            <div class="flex-str-clm">${htmlContent}</div>
        </div>`

    let btn2 = document.createElement('button')
    btn2.className = "btn copy-btn"
    btn2.innerHTML = '<img src="imgs/copy-solid.svg">'
    btn2.addEventListener('click', copyText)

    div2.appendChild(btn2)
    chatBox.appendChild(div2)
}

function copyText(button) {
    // console.log(button.target.parentElement);
    let textToCopy = button.target.parentElement.parentElement.querySelector('.chat-details').querySelector('div').innerText
    navigator.clipboard.writeText(textToCopy)
}

function delAll() {
    chatBox.innerHTML = ""
    welcomeBox.style.display = "flex"
}


sendBtn.addEventListener('click', handleTheAnswer)
userText.addEventListener('keypress', function (e) {
    if (e.key === "Enter")  handleTheAnswer()
});

modeBtn.addEventListener('click', changeMode)
delBtn.addEventListener('click', delAll)

// allCopyBtn.forEach(copyBtn => {
//     copyBtn.addEventListener('click', copyText)
// })

