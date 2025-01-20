import Image from "next/image"

const Loader = () => {
  return (
    <div className="flex-center h-screen w-full">
      <Image src="/icons/loading-Circle.svg" alt="loading circle" width={50} height={50} />
    </div>
  )
}

export default Loader