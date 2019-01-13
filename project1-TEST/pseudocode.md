# MMM (Mobile Marvel Memory game)

## Parts/screens

1. Welcome/initial
	- logo
	- title
	- instructions
	- music?
	- user input
		- Name
		- Country (for the flag API)
		- what if already played?
	- go play button!
	- dificulty mode (Easy: no time / Timed / Challenge)
	- Button to leaderboard


2. Game
	- logo
	- title
	- music?
	- Preset theme
	- amount of cards
	- quit
	- timer
	- play again
	- Button to leaderboard
	+ live chat


3. Leader board
	- one per mode
	- Show name and country flag (flag api) and scores (if avail)

	+ post/share on social media
	+ donate to the cause!


----------------
### GAME PART

1. Display ALL the cards face up static. random position
2. After X secs flip them. Start clock!
3. Click FIRST to flip (still static)
4. Click SECOND to flip (still static)
	+ If MATCH animate gif's and disapear after Y secs. Increase 'correct'
	+ If NOT MATCH flip back
5. When all cards matched
	+ Stop clock
	+ Inform you win
	+ Depending mode: give option to play again, move to next level.
	+ Give option to leave.
	+ Show your status vs the leaderborad

-------------------
### LEADER BOARD PART
- one table per mode:
	+ easy
	+ hard
	+ challenge
- Table of name, country (w/ flag) and score/level reach
- close


--------
### Logic

- Things to know:
	- Player name
	- PLayer country
	- What mode to play
		- Easy = no time, so we need the # of cards
		- Timed =  we need the # of cards, select time
		- Challenge = preset # of cards and time


----
### TO DO's

- Find out how the Marvel API works
