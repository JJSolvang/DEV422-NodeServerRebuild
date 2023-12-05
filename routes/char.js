var express = require('express');
var charRouter = express.Router();

const { readWritePrimary } = require("../keys/keys.js");
const { MongoClient } = require("mongodb");
const client = new MongoClient(readWritePrimary);
client.connect(); // Has to connect before selecting db
const db = client.db("dnddb");
const chars = db.collection('characters');
const ObjectId = require('mongodb').ObjectId;

charRouter.get('/', async (req, res) => {
  res.send('Char route reached');
});

var nameArray = ["Billy", "Clark", "Bruce", "Diane", "Barry"];

var casterObject = {
  cantripsKnown: [
    ['acid-splash', 'Acid Splash'],
    ['dancing-lights', 'Dancing Lights'],
    ['mage-hand', 'Mage Hand']
  ],
  knowsCantrips: true,
  learnsSpells: true,
  prepareSpells: true,
  spellCastingAbility: 'int',
  spellsKnown: [
    ['burning-hands', 'Burning Hands'],
    ['mage-armor', 'Mage Armor']
  ]
};

var barbarian = {
  classIndex: 'barbarian',
  classLevel: 1,
  chosenProficiencyIndex: ['skill-intimidation', 'skill-animal-handling'],
  uniqueClassChoices: null,
  spellcaster: false,
  spellcasterInfo: null,
  subclassSelected: false,
  subclassInfo: null
}
var fighter = {
  classIndex: 'fighter',
  classLevel: 1,
  chosenProficiencyIndex: ['skill-acrobatics', 'skill-insight'],
  uniqueClassChoices: null,
  spellcaster: false,
  spellcasterInfo: null,
  subclassSelected: false,
  subclassInfo: null
}
var ranger = {
  classIndex: 'ranger',
  classLevel: 1,
  chosenProficiencyIndex: ['skill-athletics', 'skill-perception'],
  uniqueClassChoices: null,
  spellcaster: false,
  spellcasterInfo: null,
  subclassSelected: false,
  subclassInfo: null
}
var rogue = {
  classIndex: 'rogue',
  classLevel: 1,
  chosenProficiencyIndex: ['skill-survival', 'skill-stealth'],
  uniqueClassChoices: null,
  spellcaster: false,
  spellcasterInfo: null,
  subclassSelected: false,
  subclassInfo: null
}
var wizard = {
  classIndex: 'wizard',
  classLevel: 1,
  isSpellcaster: true,
  spellcasterInfo: casterObject,
  subclassSelected: false,
  subclassInfo: null
}
var classArray = [
  barbarian, fighter, ranger, rogue, wizard
];
var alignmentArray = [
  'lawful-good', 'neutral-good', 'chaotic-good',
  'lawful-neutral', 'true-neutral', 'chaotic-neutral',
  'lawful-evil', 'neutral-evil', 'chaotic-evil',
];
var raceArray = [
  'dragonborn', 'dwarf', 'elf', 'gnome', 'human', 'half-elf', 'halfling',
  'half-orc', 'human', 'tiefling'
]
var randHP = Math.floor(Math.random() * 100);

charRouter.post('/testFill', async (req, res) => {
  try {
    var charArray = [];
    for (let i = 0; i < 2; i++) {
      var char = {
        _id: new ObjectId(),

        userId: req.body.userId,
        active: true,
        favorite: false,
        startingEquipmentSelected: true,

        name: nameArray[Math.floor(Math.random() * 5)],
        overallLevel: Math.floor(Math.random() * 19) + 1,
        race: {
          raceIndex: raceArray[Math.floor(Math.random() * raceArray.length)],
          chosenLanguageIndex: [],
          chosenProficiencyIndex: []
        },
        classes: [classArray[Math.floor(Math.random() * classArray.length)]],
        abilityScores: [15, 13, 14, 8, 12, 10],
        hp: {
          maxHP: randHP,
          currentHP: randHP - Math.floor(Math.random() * randHP),
          tempHP: 0
        },
        equippedItemsIndexes: ['club'],
        inventoryItemsIndexes: ['handaxe'],

        personality: {
          alignmentIndex: alignmentArray[Math.floor(Math.random() * 9)],
          personalityTraits: ['personalityTrait'],
          ideals: ['ideal'],
          bonds: ['bond'],
          flaws: ['flaw']
        },

        appearance: {
          age: 45,
          height: 'tall',
          weight: 'weight',
          eyes: 'eyes',
          skin: 'skin',
          hair: 'hair',
          otherNotes: 'other appearance note'
        },
        
        backstory: 'likes to hit things',

        charactersShard: 2
      }
      charArray.push(char);
    }
    await chars.insertMany(charArray);
    res.send({ message: "true" });
  }
  catch (err) {
    res.send({message: err});
  }
});

charRouter.post('/deactivate', async (req, res) => {
  try {
    var result = await chars.findOne({_id: req.body._id});
    if (result != null) {
      chars.updateOne(
        {_id: req.body._id},
        {$set: {active: false}}
      );
      res.send({message: "true"});
    }
    else {
      res.send({message: "false"});
    }
  }
  catch (err) {
    res.send({message: err});
  }
});

charRouter.get('/all?', async (req, res) => {
  try {
    var result = await chars.find({userId: req.query.userId}).toArray();
    if (result.length > 0) {
      res.send({message: "true", result});
    }
    else {
      res.send({message: "false"});
    }
  }
  catch (err) {
    res.send({message: err});
  }
});

charRouter.post('/testWizard', async (req, res) => {
  try {
    var charArray = [];
    for (let i = 0; i < 2; i++) {
      var char = {
        _id: new ObjectId(),

        userId: req.body.userId,
        active: true,
        favorite: false,
        startingEquipmentSelected: true,

        name: nameArray[Math.floor(Math.random() * 5)],
        overallLevel: Math.floor(Math.random() * 19) + 1,
        race: {
          raceIndex: raceArray[Math.floor(Math.random() * raceArray.length)],
          chosenLanguageIndex: [],
          chosenProficiencyIndex: []
        },
        classes: [classArray[4]],
        abilityScores: [15, 13, 14, 8, 12, 10],
        hp: {
          maxHP: randHP,
          currentHP: randHP - Math.floor(Math.random() * randHP),
          tempHP: 0
        },
        equippedItemsIndexes: ['club'],
        inventoryItemsIndexes: ['handaxe'],

        personality: {
          alignmentIndex: alignmentArray[Math.floor(Math.random() * 9)],
          personalityTraits: ['personalityTrait'],
          ideals: ['ideal'],
          bonds: ['bond'],
          flaws: ['flaw']
        },

        appearance: {
          age: 45,
          height: 'tall',
          weight: 'weight',
          eyes: 'eyes',
          skin: 'skin',
          hair: 'hair',
          otherNotes: 'other appearance note'
        },
        
        backstory: 'likes to hit things',

        charactersShard: 2
      }
      charArray.push(char);
    }
    await chars.insertMany(charArray);
    res.send({ message: "true" });
  }
  catch (err) {
    res.send({message: err});
  }
});

charRouter.post('/deactivate', async (req, res) => {
  try {
    var result = await chars.findOne({_id: req.body._id});
    if (result != null) {
      chars.updateOne(
        {_id: req.body._id},
        {$set: {active: false}}
      );
      res.send({message: "true"});
    }
    else {
      res.send({message: "false"});
    }
  }
  catch (err) {
    res.send({message: err});
  }
});

charRouter.get('/all?', async (req, res) => {
  try {
    var result = await chars.find({userId: req.query.userId}).toArray();
    if (result.length > 0) {
      res.send({message: "true", result});
    }
    else {
      res.send({message: "false"});
    }
  }
  catch (err) {
    res.send({message: err});
  }
});

charRouter.get('/active?', async (req, res) => {
  try {
    var result = await chars.find({
      $and: [
        {userId: req.query.userId},
        {active: true}
      ]}).toArray();
    if (result.length > 0) {
      res.send({message: "true", result});
    }
    else {
      res.send({message: "false"});
    }
  }
  catch (err) {
    res.send({message: err});
  }
});

charRouter.get('/one?', async (req, res) =>  {
  try {
    var convertedId = new ObjectId(req.query._id);
    var result = await chars.findOne({_id: convertedId});
    if (result != null) {
      res.send({message: "true", result});
    }
    else {
      res.send({message: "false"});
    }
  }
  catch (err) {
    res.send({message: err});
  }
});

charRouter.post('/favorite', async (req, res) =>  {
  try {
    var convertedId = new ObjectId(req.body._id);
    var result = await chars.findOne({_id: convertedId});
    if (result != null) {
      chars.updateOne( {_id: convertedId}, {$set: {favorite: true} } );
      res.send({message: "true"});
    }
    else {
      res.send({message: "false"});
    }
  }
  catch (err) {
    res.send({message: err});
  }
});

charRouter.post('/unfavorite', async (req, res) =>  {
  try {
    var convertedId = new ObjectId(req.body._id);
    var result = await chars.findOne({_id: convertedId});
    if (result != null) {
      chars.updateOne( {_id: convertedId}, {$set: {favorite: false} } );
      res.send({message: "true"});
    }
    else {
      res.send({message: "false"});
    }
  }
  catch (err) {
    res.send({message: err});
  }
});

charRouter.post('/whole', async (req, res) => {
  try {
    var id = new ObjectId();
    var char = req.body.char;
    char._id = id;
    char.charactersShard = 1;
    chars.insertOne(char);
    res.send({message: id});
  }
  catch (err) {
    res.send({message: err});
  }
});

charRouter.post('/wupdate', async (req, res) => {
  try {
    var char = req.body.char;
    var convertedId = new ObjectId(char._id);
    var result = await chars.findOne({_id: convertedId});
    if (result != null) {
      chars.deleteOne({_id: convertedId});

      char._id = new ObjectId();
      char.charactersShard = 1;
      chars.insertOne(char);
      res.send({message : "true", _id : char._id});
    }
  }
  catch (err) {
    res.send({message: err});
  }
});

charRouter.delete('/one?', async (req, res) =>  {
  try {
    var convertedId = new ObjectId(req.query._id);
    var result = await chars.findOne({_id: convertedId});
    if (result != null) {
      chars.deleteOne({_id: convertedId});
      res.send({message: "true"});
    }
    else {
      res.send({message: "false"});
    }
  }
  catch (err) {
    res.send({message: err});
  }
});

module.exports = charRouter;