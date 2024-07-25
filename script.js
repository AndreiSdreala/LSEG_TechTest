let chatMessages = document.getElementById('chat-messages');

function appendBotMessage(message) {
    let messageElement = document.createElement('div');
    messageElement.className = 'message bot';
    messageElement.innerHTML = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendUserMessage(message) {
    let messageElement = document.createElement('div');
    messageElement.classList.add('message-user');
    messageElement.innerHTML = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function createButtons(buttonData, onClickHandler) {
    let buttons = [];
    for (let i = 0; i < buttonData.length; i++) {
        let button = document.createElement('button');
        button.classList.add('message-bot');
        button.innerText = buttonData[i].label;
        button.onclick = (function(value) {
            return function() {
                onClickHandler(value);
            };
        })(buttonData[i].value);
        buttons.push(button);
    }
    return buttons;
}

function loadHomeMenu() {
    let exchanges = [];
    for (let i = 0; i < stockData.length; i++){
        exchanges.push({ label: stockData[i].stockExchange, value: stockData[i].stockExchange });
    }

    appendBotMessage('<p>Please select a stock exchange:</p>');

    let buttons = createButtons(exchanges, selectExchange);
    for (let i = 0; i < buttons.length; i++) {
        chatMessages.appendChild(buttons[i]);
    }
}

function selectExchange(exchange) {
    appendUserMessage(exchange);
    loadStockMenu(exchange);
}

function loadStockMenu(exchange) {
    let stocks = [], topStocks;
    for (let i = 0; i < stockData.length; i++){
        if ( stockData[i].stockExchange === exchange) {
            topStocks = stockData[i].topStocks;
        }
    }
    
    for (let i = 0; i < topStocks.length; i++) {
        stocks.push({ label: topStocks[i].stockName, value: topStocks[i].stockName });   
    }

    appendBotMessage(`
        <p>Please select a stock from ${exchange}:</p>
    `);

    let buttons = createButtons(stocks, function(stockName) {
        selectStock(exchange, stockName);
    });
    for (let i = 0; i < buttons.length; i++) {
        chatMessages.appendChild(buttons[i]);
    }

    let backButton = createButtons([{ label: "Back to Home", value: null }], loadHomeMenu);
    chatMessages.appendChild(backButton[0]);
}

function selectStock(exchange, stockName) {
    appendUserMessage(stockName);
    showStockPrice(exchange, stockName);
}

function showStockPrice(exchange, stockName) {
    let stock;
    for (let i = 0; i < stockData.length; i++) {
        if ( stockData[i].stockExchange === exchange) {
            topStocks = stockData[i].topStocks;
            for (let j = 0; j < topStocks.length; j++) {
                if ( topStocks[j].stockName === stockName) {
                    stock = topStocks[j];
                }
            }
        }
    }

    appendBotMessage('<p>The current price of ' + stockName + ' is $' + stock.price + '.</p>');

    let backButtonsData = [
        { label: 'Back to ' + exchange + ' Stocks', value: exchange },
        { label: "Back to Home", value: null }
    ];

    let backButtons = createButtons(backButtonsData, function(value) {
        if (value) {
            loadStockMenu(value);
        } else {
            loadHomeMenu();
        }
    });
    for (let i = 0; i < backButtons.length; i++) {
        chatMessages.appendChild(backButtons[i]);
    }
}

function initializeChatbot() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            stockData = data;
            loadHomeMenu();
        })
        .catch(error => {
            console.error('Error loading stock data:', error);
            appendBotMessage('<p>Sorry, there was an error loading the stock data. Please try again later.</p>');
        });
}

initializeChatbot();
document.querySelector('.chatbot-toggler').addEventListener('click', () => document.body.classList.toggle("show-chatbot"));
