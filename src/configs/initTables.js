const pool = require("../services/db");
const SQLSTATEMENT = `

  DROP TABLE IF EXISTS User;

  DROP TABLE IF EXISTS UserAnswer;

  DROP TABLE IF EXISTS SurveyQuestion;

  DROP TABLE IF EXISTS Battles;

  DROP TABLE IF EXISTS Characters;

  DROP TABLE IF EXISTS Shop;

  DROP TABLE IF EXISTS BattleInstance;

  DROP TABLE IF EXISTS CharacterUserRel;

  DROP TABLE IF EXISTS Rarity;

  DROP TABLE IF EXISTS Spin;

  DROP TABLE IF EXISTS INVENTORY;

  DROP TABLE IF EXISTS Reviews;

  CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY, 
    username TEXT,
    points INT default 0,
    password TEXT NOT NULL
  );
  
  CREATE TABLE UserAnswer (
    answer_id INT AUTO_INCREMENT PRIMARY KEY,  
    answered_question_id INT NOT NULL,
    participant_id INT NOT NULL,
    answer BOOL NOT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    additional_notes TEXT
  );
  
  CREATE TABLE SurveyQuestion (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    creator_id INT NOT NULL,
    question TEXT NOT NULL
  );

  INSERT INTO SurveyQuestion (question_id, creator_id, question) VALUES
  (1, 1, 'Do you buy fruits from FC6?'),
  (2, 1, 'Is the fried chicken at FC5 salty?'),
  (3, 2, 'Did you recycled any e-waste?'),
  (4, 2, 'Do you turn off lights and appliances when not in use?'),
  (5, 2, 'Have you visit the cafe at Moberly?');


  INSERT INTO User (username, points, password) VALUES
  ("Alice", 100, "$2b$10$lnGQv5e8gLTS8CEZjYpnaeC/dbM6J4tvmEkRJaMtrx8HdKlWAirqq"),
  ("Bob", 200, "$2b$10$lnGQv5e8gLTS8CEZjYpnaeC/dbM6J4tvmEkRJaMtrx8HdKlWAirqq"),
  ("Charlie", 300, "$2b$10$lnGQv5e8gLTS8CEZjYpnaeC/dbM6J4tvmEkRJaMtrx8HdKlWAirqq"),
  ("Dave", 400, "$2b$10$lnGQv5e8gLTS8CEZjYpnaeC/dbM6J4tvmEkRJaMtrx8HdKlWAirqq"),
  ("Kosen", 50000, "$2b$10$lnGQv5e8gLTS8CEZjYpnaeC/dbM6J4tvmEkRJaMtrx8HdKlWAirqq");

 INSERT INTO UserAnswer (answered_question_id, participant_id, answer, creation_date, additional_notes) VALUES
  (1, 1, true, "2024-12-05", "I hate it"),
  (2, 1, true, "2024-12-05", "I despise it");



  CREATE TABLE Battles (
    battle_id INT AUTO_INCREMENT PRIMARY KEY,
    battle_name TEXT,
    battle_cost INT NOT NULL,
    battle_reward INT NOT NULL,
    battle_xp INT NOT NULL,
    battle_body TEXT NOT NULL,
    battle_monster_hp INT NOT NULL,
    battle_monster_default_hp INT,
    battle_steps TEXT NOT NULL
  );

  INSERT INTO Battles (battle_id, battle_name, battle_cost, battle_reward, battle_xp, battle_body, battle_monster_hp, battle_steps) VALUES
  (1, "Dragino", 10, 30, 900 , "Dragino a hybrid of a dinosaur and a dragon menacingly saunters his way to you!", 500, "A dragon whose fiery breath incinerates everything"),
  (2, "FrostWing", 20, 40, 125,  "Frostwing, the Eternal Chill, looms before you, his icy scales and piercing blue eyes exuding a cold, unyielding menace.", 600, "An ice dragon that freezes souls and turns warriors to ice."),
  (3, "Abyssflame", 30, 40, 150,  "Drakathor, the Infernal Wrath, towers before you, his abyssal scales and malevolent eyes promising doom.", 700, "A dark dragon whose dark blaze burns everything it touches."),
  (4, "Blazefury Dragon", 30, 50, 175,  "The Blazefury Dragon, wreathed in scorching flames, blocks your way, its presence a harbinger of fiery destruction.", 800 , "A beast wreathed in flames, scorching all who challenge it."),
  (5, "The Bloodthirsty Vampire", 30, 70, 200,  "A Bloodthirsty Vampire emerges from the shadows, its fangs dripping with fresh blood.", 900, "A vampire that drains the life from its victims."),
  (6, "The Ravenous Werewolf", 30, 70, 1000, "A Ravenous Werewolf, eyes gleaming with hunger, prowls towards you under the pale moonlight.", 1200, "A savage beast hunting with bloodthirsty ferocity.");

     UPDATE Battles SET 
  battle_monster_default_hp = battle_monster_hp;


  CREATE TABLE Characters (
    character_id  INT AUTO_INCREMENT PRIMARY KEY,
    character_name TEXT NOT NULL,
    character_level INT default 0,
    character_xp INT default 0,
    character_silver INT ,
    character_gold INT default 0,
    character_battle_id INT,
    character_battles_won INT default 0
  
  );


  
  INSERT INTO Characters (character_name, character_level, character_xp, character_silver, character_gold, character_battle_id) VALUES
  ("Ryan the Great", 1, 100, 500, 50, 1),
  ("Jake the Baker", 2, 100, 500, 600, 1),
  ("Adam the Fighter", 3, 100, 500, 600, 1),
  ("Justin the Mage", 4, 100, 500, 600,  1),
  ("Kosen The Warrior", 1, 100, 500000, 50000000, 6)
  ;



  CREATE TABLE Shop (
  item_id INT AUTO_INCREMENT PRIMARY KEY,
  item_owner_id INT,   
  item_name TEXT NOT NULL,
  item_description TEXT NOT NULL,
  item_cost INT NOT NULL,
  item_damage INT,
  item_type TEXT NOT NULL,
  item_rarity TEXT NOT NULL,
  spin_cost INT DEFAULT 50
  );

INSERT INTO Shop (item_name, item_description, item_cost, item_damage, item_type, item_rarity) VALUES
("Wooden Sword", "A Wooden Sword For A Brave New Warrior", 0, 20, "weapon", "Common"),
("Frostbite Sword", "Chill your enemies to the bone with every slash", 20, 50, "weapon", "Common"),
("Inferno Sword", "Engulf your foes in blazing flames with each strike", 40, 80, "weapon", "Uncommon"),
("Emerald Blade", "Harness the verdant essence of nature with the Emerald Blade", 80, 160, "weapon", "Rare"),
("Bow of Thunder", "Shoots electrifying arrows", 40, 90, "weapon", "Uncommon"),
("Wand of Flames", "Casts fiery spells", 40, 85, "weapon", "Uncommon"),
("Dagger of Speed", "Strikes quickly and silently", 20, 70, "weapon", "Common"),
("Axe of Fury", "Delivers powerful and furious blows", 120, 180, "weapon", "Epic"),
("Staff of Wisdom", "Unleash the ancient knowledge and power with the Staff of Wisdom", 160, 300, "weapon", "Legendary"),

("Helmet of Insight", "Enhances perception and awareness", 200, 20, "others", "Uncommon"),
("Ring of Protection", "Grants a protective barrier", 350, 0, "others", "Rare"),
("Cloak of Invisibility", "Renders the wearer invisible for a short time", 1000, 0, "others", "Legendary");





  CREATE Table CharacterUserRel (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      character_id INT NOT NULL
  );
  
  INSERT INTO CharacterUserRel (user_id, character_id)
  VALUES 
  (1, 1), 
  (2, 2),
  (3, 3),
  (4, 4),
  (5, 5);
    
  

  Create Table Rarity (
  id INT PRIMARY KEY AUTO_INCREMENT,
  rarity TEXT NOT NULL,
  rarity_chance INT NOT NULL,
  rarity_rank INT NOT NULL
  );

  INSERT INTO Rarity (rarity, rarity_chance, rarity_rank) VALUES 
  ("Common", 40, 1),
  ("Uncommon", 30, 2),
  ("Rare", 15, 3),
  ("Epic", 10, 4),
  ("Legendary", 5, 5);




Create Table Inventory (
id INT PRIMARY KEY AUTO_INCREMENT,
owner_id INT NOT NULL,
item_id INT NOT NULL
);

INSERT INTO Inventory (owner_id, item_id) 
VALUES (5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (4, 1); 

CREATE TABLE Reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  review_amt INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  review_text TEXT
);

INSERT INTO Reviews (review_amt, user_id, review_text) VALUES
  (5, 1, "Good"),
  (4, 2, "Bad"),  
  (3, 3, "Decent");
`

pool.query(SQLSTATEMENT, (error, results, fields) => {
  if (error) {
    console.error("Error creating tables:", error);
  } else {
    console.log("Tables created successfully");
  }
  process.exit();
});

