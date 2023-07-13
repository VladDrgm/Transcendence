//   async getMatchResult(userId: number, friendId: number): Promise<string> {
//     const result = (await this.findMatchById(userId, friendId)).status;
//     return result;
//   }

//   async getMatchesResult(userId: number): Promise<string[]> {
//     const result = [];
//     const friends = await this.findUserMatchs(userId);

//     for (const match of friends) {
//       result.push(match.friendUser.status);
//     }

//     return result;
//   }
