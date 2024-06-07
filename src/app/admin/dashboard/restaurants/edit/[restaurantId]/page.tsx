"use client";

export default function page({params}: {params: {restaurantId: string}}) {
  const restaurantId = params.restaurantId;
  return (
    <div>restaurant id: {restaurantId}</div>
  )
}
