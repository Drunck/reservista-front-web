import UserPageMobileMenu from "./user-page-mobile-menu";

export default function UserPage({params}: {params: {userId: string}}) {
  const userId = params.userId;

  return (
    <UserPageMobileMenu userId={userId} />
  )
}
