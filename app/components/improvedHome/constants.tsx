interface JournalInfo {
  name: string;
  logoStyle: React.CSSProperties;
}

const textLogoStyle: React.CSSProperties = { height: '24px' };
const squareLogoStyle: React.CSSProperties = { height: '60px' };

export const JOURNALS: JournalInfo[] = [
  { name: 'nature', logoStyle: textLogoStyle },
  { name: 'science', logoStyle: textLogoStyle },
  { name: 'ieee', logoStyle: textLogoStyle },
  { name: 'cell', logoStyle: textLogoStyle },
  { name: 'acs', logoStyle: squareLogoStyle },
  { name: 'aps', logoStyle: squareLogoStyle },
  { name: 'lancet', logoStyle: textLogoStyle },
  { name: 'acm', logoStyle: squareLogoStyle },
  { name: 'jama', logoStyle: textLogoStyle },
  { name: 'bmj', logoStyle: textLogoStyle },
  { name: 'pnas', logoStyle: textLogoStyle },
  { name: 'more-journals', logoStyle: squareLogoStyle },
];

export const MOBILE_JOURNALS: JournalInfo[] = [
  { name: 'nature', logoStyle: textLogoStyle },
  { name: 'science', logoStyle: textLogoStyle },
  { name: 'lancet', logoStyle: textLogoStyle },
  { name: 'acm', logoStyle: squareLogoStyle },
  { name: 'ieee', logoStyle: textLogoStyle },
  { name: 'cell', logoStyle: textLogoStyle },
  { name: 'more-journal-mobile', logoStyle: squareLogoStyle },
];
