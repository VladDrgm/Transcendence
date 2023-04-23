// Users
const users = [
	{
	  userId: 1,
	  nickname: "Alice",
	  avatar: "https://example.com/avatar/alice.png",
	  wins: 10,
	  losses: 5,
	  ladderLevel: 8,
	  status: "active",
	  achievements: "completed level 5",
	  passwordHash: "hash1",
	},
	{
	  userId: 2,
	  nickname: "Bob",
	  avatar: "https://example.com/avatar/bob.png",
	  wins: 12,
	  losses: 2,
	  ladderLevel: 10,
	  status: "inactive",
	  achievements: "completed level 10",
	  passwordHash: "hash2",
	},
	{
	  userId: 3,
	  nickname: "Charlie",
	  avatar: "https://example.com/avatar/charlie.png",
	  wins: 8,
	  losses: 6,
	  ladderLevel: 6,
	  status: "active",
	  achievements: "completed level 3",
	  passwordHash: "hash3",
	},
	{
	  userId: 4,
	  nickname: "David",
	  avatar: "https://example.com/avatar/david.png",
	  wins: 15,
	  losses: 1,
	  ladderLevel: 12,
	  status: "active",
	  achievements: "completed level 12",
	  passwordHash: "hash4",
	},
	{
	  userId: 5,
	  nickname: "Eve",
	  avatar: "https://example.com/avatar/eve.png",
	  wins: 3,
	  losses: 7,
	  ladderLevel: 3,
	  status: "inactive",
	  achievements: "completed level 1",
	  passwordHash: "hash5",
	},
  ];
  
  // Friends
  const friends = [
	{
	  fId: 1,
	  friendId: 2,
	  userId: 1,
	  status: "online",
	},
	{
	  fId: 2,
	  friendId: 1,
	  userId: 2,
	  status: "online",
	},
	{
	  fId: 3,
	  friendId: 4,
	  userId: 1,
	  status: "offline",
	},
	{
	  fId: 4,
	  friendId: 3,
	  userId: 2,
	  status: "in game",
	},
	{
	  fId: 5,
	  friendId: 5,
	  userId: 1,
	  status: "away",
	},
  ];
  
  // Match
  const matches = [
	{
	  matchId: 1,
	  userId: 1,
	  opponentId: 2,
	  player1Points: 10,
	  player2Points: 8,
	  gameType: "standard",
	  finalResultString: "10-8",
	},
	{
		matchId: 2,
		userId: 3,
		opponentId: 4,
		player1Points: 10,
		player2Points: 9,
		gameType: "ladder",
		finalResultString: "10-9",
	}
];
  