import { Login } from "./Login";

export interface Register extends Login{
  firstName: string,
  lastName: string,
}
