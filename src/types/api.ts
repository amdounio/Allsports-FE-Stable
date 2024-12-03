export interface AuthResponse {
  token: string;
  status: string;
  user: UserInfo;
  newUser?: boolean;
}

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  photoUrl: string | null;
  firstName: string;
  lastName: string;
  provider: string | null;
  acceptLegalPolicy: boolean;
  businessName: string;
  buisnessType: string;
  adresse: string;
  phone: string;
  companyName: string;
  newUser: boolean;
  role: string | null;
  plan: string;
  favoriteSport: string | null;
  favoriteLeague: string | null;
  establishmentCapacity: string | null;
  sports: string;
  frequencyMatchBroadcasts: string;
  monthlyBudgetEventPromotion: string;
  mainObjectiveUsing: string;
  devicesUsedAccess: string;
  commentsSpecificNeeds: string;
  password: string;
  ssoData: any;
  stripeCustomerId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: number;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  billingCycle: string;
  generated_images_count: number;
}

export interface GeneratedImages {
  match: any;
  date: string;
  story: string;
  square: string;
  view: string;
  generated_images_count: number;
}

export interface VisualGenerationError {
  code: string;
  message: string;
  status?: number;
}

export interface SaveToLibraryResponse {
  match: number;
  status?: string;
  error?: string;
}

export interface VisualGenerationResponse {
  story: string;
  square: string;
  view: string;
  error?: VisualGenerationError;
}