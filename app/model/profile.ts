export type Profile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage: string;
  profileImageUrl: string;
  bio: string;
  webPage: string | null;

  affiliationId: string;
  affiliationName: string;
  
  hindex: number | null;
  citationCount: number | null;
  paperCount: number | null;
  isEmailPublic: boolean;
  isEmailVerified: boolean;
}