export interface IPlayerRegistrationDTO {
  name: string;
  email: string;
  password: string;
  accessType?: 'player' | 'admin';
  status?: 'active' | 'inactive';
}
