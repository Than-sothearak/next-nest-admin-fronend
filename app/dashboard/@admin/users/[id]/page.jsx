import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UserForm from "@/components/(users)/UserForm";
import { getServerSession } from "next-auth";

export default async function singleUserPage(props) {
  const session = await getServerSession(authOptions);

  const params = await props.params;
  const id = await params.id;
  const res = await fetch(`http://localhost:3000/users/${id}`, {
    method: "GET",
    headers: {
         "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
    },
  });
  const user = await res.json();
  if (!user) {
    return <p className="text-red-500">User not found!</p>;
  }
  
  return (
    <>
      <UserForm userId={id} userData={user} session={session} />
    </>
  );
}
