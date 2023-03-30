import TelegramBot from "node-telegram-bot-api"
import axios from "axios"

// Задаем токен бота, полученный от BotFather
const token = "6167849573:AAHGwKN58S2jSoeUZ_U-SwXO1ozjgT2lhNk"

// Создаем экземпляр бота
const bot = new TelegramBot(token, { polling: true })

// Задаем URL сервера и параметры запроса
const serverUrl = "https://iamtester.ru/api"

const sendGetRequest = async (msg2, Url) => {
  try {
    const resp = await axios.get(Url)
    const data = resp.data
    console.log(data)
    bot.sendMessage(
      msg2.chat.id,
      "File type: " +
        JSON.stringify(data.fileType) +
        " size: " +
        JSON.stringify(data.requiredSize) +
        " bytes\n" +
        JSON.stringify(data.downloadLink).slice(
          1,
          JSON.stringify(data.downloadLink).length - 1
        )
    )
  } catch (err) {
    // Handle Error Here
    console.error("GET-request error: ", err)
  }
}

bot.onText(/\/start/, async (msg) => {
  const opt = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: "JPG", callback_data: "jpg" }],
        [{ text: "PNG", callback_data: "png" }],
        [{ text: "BMP", callback_data: "bmp" }],
        [{ text: "SVG", callback_data: "svg" }],
      ],
    }),
  }
  return bot.sendMessage(
    msg.chat.id,
    "Hi, i am http://iamtester.ru bot! \nI can generate a picture of a certain type and a determined size in bytes. \nLet's start! Select file type:",
    opt
  )
})
// Ответ от кнопок
bot.on("callback_query", function (msg) {
  console.log(msg.data)
  const fileType = msg.data
  const k = ["jpg", "png", "bmp", "svg"]
  if (k.includes(fileType)) {
    bot.sendMessage(
      msg.from.id,
      "Enter required size in bytes (between 999 and 53000000 bytes):"
    )
    //^[0-9]{3,8}$
    bot.onText(/999/, async (msg2, match) => {
      console.log(match[0])
      const size = Number(match[0])
      if (size >= 999 && size <= 53000000) {
        const Url = serverUrl + "?fileType=" + fileType + "&size=" + size
        //console.log(Url)
        return sendGetRequest(msg2, Url)
      } else {
        return { error_bot: "Invalid required file size" }
      }
    })
  } else {
    return { error_bot: "Invalid required file type" }
  }

  // Отправляем еще один вопрос пользователю
  //newQuestion(msg)
})

// bot.onText(/\/getdata/, async (msg) => {
//   console.log(msg)
//   try {
//     // Отправляем GET-запрос на сервер с параметрами
//     //const response = await get(serverUrl, { params })
//     console.log(serverUrl)
//     const response = await axios.get(serverUrl)
//     console.log(response.data)

//     // Получаем данные из npm JSON-ответа сервера
//     const data = response.data

//     // Отправляем сообщение с полученными данными пользователю
//     bot.sendMessage(msg.chat.id, JSON.stringify(data))
//   } catch (error) {
//     // Если произошла ошибка, отправляем сообщение с описанием ошибки
//     bot.sendMessage(msg.chat.id, "Ошибка: ${error.message}")
//   }
// })
