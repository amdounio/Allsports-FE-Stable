// Previous type definitions remain the same...

export interface Match {
  id: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string;
  awayTeamLogo: string;
  status: {
    long: string;
    short: string;
    elapsed: number | null;
    extra: any;
  } | string;
  address: string;
  startDate: Date | string;
  endDate: Date | string;
  periods: {
    first: number;
    second: number;
  };
  firstTeam?: {
    id: number;
    name: string;
    logo: string;
  };
  secondTeam?: {
    id: number;
    name: string;
    logo: string;
  };
  championship?: any;
  generatedVisuals?: {
    story: string;
    square: string;
    view: string;
  };
}