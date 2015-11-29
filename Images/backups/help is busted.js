
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
      "Wow, Much no, very yes, so maybe"
];

var Choices = [
      "I have decided upon",
      "I would choose",
      "In my opinion, it's",
      "I'd go with",
      "My final decision is",
      "You're better off with",
      "It's absolutely",
      "Definitely",
      "The answer is"
];

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


//https://api.imgflip.com/popular_meme_ids
var meme = {
	"brace": 61546,
	"mostinteresting": 61532,
	"fry": 61520,
	"onedoesnot": 61579,
	"yuno": 61527,
	"success": 61544,
	"allthethings": 61533,
	"doge": 8072285,
	"drevil": 40945639,
	"skeptical": 101711,
	"notime": 442575,
	"yodawg": 101716,
    "highguy": 101440,
    "idontalways": 61532,
    "jackiechan": 412211,
    "karate": 61561,
    "lebowsky": 1195347,
    "mrbean": 583373,
    "nappa": 295701,
    "onedoesnot": 61579,
    "spidermanbed": 152145,
    "spidermandesk": 1366993,
    "spidermanrails": 413621,
    "squidward": 285870,
    "takemymoney": 176908
};

var game_abbreviations = {
    "cs": "Counter-Strike",
    "hon": "Heroes of Newerth",
    "hots": "Heroes of the Storm",
    "sc2": "Starcraft II",
    "gta": "Grand Theft Auto",
    "tf2": "Team Fortress 2",
    "tl2": "Torchlight 2",
    "ow": "OverWatch",
    "sr": "Saints Row"    

};

var commands = {
	"gif": {
         process: function(bot, msg, suffix) {
           var query = suffix;
           if(!query) {
               bot.sendMessage(msg.channel, "Usage: !gif **gif tags**");
               return;
           }
           var tags = suffix.split(" ");
           get_gif(tags, function(id) {
              if (typeof id !== "undefined") {
                        bot.sendMessage(msg.channel, "http://media.giphy.com/media/" + id + "/giphy.gif [Tags: " + (tags ? tags : "Random GIF") + "]");
                    }
              else {
                        bot.sendMessage(msg.channel, "Invalid tags, try something different. [Tags: " + (tags ? tags : "Random GIF") + "]");
                    }
              });
          }
    },
      "8ball": {
      process: function(bot, msg, suffix) {
        if (suffix.length === 0) {
          bot.sendMessage(msg.channel, msg.sender + "You call that a question?\nhttp://i.imgur.com/PcXHbt6.png");
        }
        else {
          var rand = Math.floor(Math.random() * EightBall.length);
          bot.sendMessage(msg.channel, msg.sender + ":crystal_ball:**" + EightBall[rand] + "**:crystal_ball:");
        }
      }
    },
     "decide": {
      process: function(bot, msg, suffix) {
        var input = msg.content.substring(('!decide').length + 1);
        var split = input.split(" or ");
        var rand = Math.floor(Math.random() * Choices.length);
        if(split.length > 1) {
          bot.sendMessage(msg.channel, Choices[rand] + " **" + multipleDecide(split) + "**");
        }
        else {
          bot.sendMessage(msg.channel, "Usage: !decide *something* **or** *something* **or** *something*...");
        }
        function multipleDecide(options) {
          var selected = options[Math.floor(Math.random() * options.length)];
          if(selected === "") {
            return multipleDecide(options);
          }
          else {
            return selected;
          }
        }
      }
    },
    "quote": {
      process: function(bot, msg) {
        var rand = Math.floor(Math.random() * Quotes.length);
        bot.sendMessage(msg.channel, Quotes[rand]);
      }
    },
    "urban": {
        process: function(bot, msg, suffix) {
            var query = suffix;
            if(!query) {
                bot.sendMessage(msg.channel, "Usage: !urban **search terms**");
                return;
            }
            var Urban = require('urban');
            Urban(suffix).first(function(json) {
                if (json !== undefined) {
                    var definition = "" + json.word + ": " + json.definition + "\n:arrow_up: " + json.thumbs_up + "   :arrow_down: " + json.thumbs_down + "\n\nExample: " + json.example;
                    bot.sendMessage(msg.channel,definition);
                }
                else
                { bot.sendMessage(msg.channel,"Odd. Urban Dictionary has no definition for: " + suffix);
              }
            });
        }
    },
     "spookme": {
    process: function(bot, msg, suffix) {
        var input = msg.content.split(" ")[1];
        if (input) {
          var numbers = Math.floor(Math.random() * input) + 1;
        }
        else {
          var numbers = Math.floor(Math.random() * 6969) + 1;
        }
        var ricks = msg.content.split(" ")[1];
        if (ricks) {
          var count = Math.floor(Math.random() * input) + 1;
        }
        else {
          var count = Math.floor(Math.random() * 9696) + 1;
        }
          bot.sendMessage(msg.channel, "Check your PM's");
          bot.sendMessage(msg.author, "```You got Spooked by the spoopy scary skeleton " + count + " times!```\nhttps://www.youtube.com/watch?v=q6-ZGAGcJrk\nhttp://imgur.com/gallery/CJ0LmWl");
      }
    },
    "commands": {
        description: "Same as !help, just not as spammy",
        process: function(bot, msg, suffix) {
            bot.sendMessage(msg.author, " Available commands are: changelog,     ayy,    log (sends msg to my console),  swears (not bad dont worry),    spookme,    gif,   uptime, hello,   youtube {tags},    online, join-server (your server here),  game (name of game),   wiki (term),      wolfram (term),   image (tags),   urban (urban dictionary),    rss,   myid,    meme (setup like !meme nameofmeme 'text' 'text'),  roll,    idle,  stock (stockname),   avatar,    servers,    say (msg),  reddit (subreddit) and memehelp.");
            if(suffix){
                bot.sendMessage(msg.author, "If you are seeing this, something is wrong. Please contact @STER_LORD. ");
            }
        }
    },
     "changelog": {
        description: "Bot changelog",
        process: function(bot, msg, suffix) {
            bot.sendMessage(msg.channel, " 11/8/15 Added changelog, fixed a few grammar errors, fixed an error that caused an endless mention loop. 11/9: Added !urban command, and added !commands command (a better help feature.)");
            if(suffix){
                bot.sendMessage(msg.channel, "If you are seeing this, something is wrong. Please contact @STER_LORD. ");
            }
        }
    },
       "ayy": {
        description: "lmao for days",
        process: function(bot, msg, suffix) {
            bot.sendMessage(msg.channel, "lmao");
            if(suffix){
                bot.sendMessage(msg.channel, "If you are seeing this, something is wrong. Please contact @STER_LORD. ");
            }
        }
    },
    "kappa": {
      process: function(bot, msg){bot.sendFile(msg.channel, "./images/Kappa.png");}
    },
    "makemeasandwich": {
      process: function(bot, msg){bot.sendFile(msg.channel, "./images/sandwich.jpeg");}
    },
    "swears": {
      process: function(bot, msg){bot.sendFile(msg.channel, "./images/search.jpg");}
    },
     "uptime": {
        process: function(bot, msg){
          var uptimeh = Math.floor((bot.uptime / 1000) / (60*60));
          var uptimem = Math.floor((bot.uptime / 1000) % (60*60) / 60);
          var uptimes = Math.floor((bot.uptime / 1000) % 60);
          bot.sendMessage(msg.channel, "I have been online for at least:\n" + uptimeh + " Hours\n" + uptimem + " Minutes\n" + uptimes + " Seconds\n");
      }
    },
     "hello": {
        description: "Say hi!",
        process: function(bot, msg, suffix) {
            bot.sendMessage(msg.channel, "Well hi there! I am StarBot. I am owned by the almighty STER_LORD. You can find out more about me by PMing me !help. ");
            if(suffix){
                bot.sendMessage(msg.channel, "If you are seeing this, something is wrong. Please contact @STER_LORD. ");
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
            bot.sendMessage(msg.channel, "@everyone Anyone up for " + game + "?");
            console.log("Sending game invites for " + game);
        }
    },
    "servers": {
        description: "lists servers bot is connected to",
        process: function(bot,msg){bot.sendMessage(msg.channel,bot.servers);}
    },
    "channels": {
        description: "lists channels bot is connected to",
        process: function(bot,msg) { bot.sendMessage(msg.channel,bot.channels);}
    },
    "myid": {
        description: "returns the user id of the sender",
        process: function(bot,msg){bot.sendMessage(msg.channel,msg.author.id);}
    },
    "idle": {
        description: "sets bot status to idle",
        process: function(bot,msg){ bot.setStatusIdle();}
    },
    "online": {
        description: "sets bot status to online",
        process: function(bot,msg){ bot.setStatusOnline();}
    },
    "youtube": {
        usage: "<video tags>",
        description: "gets youtube video matching tags",
        process: function(bot,msg,suffix){
            youtube_plugin.respond(suffix,msg.channel,bot);
        }
    },
    "say": {
        usage: "<message>",
        description: "bot says message",
        process: function(bot,msg,suffix){ bot.sendMessage(msg.channel,suffix,true);}
    },
    "image": {
        usage: "<image tags>",
        description: "gets image matching tags from google",
        process: function(bot,msg,suffix){ google_image_plugin.respond(suffix,msg.channel,bot);}
    },
    "pullanddeploy": {
        description: "bot will perform a git pull master and restart with the new code",
        process: function(bot,msg,suffix) {
            bot.sendMessage(msg.channel,"fetching updates...",function(error,sentMsg){
                console.log("updating...");
	            var spawn = require('child_process').spawn;
                var log = function(err,stdout,stderr){
                    if(stdout){console.log(stdout);}
                    if(stderr){console.log(stderr);}
                };
                var fetch = spawn('git', ['fetch']);
                fetch.stdout.on('data',function(data){
                    console.log(data.toString());
                });
                fetch.on("close",function(code){
                    var reset = spawn('git', ['reset','--hard','origin/master']);
                    reset.stdout.on('data',function(data){
                        console.log(data.toString());
                    });
                    reset.on("close",function(code){
                        var npm = spawn('npm', ['install']);
                        npm.stdout.on('data',function(data){
                            console.log(data.toString());
                        });
                        npm.on("close",function(code){
                            console.log("goodbye");
                            bot.sendMessage(msg.channel,"brb!",function(){
                                bot.logout(function(){
                                    process.exit();
                                });
                            });
                        });
                    });
                });
            });
        }
    },
    "meme": {
        usage: 'meme "top text" "bottom text"',
        process: function(bot,msg,suffix) {
            var tags = msg.content.split('"');
            var memetype = tags[0].split(" ")[1];
            //bot.sendMessage(msg.channel,tags);
            var Imgflipper = require("imgflipper");
            var imgflipper = new Imgflipper(AuthDetails.imgflip_username, AuthDetails.imgflip_password);
            imgflipper.generateMeme(meme[memetype], tags[1]?tags[1]:"", tags[3]?tags[3]:"", function(err, image){
                //console.log(arguments);
                bot.sendMessage(msg.channel,image);
            });
        }
    },
    "memehelp": { //TODO: this should be handled by !help
        description: "returns available memes for !meme",
        process: function(bot,msg) {
            var str = "Currently available memes:\n"
            for (var m in meme){
                str += m + "\n"
            }
            bot.sendMessage(msg.channel,str);
        }
    },
    "version": {
        description: "returns the git commit this bot is running",
        process: function(bot,msg,suffix) {
            var commit = require('child_process').spawn('git', ['log','-n','1']);
            commit.stdout.on('data', function(data) {
                bot.sendMessage(msg.channel,data);
            });
            commit.on('close',function(code) {
                if( code != 0){
                    bot.sendMessage(msg.channel,"failed checking git version!");
                }
            });
        }
    },
    "avatar": {
      process: function(bot, msg, suffix){
        if (msg.mentions.length === 0) {
                bot.sendMessage(msg.channel, msg.sender.avatarURL);
                return;
            }
            var msgArray = [];
            for (index in msg.mentions) {
                var user = msg.mentions[index];
                if(user.avatarURL === null) {
                    msgArray.push(user.username + " is naked. (has no profile pic.)");
                } else {
                    msgArray.push(user.username + "'s avatar is: " + user.avatarURL);
                }
            }
            bot.sendMessage(msg.channel, msgArray);
      }
    },
    "log": {
        usage: "<log message>",
        description: "logs message to bot console",
        process: function(bot,msg,suffix){console.log(msg.content);}
    },
    "wiki": {
        usage: "<search terms>",
        description: "returns the summary of the first matching search result from Wikipedia",
        process: function(bot,msg,suffix) {
            var query = suffix;
            if(!query) {
                bot.sendMessage(msg.channel,"usage: !wiki search terms");
                return;
            }
            var Wiki = require('wikijs');
            new Wiki().search(query,1).then(function(data) {
                new Wiki().page(data.results[0]).then(function(page) {
                    page.summary().then(function(summary) {
                        var sumText = summary.toString().split('\n');
                        var continuation = function() {
                            var paragraph = sumText.shift();
                            if(paragraph){
                                bot.sendMessage(msg.channel,paragraph,continuation);
                            }
                        };
                        continuation();
                    });
                });
            },function(err){
                bot.sendMessage(msg.channel,err);
            });
        }
    },
    "join-server": {
        usage: "<invite>",
        description: "joins the server it's invited to",
        process: function(bot,msg,suffix) {
            console.log(bot.joinServer(suffix,function(error,server) {
                console.log("callback: " + arguments);
                if(error){
                    bot.sendMessage(msg.channel,"failed to join: " + error);
                } else {
                    console.log("Joined server " + server);
                    bot.sendMessage(msg.channel,"Successfully joined " + server);
                }
            }));
        }
    },
    "create": {
        usage: "<text|voice> <channel name>",
        description: "creates a channel with the given type and name.",
        process: function(bot,msg,suffix) {
            var args = suffix.split(" ");
            var type = args.shift();
            if(type != "text" && type != "voice"){
                bot.sendMessage(msg.channel,"you must specify either voice or text!");
                return;
            }
            bot.createChannel(msg.channel.server,args.join(" "),type, function(error,channel) {
                if(error){
                    bot.sendMessage(msg.channel,"failed to create channel: " + error);
                } else {
                    bot.sendMessage(msg.channel,"created " + channel);
                }
            });
        }
    },
    "delete": {
        usage: "<channel name>",
        description: "deletes the specified channel",
        process: function(bot,msg,suffix) {
            var channel = bot.getChannel("name",suffix);
            bot.sendMessage(msg.channel.server.defaultChannel, "deleting channel " + suffix + " at " +msg.author + "'s request");
            if(msg.channel.server.defaultChannel != msg.channel){
                bot.sendMessage(msg.channel,"deleting " + channel);
            }
            bot.deleteChannel(channel,function(error,channel){
                if(error){
                    bot.sendMessage(msg.channel,"couldn't delete channel: " + error);
                } else {
                    console.log("deleted " + suffix + " at " + msg.author + "'s request");
                }
            });
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
                }  
            });
        }
    },
	"wolfram": {
		usage: "<search terms>",
        description: "gives results from wolframalpha using search terms",
        process: function(bot,msg,suffix){
			if(!suffix){
				bot.sendMessage(msg.channel,"Usage: !wolfram <search terms> (Ex. !wolfram integrate 4x)");
			}
            wolfram_plugin.respond(suffix,msg.channel,bot);
        }
	},
    "rss": {
        description: "lists available rss feeds",
        process: function(bot,msg,suffix) {
            /*var args = suffix.split(" ");
            var count = args.shift();
            var url = args.join(" ");
            rssfeed(bot,msg,url,count,full);*/
            bot.sendMessage(msg.channel,"Available feeds:", function(){
                for(var c in rssFeeds){
                    bot.sendMessage(msg.channel,c + ": " + rssFeeds[c].url);
                }
            });
        }
    },
     "urban": {
        process: function(bot, msg, suffix) {
            var query = suffix;
            if(!query) {
                bot.sendMessage(msg.channel, "Usage: !urban **search terms**");
                return;
            }
            var Urban = require('urban');
            Urban(suffix).first(function(json) {
                if (json !== undefined) {
                    var definition = "" + json.word + ": " + json.definition + "\n:arrow_up: " + json.thumbs_up + "   :arrow_down: " + json.thumbs_down + "\n\nExample: " + json.example;
                    bot.sendMessage(msg.channel,definition);
                }
                else
                { bot.sendMessage(msg.channel,"Odd. Urban Dictionary has no definition for: " + suffix);
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
        }
    }
};
try{
var rssFeeds = require("./rss.json");
function loadFeeds(){
    for(var cmd in rssFeeds){
        commands[cmd] = {
            usage: "[count]",
            description: rssFeeds[cmd].description,
            url: rssFeeds[cmd].url,
            process: function(bot,msg,suffix){
                var count = 1;
                if(suffix != null && suffix != "" && !isNaN(suffix)){
                    count = suffix;
                }
                rssfeed(bot,msg,this.url,count,false);
            }
        };
    }
}
} catch(e) {
    console.log("Couldn't load rss.json. See rss.json.example if you want rss feed commands. error: " + e);
}

function rssfeed(bot,msg,url,count,full){
    var FeedParser = require('feedparser');
    var feedparser = new FeedParser();
    var request = require('request');
    request(url).pipe(feedparser);
    feedparser.on('error', function(error){
        bot.sendMessage(msg.channel,"failed reading feed: " + error);
    });
    var shown = 0;
    feedparser.on('readable',function() {
        var stream = this;
        shown += 1
        if(shown > count){
            return;
        }
        var item = stream.read();
        bot.sendMessage(msg.channel,item.title + " - " + item.link, function() {
            if(full === true){
                var text = htmlToText.fromString(item.description,{
                    wordwrap:false,
                    ignoreHref:true
                });
                bot.sendMessage(msg.channel,text);
            }
        });
        stream.alreadyRead = true;
    });
}


var bot = new Discord.Client();

bot.on("ready", function () {
    console.log("Ready to begin! Serving in " + bot.channels.length + " channels");
  //Sets the game the bot will be shown as playing, change the number for a different game
  bot.setPlayingGame(119);
});

bot.on("disconnected", function () {
    console.log(currentTime() + "Disconnected. Trying to revive...");
    sleep(5000);
    bot.login(AuthDetails.email, AuthDetails.password);
});

bot.on("message", function (msg) {
  //check if message is a command
  if(msg.author.id != bot.user.id && (msg.content[0] === '!' || msg.content.indexOf(bot.user.mention()) == 0)){
        console.log("treating " + msg.content + " from " + msg.author + " as command");
    var cmdTxt = msg.content.split(" ")[0].substring(1);
        var suffix = msg.content.substring(cmdTxt.length+2);//add one for the ! and one for the space
        if(msg.content.indexOf(bot.user.mention()) == 0){
            cmdTxt = msg.content.split(" ")[1];
            suffix = msg.content.substring(bot.user.mention().length+cmdTxt.length+2);
        }
    var cmd = commands[cmdTxt];
        if(cmdTxt === "help"){
            //help is special since it iterates over the other commands
            for(var cmd in commands) {
                var info = "!" + cmd;
                var usage = commands[cmd].usage;
                if(usage){
                    info += " " + usage;
                }
                var description = commands[cmd].description;
                if(description){
                    info += "\n\t" + description;
                }
                bot.sendMessage(msg.channel,info);
            }
        }
    else if(cmd) {
            cmd.process(bot,msg,suffix);
    } else {
      console.log("An invaild command was entered. Ignoring...");
    }
  } else {
    //message isn't a command or is from us
        //drop our own messages to prevent feedback loops
        if(msg.author == bot.user){
            return;
        }
        
        if (msg.author != bot.user && msg.isMentioned(bot.user)) {
                bot.sendMessage(msg.channel,"Someone said something?");
        }
    }
});
 

//Log user status changes
bot.on("presence", function(data) {
	//if(status === "online"){
	//console.log("presence update");
	console.log(data.user+" is now "+data.status);
	//}
});

function get_gif(tags, func) {
        //limit=1 will only return 1 gif
        var params = {
            "api_key": config.api_key,
            "rating": config.rating,
            "format": "json",
            "limit": 1
        };
        var query = qs.stringify(params);

        if (tags !== null) {
            query += "&q=" + tags.join('+')
        }

        //wouldnt see request lib if defined at the top for some reason:\
        var request = require("request");
        //console.log(query)

        request(config.url + "?" + query, function (error, response, body) {
            //console.log(arguments)
            if (error || response.statusCode !== 200) {
                console.error("giphy: Got error: " + body);
                console.log(error);
                //console.log(response)
            }
            else {
                var responseObj = JSON.parse(body)
                console.log(responseObj.data[0])
                if(responseObj.data.length){
                    func(responseObj.data[0].id);
                } else {
                    func(undefined);
                }
            }
        }.bind(this));
    }

bot.login(AuthDetails.email, AuthDetails.password);