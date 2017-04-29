const Botkit = require('botkit');

const controller = Botkit.facebookbot({
  access_token: process.env.access_token,
  verify_token: process.env.verify_token,
})

const bot = controller.spawn({});

// if you are already using Express, you can use your own server instance...
// see "Use BotKit with an Express web server"
controller.setupWebserver(process.env.PORT || 3000, (err, webserver) => {
  controller.createWebhookEndpoints(controller.webserver, bot, () => {
    console.log('This bot is online!!!');
  });
});

// this is triggered when a user clicks the send-to-messenger plugin
controller.on('facebook_optin', (bot, message) => {
  bot.reply(message, 'Welcome to my app!');
});

// user said hello
// controller.hears(['hello'], 'message_received', (bot, message) => {
//   bot.reply(message, 'Hey there.');
// });

controller.on('message_received', (bot, message) => {
  if (!message.text) {
    if (message.attachments && message.attachments[0]) {
      controller.trigger(message.attachments[0].type + '_received', [bot, message]);
      return false;
    }
  }
});

controller.on('image_received', function(bot, message) {
  const attachment = {
    'text': 'What do you think of this park?',
    'quick_replies': [
      {
        'type': 'postback',
        'title': '👍',
        'payload': 'LIKE'
      },
      {
        'type': 'postback',
        'title': '👎',
        'payload': 'NOT_LIKE'
      }
    ]
  }

  bot.replyWithTyping(message, { attachment });
});

// controller.hears(['cookies'], 'message_received', (bot, message) => {
//   bot.startConversation(message, (err, convo) => {
//     convo.say('Did someone say cookies!?!!');
//     convo.ask('What is your favorite type of cookie?', (response, convo) => {
//       convo.say('Golly, I love ' + response.text + ' too!!!');
//       convo.next();
//     });
//   });
// });
