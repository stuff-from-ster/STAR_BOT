var Discord = require("discord.js");

var yt = require("./youtube_plugin");
var youtube_plugin = new yt();

var gi = require("./google_image_plugin");
var google_image_plugin = new gi();

var wa = require("./wolfram_plugin");
var wolfram_plugin = new wa();

// Get the email and password
var AuthDetails = require("./auth.json");
var qs = require("querystring");

var htmlToText = require('html-to-text');

var lastCommandUsed = "";

var bot = new Discord.Client();


bot.on("ready", function () {
  console.log("Ready to begin! Serving in " + bot.channels.length + " channels");
});

bot.on("disconnected", function () {

  console.log("Disconnected!");
  process.exit(1); //exit node.js with an error
  
});

bot.on("message", function(msg) {
  //Checks if the message is a command
  if (msg.content[0] === '$') {
    var command = msg.content.toLowerCase().split(" ")[0].substring(1);
    var suffix = msg.content.toLowerCase().substring(command.length + 2);
    var cmd = commands[command];
    if (cmd) {
      cmd.process(bot, msg, suffix);
    }
  }

});
 

//Log user status changes
bot.on("presence", function(data) {
  //if(status === "online"){
  //console.log("presence update");
  console.log(data.user+" just went "+data.status);
  //}
});


var commands = {
        "ping": {
     description: "Pongs the user, showing the bot is alive.",
        process: function(bot, msg, suffix) {
          bot.sendMessage(msg.channel, msg.sender + " **Pong!**")
           return lastCommandUsed = "**ping**"
          }
    },
            "lastcommand": {
     description: "shows the last command used",
        process: function(bot, msg, suffix) {
          bot.sendMessage(msg.channel, "Last command used: " + lastCommandUsed);
           return lastCommandUsed = "**lastcommand**"
          }
    },
           "serverinfo": {
        description: "Gives server info",
        process: function(bot, msg, suffix) {
          // if we're not in a PM, return some info about the channel
        if (msg.channel.server) {
              var msgArray = [];
                msgArray.push("You are currently in " + msg.channel + " (id: " + msg.channel.id + ")");
                msgArray.push("on server **" + msg.channel.server.name + "** (id: " + msg.channel.server.id + ") (region: " + msg.channel.server.region + ")");
                msgArray.push("The owner of the server is: " + msg.channel.server.owner + " (id: " + msg.channel.server.owner.id + ")");
                if (msg.channel.topic) { msgArray.push("The topic for this channel is: " + msg.channel.topic); }
                bot.sendMessage(msg, msgArray);
                 return lastCommandUsed = "**serverinfo**"
              }
          else{
            bot.sendMessage(msg, "This command does not work in DMs, please use on a server where I can see it.");
          }
        }
      },
                "clever": {
      process: function(bot, msg) {
        var cb = msg.content.split(" ")[0].substring(1);
        var cbi = msg.content.substring(cb.length+2);
        var cleverbot = require("cleverbot.io"),
        clever = new cleverbot("ivdEepdaKlyesTUP", "eT9CjiGNCcQcpPEjvzaT7XS5Uv8TXVIM");
        clever.setNick("STER_BOT");
         return lastCommandUsed = "**clever**"
        clever.create(function (err, session) {
          clever.ask(cbi, function (err, response) {
            bot.sendMessage(msg.channel, response);
          });
        });
      }
    },
            "johncena": {
        description: "AND HIS NAME IS",
        process: function(bot, msg, suffix) {
            bot.sendMessage(msg.channel, " **AND HIS NAME IS** https://www.youtube.com/watch?v=4k1xY7v8dDQ");
             return lastCommandUsed = "**JohnCena**"
        }
    },
      "setname": {
        description: "bot sets a name.",
        adminOnly: true,
        process: function(bot, msg, suffix) {
            bot.setUsername(suffix);
            bot.sendMessage(msg.channel, msg.sender + " Hi! My name is " + suffix);
             return lastCommandUsed = "**Setname**"
        }
    },
    "resetname": {
      process: function(bot, msg, suffix) {
        bot.setUsername("STAR_BOT");
        bot.sendMessage(msg.channel, "Name reset to default.")
         return lastCommandUsed = "**resetname**"
      }
    },
        "stats": {
        description: "Prints the stats from the instance into the chat.",
        process: function(bot, msg, suffix) {
          var msgArray = [];
            msgArray.push("I have been alive for " + (Math.round(bot.uptime/(1000*60*60))) + " hours, " + (Math.round(bot.uptime/(1000*60))%60) + " minutes, and " + (Math.round(bot.uptime/1000)%60) + " seconds. (may not be exact)");
            msgArray.push("I am in **" + bot.servers.length + "** servers, and in **" + bot.channels.length + "** channels.");
            msgArray.push("Currently, I'm connected to **" + bot.users.length + "** different people");
            msgArray.push("My current username is **" + bot.user + "**, and right now, I am at v**" + version + "**");
            console.log(msg.sender + " requested the bot status.");
            bot.sendMessage(msg, msgArray);
             return lastCommandUsed = "**Stats**"
        }
    },
    "setgame": {
        description: "bot plays a given game",
        process: function(bot, msg, suffix) {
            if(suffix) {
            bot.setPlayingGame(suffix);
            bot.sendMessage(msg.channel, msg.sender + " Now playing " + suffix);
             return lastCommandUsed = "**setgame**"
          }
          else {
            bot.sendMessage(msg.channel, "Please do !gameshelp for more info and ids on this command");
          }
        }
    },
    "gameshelp": {
    process: function(bot, msg) {
      bot.sendMessage(msg.channel, "Check your PM's")
      bot.sendFile(msg.author, "./images/games.json");
       return lastCommandUsed = "**gameshelp**"
    }
  },
  "urban": {
    process: function(bot, msg, suffix) {
      var query = suffix;
      if (!query) {
        bot.sendMessage(msg.channel, "Usage: !urban **search terms**");
         return lastCommandUsed = "**Urban**"
        return;
      }
      var Urban = require('urban');
      Urban(suffix).first(function(json) {
        if (json !== undefined) {
          var definition = "" + json.word + ": " + json.definition + "\n:arrow_up: " + json.thumbs_up + "   :arrow_down: " + json.thumbs_down + "\n\nExample: " + json.example;
          bot.sendMessage(msg.channel, definition);
        } else {
          bot.sendMessage(msg.channel, "I couldn't find a definition for: " + suffix);
        }
      });
    }
  },
    "uptime": {
        process: function(bot, msg){
          var uptimeh = Math.floor((bot.uptime / 1000) / (60*60));
          var uptimem = Math.floor((bot.uptime / 1000) % (60*60) / 60);
          var uptimes = Math.floor((bot.uptime / 1000) % 60);
          bot.sendMessage(msg.channel, "I have been online for at least:\n" + uptimeh + " Hours\n" + uptimem + " Minutes\n" + uptimes + " Seconds\n");
           return lastCommandUsed = "**uptime**"
      }
    },
     "hello": {
        description: "Say hi!",
        process: function(bot, msg, suffix) {
            bot.sendMessage(msg.channel, "Well hi there! I am StarBot. I am owned by the almighty STER_LORD. You can find out more about me by PMing me !help. ");
             return lastCommandUsed = "**hello**"
            if(suffix){
                bot.sendMessage(msg.channel, "This command takes no arguements!");
            }
        }
    },
     "roll": {
    process: function(bot, msg) {
        var input = msg.content.split(" ")[1];
        if (input) {
          var number = Math.floor(Math.random() * input) + 1;
        }
        else {
          var number = Math.floor(Math.random() * 6) + 1;
        }
        bot.sendMessage(msg.channel, msg.sender + " Rolled " + number);
         return lastCommandUsed = "**roll**"
      }
    },
    "game": {
        usage: "<name of game>",
        description: "pings channel asking if anyone wants to play",
        process: function(bot,msg,suffix){
            var game = game_abbreviations[suffix];
            if(!game) {
                game = suffix;
            }
            bot.sendMessage(msg.channel, "Anyone up for " + game + "?");
            console.log("Sending game invites for " + game);
            bot.setPlayingGame(game);
             return lastCommandUsed = "**game**"
        }
    },
        "avatarof": {
      process: function(bot, msg, suffix){
        if (msg.mentions.length === 0) {
                bot.sendMessage(msg.channel, msg.sender.avatarURL);
                return;
            }
            var msgArray = [];
            for (index in msg.mentions) {
                var user = msg.mentions[index];
                if(user.avatarURL === null) {
                    msgArray.push(user.username + " is naked. (has no profile pic.) Ew.");
                } else {
                    msgArray.push(user.username + "'s avatar is: " + user.avatarURL);
                }
            }
            bot.sendMessage(msg.channel, msgArray);
             return lastCommandUsed = "**avatarof**"
      }
    },
      "stock": {
        usage: "<stock to fetch>",
        process: function(bot,msg,suffix) {
            var yahooFinance = require('yahoo-finance');
            yahooFinance.snapshot({
              symbol: suffix,
              fields: ['s', 'n', 'd1', 'l1', 'y', 'r'],
            }, function (error, snapshot) {
                if(error){
                    bot.sendMessage(msg.channel,"couldn't get stock: " + error);
                } else {
                    //bot.sendMessage(msg.channel,JSON.stringify(snapshot));
                    bot.sendMessage(msg.channel,snapshot.name
                        + "\nprice: $" + snapshot.lastTradePriceOnly);
                     return lastCommandUsed = "**stock**"
                }  
            });
        }
    },
       "insultme": {
      process: function(bot, msg, suffix) {
         if (suffix.length === 0) {
          var rand = Math.floor(Math.random() * insult.length);
          bot.sendMessage(msg.channel, msg.sender + ":crystal_ball:**" + insult[rand] + "**:crystal_ball:");
           return lastCommandUsed = "**insultme**"
        }
        else {
          var rand = Math.floor(Math.random() * insult.length);
          bot.sendMessage(msg.channel, msg.sender + ":crystal_ball:**" + insult[rand] + "**:crystal_ball:");
           return lastCommandUsed = "**insultme**"
        }
      }
    },   
     "eightball": {
      process: function(bot, msg, suffix) {
        if (suffix.length === 0) {
          bot.sendMessage(msg.channel, msg.sender + "You call that a question?\nhttp://i.imgur.com/PcXHbt6.png");
           return lastCommandUsed = "**eightball**"
        }
        else {
          var rand = Math.floor(Math.random() * EightBall.length);
          bot.sendMessage(msg.channel, msg.sender + ":crystal_ball:**" + EightBall[rand] + "**:crystal_ball:");
           return lastCommandUsed = "**eightball**"
        }
      }
    },    
     "urban": {
        process: function(bot, msg, suffix) {
            var query = suffix;
            if(!query) {
                bot.sendMessage(msg.channel, "Usage: !urban **search terms**");
                 return lastCommandUsed = "**urban**"
                return;
            }
            var Urban = require('urban');
            Urban(suffix).first(function(json) {
                if (json !== undefined) {
                    var definition = "" + json.word + ": " + json.definition + "\n:arrow_up: " + json.thumbs_up + "   :arrow_down: " + json.thumbs_down + "\n\nExample: " + json.example;
                    bot.sendMessage(msg.channel,definition);
                     return lastCommandUsed = "**urban**"
                }
                else
                { bot.sendMessage(msg.channel,"Odd. Urban Dictionary has no definition for: " + suffix);
               return lastCommandUsed = "**urban**"
              }
            });
        }
    },
    "reddit": {
        usage: "[subreddit]",
        description: "Returns the top post on reddit. Can optionally pass a subreddit to get the top psot there instead",
        process: function(bot,msg,suffix) {
            var path = "/.rss"
            if(suffix){
                path = "/r/"+suffix+path;
            }
            rssfeed(bot,msg,"https://www.reddit.com"+path,1,false);
             return lastCommandUsed = "**reddit**"
        }
    },
  "wolfram": {
    usage: "<search terms>",
        description: "gives results from wolframalpha using search terms",
        process: function(bot,msg,suffix){
      if(!suffix){
        bot.sendMessage(msg.channel,"Usage: !wolfram <search terms> (Ex. !wolfram integrate 4x)");
         return lastCommandUsed = "**wolfram**"
      }
            wolfram_plugin.respond(suffix,msg.channel,bot);
             return lastCommandUsed = "**Wolfram**"
        }
  },
    "log": {
        usage: "<log message>",
        description: "logs message to bot console",
        process: function(bot,msg,suffix){console.log(msg.content);
        return lastCommandUsed = "**log**"
      }   
    },
    "join": {
        usage: "<invite>",
        description: "joins the server it's invited to",
        process: function(bot,msg,suffix) {
            console.log(bot.joinServer(suffix,function(error,server) {
                console.log("callback: " + arguments);
                if(error){
                    bot.sendMessage(msg.channel,"failed to join: " + error);
                     return lastCommandUsed = "**join**"
                } else {
                    console.log("Joined server " + server);
                    bot.sendMessage(msg.channel,"Successfully joined " + server);
                     return lastCommandUsed = "**join**"
                }
            }));
        }
    },
     "s": {
        usage: "<message>",
        description: "bot says message",
        process: function(bot,msg,suffix){ bot.sendMessage(msg.channel,suffix,true);
          return lastCommandUsed = "**s**"
        }
    },
    "img": {
        usage: "<image tags>",
        description: "gets image matching tags from google",
        process: function(bot,msg,suffix){ google_image_plugin.respond(suffix,msg.channel,bot);
        return lastCommandUsed = "**img**"
        }
    },
    "servers": {
        description: "lists servers bot is connected to",
        process: function(bot,msg){bot.sendMessage(msg.channel,bot.servers);
           return lastCommandUsed = "**servers**"
        }
    },
    "channels": {
        description: "lists channels bot is connected to",
        process: function(bot,msg) { bot.sendMessage(msg.channel,bot.channels);
         return lastCommandUsed = "**channels**"
        }
    },
    "myid": {
        description: "returns the user id of the sender",
        process: function(bot,msg){bot.sendMessage(msg.channel,msg.author.id);
         return lastCommandUsed = "**myid**"
       }
    },
    "idle": {
        description: "sets bot status to idle",
        process: function(bot,msg){ bot.setStatusIdle();
       return lastCommandUsed = "**idle**"
        }
    },
    "online": {
        description: "sets bot status to online",
        process: function(bot,msg){ bot.setStatusOnline();
         return lastCommandUsed = "**online**"
       }
    },
      "guts": {
        description: "shows the guts of the bot.",
        process: function(bot, msg, suffix) {
            bot.sendMessage(msg.channel, "You can find my inner workings on github at https://github.com/discordbots/STAR_BOT . Please note this is NOT kept up to date and doesn't even have this feature :laughing:");
             return lastCommandUsed = "**guts**"
            if(suffix){
                bot.sendMessage(msg.channel, "This takes no arguements.");
            }
        }
    },
    "commands": {
        process: function(bot, msg) {bot.sendMessage(msg.author, help);
        return lastCommandUsed = "**commands**"
      }
    },
     "help": {
        process: function(bot, msg) {bot.sendMessage(msg.author, help);
        return lastCommandUsed = "**help**"
        }
    },
};

var EightBall = [
      "It is certain",
      "My CPU is saying yes",
      "Without a doubt",
      "Yes, definitely",
      "Yes, unless you run out of memes",
      "As I see it, yes",
      "Most likely",
      "If you say so",
      "Sure, sure",
      "Signs point to yes",
      "You can't handle the truth",
      "When life gives you rice, you make rice",
      "Better not tell you now",
      "Cannot predict now",
      "Out of psychic coverage range",
      "Don't count on it",
      "My CPU is saying no",
      "In your dreams",
      "You are doomed",
      "Very doubtful",
      "私はあなたのお母さんを翻訳しました",
      "Wow, Much no, very yes, so maybe",
      "No. No. No. No And an thousand times no.",
      "No. Get out.",
      "I didn't catch that, please try again.",
      "That is for you to find out."
];

var version = "2.0.0";

var help = [
"**!avatarof**: '@Username': gives the avatar of someone. Naked means they have no avatar.",
"**!johncena**: AND HIS NAME IS",
"**!setname**: Bot sets its name.",
"**!setgame**: Plays a given game, do !gameshelp for more info",
"**!gameshelp**: Sends games.json, a list of games and thier ids",
"**!ayy**: lmao",
"**!snoopdawgify**: (sentence) Snoop dogifys the sentence you put in.", 
"**!s 'query'**: Says something for you.",
"**!gif**: 'gif tags': gets a gif.",
"**!img**: 'image tags': Gets an image from Google matching the given tags. WARNING: NO ADULT FILTER",
"**!join**: 'invite': Joins a server",
"**!serverinfo**: Gives info on the server you are on.",
"**!help**: You are looking at it.",
"**!commands**: Ailias for !help.",
"**!memesavailable**: Lists available meme names",
"**!myid**: Responds with the user ID of the sender",
"**!spookme**: Spooks you a given number of times. Check your PMs",
"**!roll**: Rolls the dice. Add a number to change the number of sides.",
"**!servers**: Shows all the servers the bot is connected to",
"**!urbandict** 'search terms': urban dictionary search engine",
"**!uptime**: Shows how long the bot has been online",
"**!eightball** 'question': Asks the 8ball a question.",
"**!clever**: interacts with cleverbot",
"**!game** 'query': pings the chatroom asking if anyone wants to play a specified game.",
"**!contact**: Shows contact info for contacting STAR_LORD whenever you need him.",
"**!guts**: Wanna see how I click? This command shows a github link to all my files. STAR_LORD doesn’t usually keep this up to date.",
"**!hello**: Gives some baseline info and says hi",
"**!wolfram** 'term': Gets stuff from Wolfram Alpha",
"**!rss**: Gives some RSS feeds. Ask @STAR_LORD if you want more added. Be sure to include a URL.",
"**!idle**: Sets bot status to idle. Can be changed with !online",
"**!log**: Drops a message in the bot console. Rarely noticed.",
"**!stock** 'stockname': IDK why i coded this, but gives a stock of some company.",
"**!youtube**: Searches youtube for vids."
]


var Quotes = [
  "Going to church doesn’t make you a Christian any more than standing in a garage makes you a car. - *Billy Sunday*",
  "I dream of a better tomorrow, where chickens can cross the road and not be questioned about their motives.",
  "I hate when old people poke you at a wedding and say you're next. So when I was at a funeral I poked them and said you're next.",
  "I think the worst time to have a heart attack is during a game of charades. - *Demetri Martin*",
  "I asked God for a bike, but I know God doesn’t work that way. So I stole a bike and asked for forgiveness. - *Emo Philips*",
  "The only mystery in life is why the kamikaze pilots wore helmets. - *Al McGuire*",
  "How is it one careless match can start a forest fire, but it takes a whole box to start a campfire?",
  "I couldn’t repair your brakes, so I made your horn louder. - *Steven Wright*",
  "I intend to live forever. So far, so good. - *Steven Wright*",
  "I dream of a better tomorrow, where chickens can cross the road and not be questioned about their motives.",
  "When tempted to fight fire with fire, remember that the Fire Department usually uses water.",
  "My favorite machine at the gym is the vending machine.",
  "I always arrive late at the office, but I make up for it by leaving early. - *Charles Lamb*",
  "Just do it. - *Shia Labeouf*",
  "Don't let your dreams be memes. - *Shia LaBeouf*",
  "Jet fuel can't melt steel beams. - *Barack Obama*",
  "Jet fuel can't melt steel memes. - *Barack Obama*",
  "Born too late to explore the earth\nBorn too soon to explore the galaxy\nBorn just in time to **browse dank memes**",
  "Feels good man. - *Pepe*"
];

var config = {
    "api_key": "dc6zaTOxFJmzC",
    "rating": "r",
    "url": "http://api.giphy.com/v1/gifs/search",
    "permission": ["NORMAL"]

};

var insult = [
      "Your mom",
      "You were dropped as a baby.",
      "You are the result of not using a condom.",
      "You are one pussy face.",
      "Your life is a mistake.",
      "Even AutoModerator is better compared to you!",
      "You are so ugly that your mom can run a forklift naked.",
      "Roses are red, violets are blue, I have 5 fingers, the 3rd ones for you.",
      "I’m jealous of all the people that haven't met you!",
      "You must have been born on a highway because that's where most accidents happen.",
      "I could eat a bowl of alphabet soup and shit out a smarter statement than that.",
      "If I wanted to kill myself I'd climb your ego and jump to your IQ.",
      "Your family tree must be a cactus because everybody on it is a prick."
];

var admin_ids = ["101738188640358400"];

var game_abbreviations = {
    "cs": "Counter-Strike",
    "hon": "Heroes of Newerth",
    "hots": "Heroes of the Storm",
    "sc2": "Starcraft II",
    "gta": "Grand Theft Auto",
    "cs": "Counter-Strike",
  "hon": "Heroes of Newerth",
  "hots": "Heroes of the Storm",
  "sc2": "Starcraft II",
  "wf": "Warframe",
  "gtao": "Grand Theft Auto: Online",
  "gta": "Grand Theft Auto",
  "lol": "League of Legends",
  "wow": "World of Warcraft",
  "tf2": "Team Fortress 2",
  "p2": "Portal 2",
  "civ": "Civilization",
  "se": "Space Engineers",
  "cod": "Call of Duty",
    "db": "Dirty Bomb",
    "rs": "RuneScape",
    "sr": "Shadowrun",
    "mgs5": "Metal Gear Solid V",
    "ed": "Elite: Dangerous",
    "pd": "PayDay",
    "pd2": "PayDay 2",
    "me": "Medieval Engineers",
    "me3": "Mass Effect 3",
    "ws": "WildStar",
    "aoe": "Age Of Empires",
    "wt": "War Thunder",
    "jc": "Just Cause",
    "wd": "Watch_Dogs",
    "sb": "StarBound"
};


















































bot.login(AuthDetails.email, AuthDetails.password);