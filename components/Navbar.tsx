import Image from "next/image"
import Link from "next/link"
import MobileNav from "./MobileNav"
import { SignedIn, UserButton } from "@clerk/nextjs"

const Navbar = () => {
  return (
    <nav className="flex justify-between fixed z-50 w-full bg-dark-1 px-6 py-4 lg:px-10">
      <Link href='/' className="flex items-center gap-1">
        <Image src="/icons/logo.svg" width={32} height={32} alt="Poom logo" className="mx-sm:size-10" />
        <p className="text-[26px] font-extrabold text-white max-sm:hidden">Poom</p>
      </Link>

      <div className="flex justify-between gap-5">
        <SignedIn>
          <UserButton appearance={{
            elements: {
              userButtonBox: "w-10 h-10",
              avatarBox: "w-10 h-10"
            }
          }} />
        </SignedIn>

        <MobileNav />
      </div>
    </nav>
  )
}

export default Navbar