# Cyber Wellness Kingdom (Digital Welness Quiz/Game)
# Website Name: Cyber Wellness Kingdom
## Summary
Cyber Wellness Kingdom is a medieval themed, gamified platform designed to educate users of all ages from children to the elderly on staying safe online and practicing good digital habits. It also raises awareness of Singapore’s digital initiatives, including agencies under MDDI and the Defence Tech sector, helping the public understand current digital transformations.

In the game, users earn points by completing cyber wellness surveys. These points allow them to create characters in Battle Berzerk, where they fight monsters to gain rewards and XP. Earned gold can be used to purchase weapons of varying rarities or try their luck at a lucky spin for Legendary items. Players can manage their inventory, customize weapons, and level up their characters to become masters, ultimately striving to reach the top of the leaderboard.

## Play Now
Play the game here: [Cyber Wellness Kingdom](https://cyber-wellness-kingdom-kosen.up.railway.app/index.html)



## Packages Installed
- Express
- mysql2
- Nodemon
- dotenv
- jsonwebtoken
- bcrypt


## Installation
To install the dependencies listed above for my project:
  - npm install 


## Scripts
  - npm run dev (Start the backend server, initialize tables and serve the "public" files to frontend)
  - node index.js (Start the backend server, serve the "public" files to frontend)


## Dependencies
## Backend
**Frameworks**: Express, Node.js
**Libraries**: jwt, bcrypt
**Scripts**: npm run dev for development, node index.js to start the application

## Frontend
**JavaScript API**: Fetch
**Frontend Framework**: Bootstrap

# How to run my application

## Setup the .dotenv files (if needed)

Below is my .dotenv file. Your password maybe different for your Database and you may want to modify the JWT configurations:
DB_HOST='localhost'
DB_USER='root'
DB_PASSWORD='BED-SQL'
DB_DATABASE='CA1Test'

JWT_SECRET_KEY=BED-LAB-6
JWT_EXPIRES_IN=60m
JWT_ALGORITHM=HS256

## Running the application
Ensure you have installed all the required packages listed in "Packages Installed"
1. In the terminal ensure your in the root folder
2. Enter node index.js or npm run dev (This will start the backend server and load up the frontend)
3. Go to "http://localhost:3000" on Chrome browser
4. Read the README or my demonstration video to user my Survey Medieval website or follow the guide provided



# Folder Structure (not including node_modules)   
|-  public                (Start Of Frontend)
|   |-- css
|   |     |-- battles.css
|   |     |-- characters.css
|   |     |-- guide.css
|   |     |-- inventoryBattle.css
|   |     |-- leaderboard.css
|   |     |-- reviews.css
|   |     |-- shop.css
|   |     |-- singleBattleInstance.css
|   |     |-- singleuser.css
|   |     |-- spin.css
|   |     |-- style.css
|   |-- images
|   |-- js
|   |     |-- characterLeaderboard.js
|   |     |-- getCurrentUrl.js
|   |     |-- getSingleUserInfo.js
|   |     |-- getUserProfile.js
|   |     |-- guide.js
|   |     |-- hideNavbarForUnauth.js
|   |     |-- inventory.js
|   |     |-- inventoryBattle.js
|   |     |-- leaderboard.js
|   |     |-- login.js
|   |     |-- navigateToBattleInstance.js
|   |     |-- postQuestion.js
|   |     |-- queryCmds.js
|   |     |-- register.js
|   |     |-- reviews.js
|   |     |-- selectCharacterForBattle.js
|   |     |-- shop.js
|   |     |-- showAllBattles.js
|   |     |-- showAllCharacters.js
|   |     |-- showAllSurvey.js
|   |     |-- showAllUser.js
|   |     |-- singleBattleInstance.js
|   |     |-- spin.js
|   |     |-- submitAnswer.js
|   |     |-- updateCharacter.js
|   |     |-- updateUser.js
|   |     |-- userNavbarToggle.js
|   |-- battles.html
|   |-- characters.html
|   |-- index.html
|   |-- inventory.html
|   |-- inventoryBattle.html
|   |-- login.html
|   |-- profile.html
|   |-- register.html
|   |-- reviews.html
|   |-- shop.html
|   |-- singleBattleInstance.html
|   |-- singleUserInfo.html
|   |-- updateCharacter.html
|   |-- users.html                      (End Of Frontend)
|-- src                                (Start of Backend)
|   |-- configs
|   |   |-- initTables.js
|   |-- controllers
|   |   |-- userController.js
|   |   |-- questionController.js
|   |   |-- characterController.js
|   |   |-- battleController.js
|   |   |-- shopController.js
|   |-- models
|   |   |-- userModel.js
|   |   |-- questionModel.js
|   |   |-- characterModel.js
|   |   |-- battleModel.js
|   |   |-- shopModel.js
|   |-- routes
|   |   |-- mainRoutes.js
|   |   |-- userRoutes.js
|   |   |-- questionRoutes.js
|   |   |-- characterRoutes.js
|   |   |-- battleRoutes.js
|   |   |-- shopRoutes.js
|   |-- services
|   |   |-- db.js
|   |-- app.js
|-- .env
|-- .gitignore
|-- index.js
|-- package.json
|-- package-lock.json
|-- README.md                        (End of Backend)

(view "Folder Structure on VSCcode's README)

--------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Explanation of each file in the frontend
register.html -> This file serves as the register user page. Here the will enter their username and password. Once they register a token will be generated for them and their passwords will be hashed using bcrypt by using the middleware "bcryptMiddleware.hashPassword" with 10 salt rounds.

login.html->  This file serves as the login user page. Here the user will login using their username and password. Once they login a token will be generated and sent to them (can be viewed using devtools).Once the user's token expires when they press anything will redirect to login page to renew token.


index.html -> This file serves as the home page for the main part of the assignment - Survey Questions. It shows a table of survey questions and relevant information like Creator name and Actions. The Actions are only available for authenticated users. So for users not logged in they will see the table with question and creator name but NO Action buttons. A logged in user however can see "Answer' and "ViewAnswers" on every question and if its a question that they created or have just poster (a post question button at the bottom), they can se "Delete and Update" . So cater for logged in and not logged in users which is part of the assignmenet requirements -> Authentication Flow. Below the surveyTable is the Guide and Testimonials section where both unlogged in users and loggedin users can read to see how to play the game at any time. Also, the testimonials serve as a promotion for the game and attraction for non registered users to be interested in my Survey-Game website and register. The testimonials will get 3 random 5 star reviews from the database upon refresh making it new everytime and giving it more flavour and promotion for our website to attract non-registered users to register. For logged in users, the main function of this page is to answer questions to earn points so they can play the game in the other html pages.

reviews.html -> This file serves as the Reviews page for users to rate the website from 1 -5 stars. Apart from the basic functions of viewing reviwes, submitting a review, updating a review or deleting a review, I added an additional/advanced functionaility which is "review_text" which is a text box for user to express their reviews in words to express their reviews better and give feedback for me to improve the website and functions. However, it is optional to fill in the review text box so I made it so if they don't fill the text box up I will still let it go through as the assignment required that rating of 1-5 should be submitted so I made it optional. I also get that users may not want to leave a review or may not be as expressive so that's why I made it optional. The review ratings is in star format so they can select how many stars out of five to give the website. When they hover over the stars it lights up depending on what position they are. The above is mostly for logged in users but non registered users also have access to this page but there is no submit review part of the page and only the table with the reviews are shown for them. I did this because I believe that showing the reviews to non-registerd user provides authentic experience where they can read reviews of the website to be encouraged to register an account.


(only viewable by logged/registered users)

users.html/singleuserInfo.html -> This file serves as the user page where all registered users are present. In games, usually it is a common component to be able to view other users and their progress and characters etc. This page serves that purpose, to make users feel they are not alone and can compete and feel like they have allies to fight battles with. In the Users part they can see basic user detail cards like points then if they choose to view details they will be brought to "singleUserInfo.html" page where they can see the user's characters and their progress. Then the second part of the users.html is the Users Leaderboard where all users and their ranks and points are displayed, this increases the competition aspcet of my survey game and make the users more motivated to complete questions and earn points. Seen as the main part of the assignment (both CA1 and CA2) is to get users to complete surveys and have fun and have interactive survey activity etc, the user leaderboard can make users more passionate and encouraged to keep completing questions, posting questions etc to earn points which they can then rank up and climb the ranks!

characters.html -> This file serve as the hub for the logged in user to view all their own characters. They can perform many actions to thier characters like the basic update name (updateCharacter.html), Delete and my core and fun game functionailies like "Select for Battle", "Visit Shop" and "View Inventory" which are all in different pages that will be explained below. If their are a newly registerd user, they can create a character in the text box at the start of the page and then at that point all their points will be converted to silver for them to play battles. At the bottom of the page there is a character Leaderboard ranked by level which drives competition between characters to play more battles and compete and be the King Of The Leaderboard!!!

(Pages that are accessed in characters.html)

First Button on each character card: 
battles.html -> This file serves as the battles page. All the battles in the database will be displayed in bright and appealling monster cards with their respective cost reward and information (silver cost, gold reward, HP). Once the user chooses which battle he wants his character to fight the specified silver will be deducted from his character. He will then be brought to "singleBattleInstance.html"

(battle.html link to singleBattleInstance )
singleBattleInstance.html -> This file serves as the specific battle instance page for the character to fight the monster. The monster name is at the top followed by the monser image and healthbar at the bottom. Then the view inventorty button is there for the character to choose a weapon, when they click "View Inventory" they are brought to "InventoryBattle.html". Once they select their weapon, they will be brought back to "singleBattleInstance.html" where their weapon will be displayed under "Character's Selected Weapon". Then from here, they will have to CLICK the monster image to deal damage to the monster. Everytime the character clicks the monster image with his weapon, a message will popup up saying how much damage he inflicted (damage inflicted = weapon damage) and the health bar (a long green line) will go down slowly and is responsive to how much health the monster has. Once the monster health hits 0, the health bar is blank and the congratualations message is displayed for the user which shows their earned gold and xp!


Second Button On each character card:
shop.html -> This file serves as the shop page for characters to spend the gold they earn from defeating battles. A customized welcome message is in a rounded rectangle container at the top which shows their gold and other informationlike rarity systems and promotes the spin function at the bottom of the page. The body of the page is all the items available for purchase in the shop and all the information like damage, cost , rarity and description. The cards have a rarity system so Lengendary items are gold, Epic are Purple and etc. If the characters try buying an item that they do not have enough gold for, they will get a error message saying example: "You do not have enough gold to purchase Frostbite Sword". At the bottom of the page, there is a Lucky Spin button which represents the Lucky spin aspect. So when the press the spin button and they have enough gold, they will get a random item from the shop of random rarity which they can view in their inventory. If they don't have enough gold for the spin a error message "Forbidden: You do not have enough gold to spin for a item" will be shown

Once the characters buy their items they can view it in their inventory which is the last button on each character card

Third Button On each character card:
inventory.html -> This file shows the inventory of the characters. The head of the website is a rounded rectangle container with a customized message telling them they can view their inventory to check, delete or filter their items. It also explains to them sort and filter options they can apply to their list of weapons. Lastly, the message tells them they can sell or delete their items as they wish. At the very bottom of the page, their are 3 dropdowns "Sort By" , "Filter By Rarity" and "Filter By Type". They can sort by ascending/decending rarity/damage and the weapons list will be arranged as specified. Then they can filter by rarity or type which will then filter their weapons list to show what rarity or type they want. This gives the characters a interactive, fun and engaging way to view their weapon collection and be proud and heappy of the Legendary, Epic items that they own.


profile.html -> This file serves as a page for users to view their entire progress as a registered and loginned user. They can see their username, points and ALL the information about ALL their characters on a table. This page is a one page show all page for the users to see what they have done throughout this website as a user for surveys and as a character for the Medieval Game.
------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Note:
I made an Advanced Endpoint to get guide, in the guide theres a testimonial where in the backend I limit the amount of testimonials to be fetched from the database to 3 AND I set the condition that the rating or star must be 5 as we want to dispaly the best feedback of our website to show the users. This shows I did well for backend server and Frontend and backend response

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
# Image credits
Images for my website all belong to the respective owners listed below and are used only for module purposes. Credit to the images belong to the source website and creator. 

For All character images:
https://www.freepik.com/premium-ai-image/fantasy-medieval-character-roleplay-larp-figure-heros-fantasy-world-dungeon_57958056.htm

For Shop and Inventory Images:

For Monster Images:
beast1: https://pngtree.com/freepng/fantastic-dragon-monster-creature-medieval-legendary-winged-dragon_15094845.html
beast2: https://www.freepik.com/premium-ai-image/white-dragon-with-red-nose-red-nose_46614110.htm 
beast3: https://www.craiyon.com/image/-Dcs6NsLR9OqpJ8wDIMRwQ
beast4: https://www.artstation.com/artwork/lRN05k?album_id=28490
beast5: https://playground.com/search?q=Vampire+woman+anatomy 
beast6: https://www.craiyon.com/image/g94rAPFtTI2MVEuLGETzOw 

Background etc
Main website background: https://wall.alphacoders.com/big.php?i=425746 

profileImage: https://www.vectorstock.com/royalty-free-vector/a-knight-cartoon-character-on-white-background-vector-43705524 
knightLogo: https://opengameart.org/content/lpc-medieval-fantasy-character-sprites 
weapon1: https://www.pikpng.com/pngvi/hiwiiTm_saber-png-holy-swords-clipart/ 
weapon2: https://www.freepik.com/premium-vector/ice-sword-magical-vector_69860956.htm
weapon3: https://www.rolimons.com/item/15750643884 
weapon4: https://www.rolimons.com/item/15083851056 
weapon5: https://www.alamy.com/bow-with-arrow-design-of-weapon-and-archery-theme-vector-illustration-image381026195.html 
weapon6: https://wiki.guildwars.com/wiki/Fire_Wand 
weapon7: https://medievalbritain.com/type/medieval-life/weapons/medieval-dagger-knife/ 
weapon8: https://www.wulflund.com/stredoveka-sekera-pro-polstarove-bitvy
weapon9: https://dragon-quest.org/wiki/Staff_of_salvation
weapon10: https://www.freepik.com/premium-ai-image/stylized-medieval-helmet_112564698.htm
weapon11: https://www.freepik.com/premium-ai-image/magic-ring-with-electricity-around-dungeons-dragons-style_78070245.htm
weapon12: https://www.pixelsquid.com/png/cloak 

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

(ReadMe For CA1 is placed below for reference on new backend endpoints, new table (review) and updated elements)


---------------------------------------------------------------(Start Of CA1 ReadMe) - -------------------------------------------------------------------------------------------
# Starter Repository for Assignment
You are required to build your folder structures for your project.


# Back End Web Development CA1 
Survey System with Gamification Elements

## Packages Installed
- Express
- MySql2
- Nodemon
- dotenv
- jsonwebtoken
- bcrypt

## Installation
To install the dependencies listed above for my project:
  - npm install 

## Scripts
Start the My CA1 Server and initialize tables
  - npm run dev


## Tables
Section A Tables

User Table
- username
- points

UserAnswer 
- answer_id
- answered_question_id
- participant_id
- answer
- creation_date
- additional_notes

SurveyQuestion
- question_id
- creator_id
- question

Section B Tables

CharacterUserRel
- id
- character_id
- user_id

This table helps associate the users (Section A) with their respective Characters (Section B)

Characters
- character_id
- character_name
- character_level
- character_xp
- character_silver
- character_gold
- character_battle_id
- character_battles_won

This is the characters table. Once the user creates the character, the user's points will be transffered to silver for his/her character. The character will then have to play battles to earn gold to spend in the shop for better weapons and to spin for greater items. The character will also level up as he gains xp through playing battles. Other stats like character_battle_id represent which battle he is undergoing at that moment, character_battles_won shows how many battles the character has won.


Shop
- item_id
- item_owner_id
- item_name
- item_description
- item_cost
- item_damage
- item_type
- item_rarity
- spin_cost 

This is the shop table which consists of all the relevant information of the item like name, description , cost, damage, type and rarity. If item_owner_id is null it means it is a default item in the shop, if it has a number it means it is an item that a character has listed to sell. The spin_cost is stored to be used when the character spin the lucky spin and have to pay a certain amount of gold.

Inventory
- id
- item_id
- owner_id

This is the inventory for the characters. The item_id is a direct reflection of the shop table's item_id this ensures data integrity and ensures all items that character owns is from the shop. The owner_id represents the character that owns the item.


Rarity 
- id
- rarity
- rarity_chance
- rarity_rank

This is the rarity table that stores important information about rarities for the items. rarity_rank is used for the sorting item_rarity by ascending or descending logic. rarity_chance is used for the lucky spin logic in the shop.

Reviews 
- id
- review_amt
- user_id
- created_at
- review_text
This is the reviews table that stores reviews by the user of our website. The assignment provided table did not have "review_text", I added "review_text" a non-compulosry but present field for users to be more expressive in their review.






## How to play my game
After downloading the required packages listed in the packages installed section, do a npm run dev. This will initialize the databases and tables and start the program. You can test all my endpoints that I provided in the document. You can also start by creating a user (Section A) then complete the questions to earn points, once you are satisified with the amount of points you can create a character. When you create your character all your user points will be converted to silver. You can use this silver to start playing battles. Once you played enough battles and earn enough gold. You can go to the shop to buy or lucky spin to get better weapons fro your inventory. You can check your inventory anytime and sort/filter your inventory however you'd like to see all your items. Once you reach level 5 you can consider selling some items in the shop to earn gold. Once you reached {master} status which is level 10, you can now post battles to have more control over the game. If you'd like to have a more administrative role in the game, you can go post, update or delete items in the /shop url. If you don't know which url to go to for any particular section, you can view the README.md and go to the section you want and see where to go! I hope you enjoy my Infused Gamification!



# Folder Structure (not including node_modules)  
|-- src
|   |-- configs
|   |   |-- initTables.js
|   |-- controllers
|   |   |-- userController.js
|   |   |-- questionController.js
|   |   |-- characterController.js
|   |   |-- battleController.js
|   |   |-- shopController.js
|   |-- models
|   |   |-- userModel.js
|   |   |-- questionModel.js
|   |   |-- characterModel.js
|   |   |-- battleModel.js
|   |   |-- shopModel.js
|   |-- routes
|   |   |-- mainRoutes.js
|   |   |-- userRoutes.js
|   |   |-- questionRoutes.js
|   |   |-- characterRoutes.js
|   |   |-- battleRoutes.js
|   |   |-- shopRoutes.js
|   |-- services
|   |   |-- db.js
|   |-- app.js
|-- .env
|-- .gitignore
|-- index.js
|-- package.json
|-- package-lock.json
|-- README.md

(view it in vscode)



# Endpoints
## Section A
1. POST /users  (Register) (Done)
Create a new user by providing their username in the request body. Upon successful creation, the response should include the newly generated user_id 


2. GET /users (users.htm) (Done)
Retrieve a list of all users with their respective user_id, username, and points.



3. GET /users/{user_id}  (Done)
Retrieve details of a specific user by providing their user_id. The response should include username, points, number of completed questions and points earned by the user



4. PUT /users/{user_id}  related to register (In Profile)   (DONE)
Update user details by providing user_id in the URL and updating username in the
request body.




5. POST /questions Seperate button  (Done)
Create a new survey question by providing user_id, question in the request body. Upon successful creation, the response should include the newly generated question_id, the user_id will be inserted as creator_id.




6. GET /questions  (done surveyList) (DONE)
Retrieve a list of all questions with their respective question_id, question, and creator_id



7. PUT/questions/{questions_id}   (DONE)
Update question details by providing question_id in the URL and updating questions in the request body



8. DELETE /questions/{question_id} (Done)
Delete a question by providing its question_id. The question's associated user answer, if any, should also be deleted



9. POST /questions/{questions_id}/answers  (Done)
Create an answer from a user  by providing question_id in URL parameter and user_id, answer, creation_date, and additional_notes in the request body.
After add the question must give user points 




10. GET /questions/{questions_id}/answers  (Done)
Retrieve answers given by participant on a particular question by providing its questions_id. The response should include participant_id, creation_date, answer, and additional_notes



11. Advanced/Extra feature for Section A -> leaderboard system for users to see who has most points
GET /users/leaderboard (DONE)
Used Rank () function and Over() to rank the user based on their points.

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
## Section B
Game Title: Battle Berzerk: Heroic Clash
Theme: Fantasy Adventures (endpoints to manage battles, characters, shop, and more)


BATTLES SECTION
- This section is for Characters who have reached level 10 and wish to have more control over the game. Here they can make , update, and delete battles to the game. It makes the game more unique and fun as different characters with different input and creativity can help make the game more fun and imaginative.

- These endpoints relate to getting battles and creating the battles

1. GET /battles  (Almost done -> battles.html) (DONE)
Get all battles available

2. GET /battles/battle_id   (DONT NEED) MORE FOR ADMIN
Get a battle by battle_id

3. POST /battles (DONT NEED) MORE FOR ADMIN
Create a New Battle. Ensure character name provided has a minimum level of 10
201, 400, 409, 404 -> accounted for 4 situations

4. PUT /battles/battle_id (DONT NEED) MORE FOR ADMIN
Update a Battle by battle_id. Ensure character name provided has a minimum level of 10.
200, 400, 404,

5. DELETE /battles/battle_id (DONT NEED) MORE FOR ADMIN
Delete a battle with a specific battle_Id
204, 400, 404
--------------------------------------------------------------------------------------------------------------------------------------------------------

CHARACTERS SECTION
Creating Characters

- These endpoints relate to managing characters, getting character_battle_id to battle and more

6. GET /characters   (almost done -> characters.html) (USED CHARACTER/CHARACTER_ID INSTEAD)
This endpoint gets all the characters that are in the game.
200
7. GET /characters/character_id  (DONE)
This endpoint gets a specific character with a specific character_id
200,404
8. DELETE /characters/character_id (HAVENT) -> BUT IDT NEED CUZ WE GONNA USE DELETE /USER/USERID/CHARACTERS/CHARACTER_ID
This endpoint helps to delete a specific character with a specific character_id
204, 404
----------------------------------------------------------------------------------------------------------------------------------------------------------------------

CHARACTERS-BATTLE SECTION (related to higher game interactivty section)
- These endpoints help characters view available battles for characters to accept etc.

9. GET /characters/character_id/battles  (DONE)
Get the battles for character to view and select
200 ,404

10. PUT /characters/character_id/battles   (DONE )
req.body has "battle_id" to update "character_battle_id" part of the characters/
200, 404

flow: to update character_battle_id and for the character to play the battle 
  -> 1. /characters/1 to see what character_battle_id the character has, 2. Go to PUT /characters/1/battles with "battle_id":x in the body to update the character_battle_id the character has, 3. /characters/1/battleinstance (related to higher game interactivity section)

--------------------------------------------------------------------------------------------------------------------------------------------------------------------
SHOP SECTION

- These endpoints relate to managing shop, mainly for administrative purposes.


11. GET /shop  
Get all items available
200
12. GET /shop/item_id
Get a item from the shop by item_id
200, 404
13. POST /shop
Create a New item. 
200, 400, 409 (if item name alr exists )

14. PUT /shop/item_id
Update a item by item_id. 
200, 400, 404, 409
15. DELETE /shop/item_id
Delete an item with item_id from the shop
204, 404
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

HIGHER GAME INTERACTIVITY SECTION (Endpoints 16 - 18)

- This section is designed to allow characters to fight monsters in battleinstance. They will GET The battleinstance which will have the monster info and most importantly monster_hp, they will then add /inventory to the route to view the weapons they have to attack the monster with, finally they will remove /inventory from the route and PUT "weapon_id" of the weapon they chosen and the weapon damage will be dealt to the boss. Once the boss is defeated the character will earn gold and xp and the character_battle_id is set to null.

Notes: EACH character can only embark on 1 Battle AT A TIME. When Character defeats the boss its character_battle_id will be removed and set to null, preventing the character from playing it again. When Character has no character_battle_id, can select one from the Character's Section Endpoint B10

- These endpoints are intended to let characters fight battles by selecting their weapons. When they defeat the monsters , they get gold which they can spend in shop. 

Part 1 - GET battleinstance for specific character  (DONE)
16. GET /characters/character_id/battleinstance
This endpoint basically gets the specific character's battleinstance which is like the monster itself with the hp and battle steps. This is done by getting character_battle_id
200, 404

Part 2 - Add /inventory to route and Provide Weapons character has in his/her inventory which is weapons the character owns. 
17. GET /characters/character_id/battleinstance/inventory (DONE)
Get all weapons owned by the specific character, then the character will be asked to choose a weapon they have to deal damage with in the next endpoint. It will go through the character inventory and only show the weapons to the character
200, 404 , 400

Part 3 - Remove /inventory from route. Then, PUT weapon_id to the req.body. The controllers will check for the damage that the weapon deals and subtract it from monster health. 
18. PUT /characters/character_id/battleinstance   (DONE)
Once monster is defeated, the character will earn x amount of gold and y amount of xp. If they hit a certain level of xp they can level up and if they reach 1000xp or more they get to level 10 where they are a master and have '{master}' added to their character_name.
The character_battle_id will be set to null (explained in the last controller of part 3). Rememmber each character can only embark on 1 battle at a time. 
fixed the {master} duplication issue with "${master}"

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Character-Shop Interactivity
- This section is designed to allow character to buy, sell and spin for various items of variours ratiy and various types. To buy an item they simply have to put the "item_id" of the item they desire in a put request. To sell, they have to ensure they are level 5 or above to sell and put the "item_id" in a post request. If another character buys their weapon they'll earn gold. Lastly, for the spin, it introduces excitement and an element of surprise to the game by allowing them to spend gold to spin for a chance to win "Legendary" or "Epic" items which can really level up their progress in the game. There are 2 item_types "weapons" and "others" which they can buy. Weapons are used to attack and defeat bosses while others are for the characters to feel a sense of customization while playing the game.

- Once the character defeats battle, they will earn gold. This gold can be spent in the shop where they can buy weapons, sell weapons and even lucky spin.

Routes: /characters/character_id/shop 

BUY 
Part 1 - GET shop interface for character to view which item he wants
19. GET /characters/character_id/shop  (DONEEEEE)
GET a personalized and interactive Shop with character name and character gold for the character.
200, 404


Part 2 - PUT the item into character inventory table and subtract from characer_gold
This endpoint will help the character buy the item that he/she wants to purchase
20. PUT /characters/character_id/shop  (DONEEEE)




The request body will be the "item_id" of the item in the shop that the character wants to purchase
req.body: "item_id": x

SELL 
21. POST /characters/character_id/shop/sell (DONEEE) (Put it in inventory)
req.body: item_id 
req.params: character_id
 character that post the item cannot buy back his item
200, 400 ,404


(Advanced shop feature: Lucky Spin)

Spin (maybe below the shop listings or a button to click and redirect to spin.html with spin effect all that remember inventory need ascending all that)
22. GET /characters/charcter_id/shop/spin (don't need cuz not really needed since the stuff is all from shop)
Get the spin interface which shows available items up for grabs and the amount of gold it costs for one spin
The endpoint will use the rarity table

Rarity Chances (in Rarity Table )-> Common: 40 , Uncommon: 30, Rare: 15,  Epic: 10,  Legendary: 5

23. PUT /characters/character_id/shop/spin (Done)
Empty PUT Req cuz we only need character_id to check gold then spin and get a random rarity based on the probabilites then get random item from shop with that rarity and then give to character inventory. 
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



(User-Character Interactivty) 
- The User in Section A owns Characters in Section B. We need a CharacterUserRel Table to associate them together then in usercontroller, model, routes we can see user-character info. 
- Important: The User points earned in Section A is equal to the Characters silver whcih will be used to battle. By right need like some foreign key to link and make it equal, but since BED resources never taught that I did a simple UPDATE query which use INNER JOIN to trnasfer user points to character_silver.

routes: /user/user_id/characters


Endpoint B24 - 29
Endpoints below all start from /users except last one where it starts at /characters

24. POST /users/:user_id/character/   (DONEEEEEEEEEEEEEEEEEEEE)
This endpoint is to create a new Character (From Section B) and associate it with a user (From Section A). Details needed For User To Create The Chracter -> Character name. Thats it because the rest is earned through playing the game and the points will automatically be transffered to user character. Need to adjust the UPDATE where link points and silver. Need to remove NOT NULL From most Character columns
201, 400, 404

25. GET /users/user_id/character/character_id  (DONT REALLY NEED, FOR NOW)
GET request to retrieve a specific character associated with a user
200, 400, 404

26. GET /users/:user_id/character/  (DONE)
GET request to retrieve all characters associated with a user
200, 404

27. PUT /users/:user_id/character/:character_id  (DONE)
PUT request to update a specific character associated with a user
200, 400,
28. DELETE /users/:user_id/characters/character_id  (DONE)
DELETE request to delete a specific character associated with a user
204, 404

29. GET /characters/users (DONT RLY NEED)
/characters/users because thats how we defined it in mainRoutes
GET Information about all characters using the CharacterUserRel Table
200, 404

 We just managed to link the User points to be silver for the characters that the users create. This allows them to use the silver and play battles and rank up buy stuff etc.
Now we need to actually make characters pay silver to participate in battles.


Now we managed to get the logic right, so when user boots up server they have 0 points then they complete qns and get maybe 40 points. They then create a character and their 40 points will be converted to 40 silver. Once converted, points will be set to 0 and they have to do qns again. So when boot up should be 0 ah basically. Then when then create a new character the points are transffered.

---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Character-Inventory Section
 -> Check what the character owns using both Inventory and Shop table , allow character to delete item 

30. GET /characters/character_id/inventory  -(DONEE)
This gets the characters entire inventory with all his "weapons" or "others"
200, 404


31. DELETE /characters/character_id/inventory   (DONEE)
This helps the character delete any item from his invetory that he does not like and would like to discard.
204, 400

Sort -> ascending/descending rarity/damage -> (Endpoint 32 - 25)

32. GET /characters/character_id/inventory/rarity/ascending (Done)
This endpoint helps the character sort his items based on ascending rarity.
200, 404 

33. GET /characters/character_id/inventory/rarity/descending (Done)
This endpoint helps the character sort his items based on descending rarity.
200, 404

34. GET /characters/character_id/inventory/damage/ascending (Done)
This endpoint helps the character sort his items based on ascending damage.
200, 404

35. GET /characters/character_id/inventory/damage/descending (Done)
This endpoint helps the character sort his items based on descending damage.
200, 404

Filter -> By rarity or By type  (Filter -> Endpoint 36 - 38)

36. GET /characters/character_id/inventory/rarity/:rarity_grade (Done)
This endpoint helps the character filter based on a specific rarity like "Common", "Uncommon" , "Rare", "Epic", "Legendary"

37. GET /characters/character_id/inventory/type/:item_type (Done)
This endpoint helps the character filter based on a specific type like "weapon" or "others"

// Similar to Advanced feature of Section A 
38. GET /characters/leaderboard (DONE) fixed the {master} duplication issue with "${master}"
This endpoint shows the character leaderboard which is based on the character level, it also shows other information like character_battles_won. This increases the competition element of the game which motivates characters to keep on playing the Section B game and also the Section A survey system to earn more points to use as silver in the Section B game.
---------------------------------------------------------------------------------------------------------------
FOR CA2 REVIEWS IMPLEMENTATION
39. GET /review -> jus shows all reviews -> id, review_amt, user_id, created_at  (DONE)

40. POST /review -> To post an actual review -> req.body: {"user_id":5, "review_amt":1} (DONE) but need validation

41. GET /review/:id -> GET a specific review by Id

42. PUT /review/:id -> Update a review like its review_amt (stars) and review text  (DONE)

43. DELETE /review/:id Delete a review (should be ur own review) (DONE)
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
New Backend Endpoints For CA2
For Topping up silver when the character run out of silver
44. PUT  /users/:user_id/character/:character_id/topup (DONE)
This is to top up silver for a specific character because when you create a new character all your points transferred to character and then if you run out you can't get silver anymore, this functions allows users to top up their silver.

For heal monster, currently when I leave the page after dealing like damage to monster, When I go back to the instance the health is still that same health, even when I login as another user the health state is the same. So Imma make it so that when the character leave the page, a backend req send to this backend to heal the specific monster.
This endpoint is related to endpoints 16 - 18 (Higher Game Interactivity)
45. PUT /characters/character_id/battleinstance/healMonster (DONE)


46. /users/guide (DONE)
A guide to the entire website of Survey + Game

----------













# Additional notes
1. For the scripts in package.json, I did a  "dev": "node src/configs/initTables.js & nodemon index.js" which is more efficient that separating them two. Thus, making the server-running process more convenient


2. For Section A I added an "Advanced Feature" Which basically a leaderboard that ranks user based on points they earn. This competitive system motivates them to complete more surveyquestions. Used Rank () function to rank them OVER (points).


3. For Section B, I added an "Advanced Feature" -> Lucky Spin. It uses "rarity_chance" found in rarity tables to get the rarity by some randomizer logic. Then It selects 1 random item with that rarity in the shop. This effectively means the character will get a random item with a random rarity when they do a lucky spin in the shop. Rarer Rarities have lower
 rarity_chance so they are harder to get. This motivates the characters to play more battles and earn more gold to spin the wheel for Epic or Legendary Items.


4. There are only 2 types of item_types in Section B: "weapons" and "others"


5. Weapons can actually be used to attack bosses in battles. But "others" don't have any real impact on the game other than for the character to feel a sense of customization for their characters with Helmet, Ringa, and cloaks. However, both weapons and "others" items can be sold in the shop for gold


6. In shop, you can buy, sell, and lucky spin. If an item has a "null" item_owner_id it means that it is a default item in the shop. If it has a number, it means that it is an item that is sold by another character and buying it means the character will get x amount of gold and the item will be removed from the shop.

7. When character sells an item, the item_id is removed from his inventory. 


8. Inventory table has item_id and owner_id, item_id links to the Shop table so basically all Inventory items with item_id is from the shop. 


9. When a character creates a new character, he gets a basic and default weapon that is the first item in the shop. This is so the character can fight battles immediately but with a weak weapon that takes ages to defeat bosses. 

10. I have a few predefined users and characters that are just used for demonstrating the functions of section A and B. The user with my name has much gold and silver to show the features during demonstration or for the reviewer to try out the different aspects of the section A or section B.

11. For character levelling system the below is how to calculate the levels:

12. By right everytime a new character is created he will get a basic weapon from the shop as mentioned earlier that can be used for him to play battles but with weak damage. For Endpoint B17 when they ask the character to go to /inventory, the only way his inventory will be empty is if he chooses to delete all his items in the "/characters/character_id/inventory" url. Otherwise a character will always have a basic weapon in his inventory. Endpoint B17 - 404

Character-Level Interactivty
- jus added xp to the characters and when the defeat the boss they earn xp 

Levelling system:
Level 1: 100 XP
Level 2: 200 XP
Level 3: 300 XP
Level 4: 400 XP
Level 5: 500 XP
Level 6: 600 XP
Level 7: 700 XP
Level 8: 800 XP
Level 9: 900 XP
Level 10: 1000 XP

When character reaches level 5 he/she can start selling items in the shop for more gold to use in their game-playing experience.
When character reaches level 10 he/she becomes a master and can start making battles. 



// May need to create a new user routes to get All characters owned by the user_id

Endpoint 39

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- (END OF README For CA1)

