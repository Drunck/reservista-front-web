import { TRestaurant } from "@/lib/types";
import { FacebookIcon, GlobeIcon, InstagramIcon, PhoneIcon } from "@/ui/custom-components/icons";
import Link from "next/link";

export default function AboutSection({restaurant}: {restaurant: TRestaurant}) {
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-row items-center px-4 py-2 bg-white rounded-lg shadow-[0px_2px_8px_0px_#63636333] border border-gray-200/50">
        <p>Everyday 11:00 AM - 11:00 PM</p>
      </div>
      <div className=" flex flex-col px-4 pt-2 pb-4 bg-white rounded-lg shadow-[0px_2px_8px_0px_#63636333] border border-gray-200/50">
        <p className="text-[--dark-gray-color] font-semibold">Restaurant Contact</p>
        <div className="mt-2">
          <div className="flex flex-row">
            <PhoneIcon className="w-5 h-5" />
            <p className="text-[--dark-gray-color] ml-1">{restaurant.contact}</p>
          </div>
          <div className="flex flex-row mt-2 items-center gap-x-2">
            <Link href="#">
              <InstagramIcon className="w-4 h-4" />
            </Link>
            <Link href="#">
              <FacebookIcon className="w-4 h-4" />
            </Link>
            <Link href="#">
              <GlobeIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col px-4 pt-2 pb-4 bg-white rounded-lg shadow-[0px_2px_8px_0px_#63636333] border border-gray-200/50">
        <p className="text-[--dark-gray-color] font-semibold">About</p>
        <div className="mt-2">
          <p className="text-[--dark-gray-color]">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Labore deleniti sit numquam iure, quia distinctio? Odit consequatur enim tempora, eum nihil amet repudiandae ullam beatae minus placeat, error laudantium. Officiis.</p>
        </div>
      </div>
    </div>
  )
}
