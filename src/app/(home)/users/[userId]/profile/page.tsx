import UserProfileComponent from "./user-profile-component";

export default function UserProflePage({params}: {params: {userId: string}}){

  return (
    <UserProfileComponent userId={params.userId}/>
  )
}
