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

controller.api.thread_settings.greeting('Hey thanks for coming to talk to us. We are Sustaincity and we want to create cleaner parks that we can all roll around in.');
controller.api.messenger_profile.get_started()

// this is triggered when a user clicks the send-to-messenger plugin
controller.on('facebook_optin', (bot, message) => {
  bot.reply(message, 'Welcome to my app!');
});

controller.on('facebook_referral', (bot, message) => {
  bot.reply(message, 'Welcome to my app!');
});

controller.on('facebook_postback', function(bot, message) {
  if (message.payload == 'get_started') {
    bot.reply(message, 'You ate the chocolate cookie!')
  }
});

// controller.on('message_received', (bot, message) => {
//   if (!message.text) {
//     console.log(message.attachments[0]);
//     console.log(message.attachments[0].payload);
//     if (message.attachments && message.attachments[0]) {
//       // controller.trigger(message.attachments[0].type + '_received', [bot, message]);
//       bot.say('Your picture has been received, thank you.');
//       return false;
//     }
//   }
// });

controller.hears(['feedback'], 'message_received', function(bot, message) {
  bot.startConversation(message, (err, convo) => {
    const location = {
      'text': 'Where are you?',
      'quick_replies': [
        {
          'content_type': 'location'
        }
      ]
    };
    const opinion = {
      'text': 'Tell us how you feel about this park.',
      'quick_replies': [
        {
          'type': 'postback',
          'title': '🙂',
          'payload': 'HAPPY'
        },
        {
          'type': 'postback',
          'title': '😟',
          'payload': 'SAD'
        },
        {
          'type': 'postback',
          'title': '😠',
          'payload': 'ANGRY'
        }
      ]
    };

    convo.ask(location, (response, convo) => {
      let coordinates = response.attachments[0].payload;
      console.log('Location', coordinates);
      convo.next();

      convo.ask(opinion, (response, convo) => {
        convo.next();

        convo.ask('Why ? Send us a picture of the park.', (response, convo) => {
          let picture = response.attachments[0].payload;
          console.log('Picture', picture);

          convo.say('You did so well! Thanks for making this park a better place. With your feedback we are doing some really cool stuff at http://www.sustaincity.space Come check us out!');
          convo.next();
        });
      });
    });
  });
});
