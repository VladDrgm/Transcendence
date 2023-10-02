export interface MatchHistoryItem {
    MatchId: number;
    Player1Id: number;
    Player2Id: number;
    Player1Points: number;
    Player2Points: number;
    GameType: string;
    FinalResultString: string;
    startTime: string;
    endTime: string;
    WinnerId: number;
    WinningCondition: string;
  }