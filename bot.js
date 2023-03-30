import TelegramBot from "node-telegram-bot-api"
import axios from "axios"

// Задаем токен бота, полученный от BotFather
const token = "token"

// Создаем экземпляр бота
const bot = new TelegramBot(token, { polling: true })

// Задаем URL сервера и параметры запроса
const serverUrl = "https://iamtester.ru/api"
const Start=(msg)=>{
  bot.sendMessage(
    msg.chat.id,
    'For restart bot press "Start" button, or enter "/start" command',
    {
      reply_markup: {
        keyboard: [["/start"]],
        resize_keyboard: true,
      },
    }
  )
}
// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  // Отправляем сообщение с кнопками
  bot.sendMessage(
    msg.chat.id,
    `Hi, ${msg.from.first_name}, i am http://iamtester.ru bot! \nI can generate a picture of a certain type and a determined size in bytes. \nLet's start! Select file type:`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "JPG", callback_data: "jpg" }],
          [{ text: "PNG", callback_data: "png" }],
          [{ text: "BMP", callback_data: "bmp" }],
          [{ text: "SVG", callback_data: "svg" }],
        ],
      },
    }
  )
})

// Обработчик нажатия на кнопки
bot.on("callback_query", async (query) => {
  const chatId = query.message.chat.id
  const action = query.data

  // Отправляем сообщение с просьбой ввести число
  bot.sendMessage(
    chatId,
    "Enter required size in bytes (between 999 and 53000000 bytes):"
  )

  // Ожидаем ввода числа
  bot.once("message", async (msg) => {
    const re = /^(9\d{2}|[1-4]\d{3}|5[0-2]\d{5}|53000000)$/
    const number = parseInt(msg.text)

    // Проверяем, что число в допустимом диапазоне
    //if (isNaN(number) || number < 999 || number > 53000000) {
    if ((!re.test(number))) {
      
      bot.sendMessage(chatId, 'Incorrect size, try again')
      return Start(msg)
    }

    // Отправляем GET-запрос на удаленный бекэнд
    const Url = serverUrl + "?" + action + "&size=" + number
    try {
      const response = await axios.get(Url)
      const data = JSON.stringify(response.data.downloadLink)
      bot.sendMessage(chatId, data.slice(1, data.length - 1))
      return Start(msg)
    } catch (error) {
      console.error(error)
      bot.sendMessage(chatId, "Some problems, try again.")
      return Start(msg)
    }
  })
})

// Обработчик ошибок
bot.on("polling_error", (error) => {
  console.error(error)
})
