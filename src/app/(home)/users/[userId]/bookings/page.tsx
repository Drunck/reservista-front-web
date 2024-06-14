
import UserBookingsComponent from "./user-bookings-component";

export default function UserBookingsPage({ params }: { params: { userId: string } }) {
  return (
    <UserBookingsComponent userId={params.userId} />
  );
}
