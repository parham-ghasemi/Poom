import { cx } from 'class-variance-authority';
import Image from 'next/image'
import React from 'react'

interface HomeCardProps{
  img: string;
  title: string;
  desc: string;
  color: string;
  onClick: () => void;
}

const HomeCard:React.FC<HomeCardProps> = ({img, title, desc, color, onClick}) => {
  return (
    <div
      className={cx('px-4 py-6 flex flex-col justify-between w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer', color)}
      onClick={onClick}
    >
      <div className="flex-center glassmorphism size-12 rounded-[10px]">
        <Image src={img} alt={title} width={27} height={27} />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-lg font-normal">{desc}</p>
      </div>
    </div>
  )
}

export default HomeCard