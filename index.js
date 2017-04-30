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

// this is triggered when a user clicks the send-to-messenger plugin
controller.on('facebook_optin', (bot, message) => {
  bot.reply(message, 'Welcome to my app!');
});

controller.on('message_received', (bot, message) => {
  console.log(message);
  if (!message.text) {
    if (message.attachments && message.attachments[0]) {
      // controller.trigger(message.attachments[0].type + '_received', [bot, message]);
      bot.say('Your picture has been received, thank you.');
      return false;
    }
  }
});

controller.hears(['feedback'], 'message_received', function(bot, message) {
  bot.startConversation(message, (err, convo) => {
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
          'title': '☹️',
          'payload': 'SAD'
        },
        {
          'type': 'postback',
          'title': '😡',
          'payload': 'ANGRY'
        }
      ]
    };
    const location = {
      'text': 'Where are you?',
      'quick_replies': [
        {
          'content_type': 'location'
        }
      ]
    };

    convo.addQuestion(opinion, (response, convo) => {

      convo.say('Thank your for your answer.');
      convo.next();

    }, {}, 'default');

    convo.addQuestion(location, (response, convo) => {

      console.log(response);
      convo.say('Got your location.');
      convo.next();

    }, {}, 'default');
  });
});

controller.hears(['location'], 'message_received', (bot, message) => {
  bot.startConversation(message, (err, convo) => {
    const location = {
      'text': 'Where are you?',
      'quick_replies': [
        {
          'content_type': 'location'
        }
      ]
    };

    convo.ask(location, (response, convo) => {
      convo.say('Got your location.');
      convo.next();
    });
  });
});

controller.hears(['send'], 'message_received', (bot, message) => {
  bot.startConversation(message, (err, convo) => {
    convo.ask('Where are you ?', (response, convo) => {
      console.log(convo);
      convo.say('Got your location.');
      convo.next();
    });
  });
});