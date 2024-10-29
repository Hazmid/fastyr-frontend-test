import { redirect } from "next/navigation";

export default function Home() {
  // set /users route as default
  redirect("/users");
  return null;
}
