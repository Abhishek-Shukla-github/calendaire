import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import {PenBox} from "lucide-react"
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import UserMenu from "./user-menu";
import { FetchUser } from "@/lib/fetchUser";

const Header = async () => {
  await FetchUser()
  return (
    <nav className="mx-auto py-2 px-4 flex justify-between items-center shadow-md border-b-2">
      <Link href={"/"} className="flex item-center">
        <Image src={"/logo.png"} width={"150"} height={"100"} alt="Calendaire Logo" className="h-16 w-auto" />
      </Link>

      <div className="flex items-center gap-4">
        <Link href={"/events?create=true"}>
          <Button className="flex items-center gap-2"> <PenBox size={18} /> Create Event</Button>
        </Link>
        <SignedIn><UserMenu /></SignedIn>
        <SignedOut>
          <SignInButton forceRedirectUrl={"/dashboard"}>
            <Button variant={"outline"}>login</Button>
          </SignInButton>
        </SignedOut>
      </div>
    </nav>
  );
};

export default Header;
