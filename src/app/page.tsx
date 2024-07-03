import BEAR1 from '@/assets/images/Bear1.png';
import BEAR2 from '@/assets/images/bear2.png';
import BEAR3 from '@/assets/images/bear3.png';
import BEAR4 from '@/assets/images/bear4.png';
import BEAR5 from '@/assets/images/bear5.png';
import Image1 from '@/assets/images/image1.svg';
import Image2 from '@/assets/images/image2.svg';
import Image3 from '@/assets/images/image3.svg';
import RectangleBottom from '@/assets/images/Rectangle_b.svg';
import RectangleTop from '@/assets/images/Rectangle_t.svg';
import {
  faDiscord,
  faGithub,
  faMedium,
  faTelegram,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MoveUpRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from './components/ui/button';

export default function Home() {
  return (
    <div className="">
      <div className="relative space-y-10 overflow-hidden px-5 pb-28 md:px-20 md:pt-5">
        <Image
          src={RectangleTop}
          alt="image"
          className="absolute -right-[100px] top-[170px] w-[200px] lg:right-0 lg:top-0 xl:w-[400px]"
        />
        <Image
          src={Image1}
          alt="image"
          className="absolute right-[100px] top-[230px] w-[150px] sm:top-[180px] md:top-[300px] lg:right-[200px] lg:top-[20px] lg:w-[200px] xl:right-[300px] xl:w-[250px]"
        />
        <Image
          src={Image2}
          alt="image"
          className="absolute left-[20px] top-[270px] w-[150px] sm:top-[200px] md:top-[350px] lg:left-[15%] lg:w-[200px] xl:w-[250px]"
        />
        <Image
          src={Image3}
          alt="image"
          className="absolute bottom-[180px] right-[70px] w-[150px] lg:right-[15%] lg:w-[200px] xl:w-[250px]"
        />
        <Image
          src={RectangleBottom}
          alt="image"
          className="absolute -left-[100px] bottom-[100px] w-[200px] lg:bottom-[-50px] lg:left-0 xl:w-[400px]"
        />
        <div className="max-w-[640px]">
          <h1 className="font-luckiestGuy text-6xl uppercase text-content-gray/[6] opacity-[0.08] max-md:text-center md:text-9xl">
            moniswap
          </h1>
          <p className="text-base md:text-xl">
            Moniswap is a next-generation AMM that combines the best of Curve,
            Convex and Uniswap, designed to serve as the liquidity hub for the
            Berachain. Moniswap&apos;s flywheel allows protocols to build deep
            liquidity in a capital-efficient manner by directing $MONI emissions
            to their pools. Docs!
          </p>
        </div>

        <Image
          src={BEAR1}
          alt="bear"
          className="z-1 relative m-auto pt-28 lg:py-0"
        />

        <div className="flex w-full items-center justify-center gap-5">
          <Button variant="primary">Swap</Button>
          <Button variant="secondary">Join Quest</Button>
        </div>

        <div className="flex items-center justify-center gap-5 pt-32 lg:pt-10">
          <span className="">
            <FontAwesomeIcon icon={faTelegram} width={50} />
          </span>
          <span className="flex size-[50px] items-center justify-center rounded-full bg-white text-black">
            <FontAwesomeIcon icon={faXTwitter} width={30} />
          </span>
          <span className="flex size-[50px] items-center justify-center rounded-full bg-white text-black">
            <FontAwesomeIcon icon={faDiscord} width={30} />
          </span>
          <span className="flex size-[50px] items-center justify-center rounded-full bg-white text-black">
            <FontAwesomeIcon icon={faGithub} width={30} />
          </span>
          <span className="flex size-[50px] items-center justify-center rounded-full bg-white text-black">
            <FontAwesomeIcon icon={faMedium} width={30} />
          </span>
        </div>
      </div>

      <div className="relative px-5 md:px-20">
        <h2 className="ml-auto max-w-[840px] text-right text-2xl md:text-5xl">
          Designed to reward participants that enable the sustainable growth of
          the protocol.
        </h2>

        <div className="mt-20 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col justify-between bg-footer">
            <div className="space-y-4 px-4 pb-10 pt-4">
              <div className="flex items-start justify-between">
                <p className="font-barlow text-6xl text-content-gray opacity-[0.18]">
                  01
                </p>
                <div className="rounded-full bg-black1 p-3 text-arrow-yellow">
                  <MoveUpRight size={18} />
                </div>
              </div>
              <p className="text-[15px] leading-6">
                Traders swap tokens with minimal slippage and pay some of the
                lowest fees to MONI lockers.
              </p>
            </div>
            <div className="bg-btn-primary pt-8">
              <Image src={BEAR5} alt="bear" className="m-auto" />
            </div>
          </div>

          <div className="flex flex-col justify-between bg-footer">
            <div className="space-y-4 px-4 pb-10 pt-4">
              <div className="flex items-start justify-between">
                <p className="font-barlow text-6xl text-content-gray opacity-[0.18]">
                  02
                </p>
                <div className="rounded-full bg-black1 p-3 text-arrow-yellow">
                  <MoveUpRight size={18} />
                </div>
              </div>
              <p className="text-[15px] leading-6">
                Liquidity providers deposit the tokens used for trading on
                Moniswap and receive MONI emissions as rewards.
              </p>
            </div>
            <div className="bg-btn-primary pt-8">
              <Image src={BEAR3} alt="bear" className="m-auto" />
            </div>
          </div>

          <div className="flex flex-col justify-between bg-footer">
            <div className="space-y-4 px-4 pb-10 pt-4">
              <div className="flex items-start justify-between">
                <p className="font-barlow text-6xl text-content-gray opacity-[0.18]">
                  03
                </p>
                <div className="rounded-full bg-black1 p-3 text-arrow-yellow">
                  <MoveUpRight size={18} />
                </div>
              </div>
              <p className="text-[15px] leading-6">
                Protocols incentivize veMONI voters to attract votes and MONI
                emissions to their pools, enabling them to build liquidity
                cost-effectively.
              </p>
            </div>
            <div className="bg-btn-primary pt-8">
              <Image src={BEAR4} alt="bear" className="m-auto" />
            </div>
          </div>

          <div className="flex flex-col justify-between bg-footer">
            <div className="space-y-4 px-4 pb-10 pt-4">
              <div className="flex items-start justify-between">
                <p className="font-barlow text-6xl text-content-gray opacity-[0.18]">
                  04
                </p>
                <div className="rounded-full bg-black1 p-3 text-arrow-yellow">
                  <MoveUpRight size={18} />
                </div>
              </div>
              <p className="text-[15px] leading-6">
                veMONI voters vote on which pools will earn MONI emissions and
                receive all incentives and fees. Any MONI holder can lock their
                tokens to convert to veMONI.
              </p>
            </div>
            <div className="bg-btn-primary pt-8">
              <Image src={BEAR2} alt="bear" className="m-auto" />
            </div>
          </div>
        </div>

        <div className="mt-20 space-y-10 pb-20 text-center">
          <p className="m-auto max-w-[400px] text-2xl md:text-3xl">
            Looking to get started with Moniswap?
          </p>

          <Button variant="primary">Onboarding Guide</Button>

          <p className="font-luckiestGuy text-6xl uppercase opacity-[0.08] md:text-9xl">
            moniswap
          </p>
        </div>
      </div>
    </div>
  );
}
