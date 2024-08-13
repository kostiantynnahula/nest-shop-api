export interface GoogleCallbackResponse {
  user: GoogleCallbackUserResponse;
}

export interface GoogleCallbackUserResponse {
  email: string;
  name: string;
  picture: string;
}
