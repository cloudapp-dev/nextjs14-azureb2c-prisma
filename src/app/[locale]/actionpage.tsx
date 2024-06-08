// import UserCard from "@/components/user/userCard.component";
// import { getUsers } from "@/actions/getUsers";

// const INITIAL_NUMBER_OF_USERS = 10;

// export default async function Home() {
//   const initialUsers = await getUsers(0, INITIAL_NUMBER_OF_USERS);

//   return (
//     <div className="flex flex-col gap-3">
//       {initialUsers.map((user: any) => (
//         <UserCard key={user.id} user={user} />
//       ))}
//     </div>
//   );
// }

import UserList from "@/components/user/userList.component";
import { getUsers } from "@/actions/getUsers";

const INITIAL_NUMBER_OF_USERS = 10;

export default async function Home() {
  const initialUsers = await getUsers(0, INITIAL_NUMBER_OF_USERS);

  return <UserList initialUsers={initialUsers} />;
}
