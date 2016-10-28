/**
 * Created by Will on 10/4/2016.
 */

const shuffle = require('knuth-shuffle').knuthShuffle;

function Insult(client, msg, args)  {
    const regex = /<@!?[0-9]+>/;
    const ins = shuffle(insults)[0];

    if(args[0] && args[0].match(regex))    {
        return Promise.resolve(args[0] + ", " + ins);
    }   else {
        return Promise.resolve(msg.author.toString() + ", " + ins);
    }
}

module.exports = Insult;

const insults = [
    'Is your ass jealous of the amount of shit that just came out of your mouth?',
    'I\'m not saying I hate you, but I would unplug your life support to charge my phone.',
    'Roses are red, violets are blue, I have 5 fingers, the 3rd ones for you.',
    'I wasn\'t born with enough middle fingers to let you know how I feel about you.',
    'I bet your brain feels as good as new, seeing that you never use it.',
    'Your birth certificate is an apology letter from the condom factory.',
    'You\'re so ugly, when your mom dropped you off at school she got a fine for littering.',
    'You must have been born on a highway because that\'s where most accidents happen.',
    'If you are going to be two faced, at least make one of them pretty.',
    'What’s the difference between you and eggs? Eggs get laid and you don\'t.',
    'I’m jealous of all the people that haven\'t met you!',
    'If laughter is the best medicine, your face must be curing the world.',
    'I\'d like to see things from your point of view but I can\'t seem to get my head that far up my ass.',
    'You bring everyone a lot of joy, when you leave the room.',
    'I could eat a bowl of alphabet soup and shit out a smarter statement than that.',
    'You\'re the reason they invented double doors!',
    'If I wanted to kill myself I\'d climb your ego and jump to your IQ.',
    'Two wrongs don\'t make a right, take your parents as an example.',
    'There\'s only one problem with your face, I can see it.',
    'You shouldn\'t play hide and seek, no one would look for you.',
    'Your family tree must be a cactus because everybody on it is a prick.',
    'If you\'re gonna be a smartass, first you have to be smart. Otherwise you\'re just an ass.',
    'You\'re so ugly, when you popped out the doctor said "Aww what a treasure" and your mom said "Yeah, lets bury it."',
    'I don\'t exactly hate you, but if you were on fire and I had water, I\'d drink it.',
    'It\'s better to let someone think you are an Idiot than to open your mouth and prove it.',
    'Somewhere out there is a tree, tirelessly producing oxygen so you can breathe. I think you owe it an apology.',
    'Maybe if you ate some of that makeup you could be pretty on the inside.',
    'Shut up, you\'ll never be the man your mother is.',
    'The only way you\'ll ever get laid is if you crawl up a chicken\'s ass and wait.',
    'At least when I do a handstand my stomach doesn\'t hit me in the face.',
    'Roses are red violets are blue, God made me pretty, what happened to you?',
    'You\'re so ugly you scare the shit back into people.',
    'If you really want to know about mistakes, you should ask your parents.',
    'Hey, you have somthing on your chin... no, the 3rd one down',
    'I have neither the time nor the crayons to explain this to you.',
    'What are you going to do for a face when the baboon wants his butt back?',
    'If I gave you a penny for your thoughts, I\'d get change.',
    'I\'d slap you, but shit stains.',
    'How many times do I have to flush to get rid of you?',
    'You have two brains cells, one is lost and the other is out looking for it.',
    'You\'re so fat the only letters of the alphabet you know are KFC.',
    'You\'re the reason the gene pool needs a lifeguard.',
    'I may love to shop but I\'m not buying your bullshit.',
    'Why don\'t you slip into something more comfortable -- like a coma.',
    'If I were to slap you, it would be considered animal abuse!',
    'Oh my God, look at you. Was anyone else hurt in the accident?',
    'Well I could agree with you, but then we\'d both be wrong.',
    'You\'re not funny, but your life, now that\'s a joke.',
    'It looks like your face caught on fire and someone tried to put it out with a hammer.',
    'The last time I saw a face like yours I fed it a banana.',
    'Don\'t feel sad, don\'t feel blue, Frankenstein was ugly too.',
    'Do you know how long it takes for your mother to take a crap? Nine months.',
    'What are you doing here? Did someone leave your cage open?',
    'Do you still love nature, despite what it did to you?',
    'You\'re so fat, you could sell shade.',
    'I\'ll never forget the first time we met, although I\'ll keep trying.',
    'I\'d like to kick you in the teeth, but that would be an improvement!',
    'You\'re so ugly, when you got robbed, the robbers made you wear their masks.',
    'You are proof that God has a sense of humor.',
    'Why don\'t you check eBay and see if they have a life for sale.',
    'If you spoke your mind, you\'d be speechless.',
    'You\'re so ugly, the only dates you get are on a calendar',
    'Is it too late to get you aborted?',
    'You\'re so fat you need cheat codes to play Wii Fit',
    'You\'re as useless as a knitted condom.',
    'There are more calories in your stomach than in the local supermarket!',
    'You didn\'t fall out of the stupid tree. You were dragged through dumbass forest.',
    'You look like something I\'d draw with my left hand.',
    'So you\'ve changed your mind, does this one work any better?',
    'If I wanted to hear from an asshole, I\'d fart.',
    'You\'re so ugly, you scared the crap out of the toilet.',
    'You\'re as bright as a black hole, and twice as dense.',
    'You\'re so ugly, when you threw a boomerang it didn\'t come back.',
    'If your brain was made of chocolate, it wouldn\'t fill an M&M.',
    'Shock me, say something intelligent.',
    'I can explain it to you, but I can\'t understand it for you.',
    'It\'s kinda sad watching you attempt to fit your entire vocabulary into a sentence.',
    'I fart to make you smell better.',
    'You are proof that evolution CAN go in reverse.',
    'You do realize makeup isn\'t going to fix your stupidity?',
    'Looks like you traded in your neck for an extra chin!',
    'You\'re so ugly you make blind kids cry.',
    'You\'re a person of rare intelligence. It\'s rare when you show any.',
    'I love what you\'ve done with your hair. How do you get it to come out of the nostrils like that?',
    'You\'re so fat, when you wear a yellow rain coat people scream "taxi".',
    'I heard your parents took you to a dog show and you won.',
    'You\'re the best at all you do - and all you do is make people hate you.',
    'Some drink from the fountain of knowledge; you only gargled.',
    'Your parents hated you so much your bath toys were an iron and a toaster',
    'Learn from your parents\' mistakes - use birth control!',
    'Your face makes onions cry.'
];